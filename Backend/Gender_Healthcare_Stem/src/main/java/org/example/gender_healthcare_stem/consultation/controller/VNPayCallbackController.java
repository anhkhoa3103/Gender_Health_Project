package org.example.gender_healthcare_stem.consultation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentRequest;
import org.example.gender_healthcare_stem.consultation.model.*;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationInvoiceRepository;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.example.gender_healthcare_stem.auth.model.Customer;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@RestController
@RequestMapping("/api/consultationpayment")
@CrossOrigin(origins = "*")
public class VNPayCallbackController {
    private final ConsultationAppointmentRepository appointmentRepo;
    private final ConsultationInvoiceRepository invoiceRepo;
    private final CustomerRepository customerRepo;
    private final WorkSlotRepository workslotRepository;

    // Injected from application.properties
    @Value("${vnpay.tmn_code}")
    private String vnp_TmnCode;
    @Value("${vnpay.hash_secret}")
    private String vnp_HashSecret;
    @Value("${vnpay.url}")
    private String vnp_Url;

    public VNPayCallbackController(
            ConsultationAppointmentRepository appointmentRepo,
            ConsultationInvoiceRepository invoiceRepo,
            CustomerRepository customerRepo,
            WorkSlotRepository workslotRepository
    ) {
        this.appointmentRepo = appointmentRepo;
        this.invoiceRepo = invoiceRepo;
        this.customerRepo = customerRepo;
        this.workslotRepository = workslotRepository;
    }

    // ---- VNPay Payment Creation Endpoint ----
    @PostMapping("/vnpay-create")
    public ResponseEntity<Map<String, String>> vnpayCreate(@RequestBody ConsultationAppointmentRequest appointmentRequest) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            // Set LOCALHOST for React dev, update for production!
            String vnp_ReturnUrl = "http://localhost:3000/consultation/payment-result";
            int amount = 150000 * 100; // Amount in VND x 100

            String vnp_TxnRef = String.valueOf(System.currentTimeMillis());

            ObjectMapper objectMapper = new ObjectMapper();
            String vnp_OrderInfo = objectMapper.writeValueAsString(appointmentRequest);

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", "127.0.0.1");
            vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String fieldName = fieldNames.get(i);
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (i < fieldNames.size() - 1) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);

            String paymentUrl = vnp_Url + "?" + query;

            Map<String, String> result = new HashMap<>();
            result.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> result = new HashMap<>();
            result.put("error", "Failed to create VNPay URL");
            return ResponseEntity.status(500).body(result);
        }
    }

    // ---- VNPay Callback Endpoint ----
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> vnpayReturn(@RequestParam Map<String, String> params
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            String responseCode = params.get("vnp_ResponseCode");
            String orderInfoJson = params.get("vnp_OrderInfo");
            String vnpTxnRef = params.get("vnp_TxnRef");
            String payTimeStr = params.get("vnp_PayDate"); // format: yyyyMMddHHmmss

            if (!"00".equals(responseCode)) {
                result.put("success", false);
                result.put("message", "Thanh toán thất bại hoặc bị hủy.");
                return ResponseEntity.ok(result);
            }

            // Check for duplicate invoice
            Optional<ConsultationInvoice> existingInvoice = invoiceRepo.findByPaymentTxnRef(vnpTxnRef);
            if (existingInvoice.isPresent()) {
                result.put("success", true);
                result.put("message", "Thanh toán đã được ghi nhận trước đó.");
                return ResponseEntity.ok(result);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            ConsultationAppointmentRequest appointmentRequest = objectMapper.readValue(orderInfoJson, ConsultationAppointmentRequest.class);

            Customer customer = customerRepo.findById(appointmentRequest.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // (Optional) Check for existing appointment logic here, if needed.

            ConsultationAppointment appointment = new ConsultationAppointment();
            appointment.setCustomerId(appointmentRequest.getCustomerId());
            appointment.setConsultantId(appointmentRequest.getConsultantId());
            appointment.setAppointmentDate(LocalDate.parse(appointmentRequest.getAppointmentDate()));
            appointment.setWorkslotId(appointmentRequest.getWorkslotId());
            appointment.setName(appointmentRequest.getName());
            appointment.setPhoneNumber(appointmentRequest.getPhoneNumber());
            appointment.setNote(appointmentRequest.getNote());
            appointment.setStatus("PENDING");
            appointment.setCreatedAt(LocalDateTime.now());
            appointment = appointmentRepo.save(appointment);

            ConsultationInvoice invoice = new ConsultationInvoice();
            invoice.setCustomer(customer);
            invoice.setConsultation(appointment);
            invoice.setAmount(150000.0);
            invoice.setPaymentMethod("vnpay");
            invoice.setPaymentTxnRef(vnpTxnRef);
            invoice.setPaymentResponseCode(responseCode);
            invoice.setPaymentTime(LocalDateTime.now());
            invoiceRepo.save(invoice);
            WorkSlot slot = workslotRepository.findById(appointmentRequest.getWorkslotId())
                    .orElseThrow(() -> new RuntimeException("Workslot not found"));
            System.out.println(">>> Workslot ID: " + appointmentRequest.getWorkslotId());
            slot.setIsAvailable(false);
            workslotRepository.save(slot);

            result.put("success", true);
            result.put("message", "Thanh toán thành công! Đơn đã được ghi nhận.");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Đã có lỗi xảy ra khi xác nhận giao dịch.");
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }


    // ---- Helper: HMAC SHA512 ----
    private static String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac512.init(secretKey);
        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hash = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hash.append('0');
            hash.append(hex);
        }
        return hash.toString();
    }
}