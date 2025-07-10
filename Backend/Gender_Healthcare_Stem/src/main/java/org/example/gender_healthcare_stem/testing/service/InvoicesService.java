package org.example.gender_healthcare_stem.testing.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.InvoicesDTO;
import org.example.gender_healthcare_stem.testing.model.Invoices;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.repository.InvoicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class InvoicesService {
    @Autowired
    private InvoicesRepository invoicesRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private STIAppointmentService stiAppointmentService;

    @Value("${vnpay.tmn_code}")
    private String vnpTmnCode;
    @Value("${vnpay.hash_secret}")
    private String vnpHashSecret;
    @Value("${vnpay.url}")
    private String vnpUrl;

    // Thay đổi khi deploy production
    private final String vnpReturnUrl = "http://localhost:3000/vnpay-return";

    public List<Invoices> getInvoices() {
        return invoicesRepository.findAll();
    }
    public List<InvoicesDTO> getInvoicesByCustomerId(Long customerId) {
        return invoicesRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public InvoicesDTO toDTO(Invoices invoice) {
        User user = userRepository.findById(invoice.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";

        return new InvoicesDTO(
                invoice.getId(),
                invoice.getCustomerId(),
                customerName,
                invoice.getAppointmentId(),
                invoice.getAmount(),
                invoice.getPaid(),
                invoice.getCreatedAt(),
                invoice.getPaymentProof(),
                invoice.getPaidItems(),
                customerPhone,
                invoice.getPaymentMethod(),
                invoice.getPaymentTxnRef(),
                invoice.getPaymentResponseCode(),
                invoice.getPaymentTime(),
                invoice.getTransferContent()
        );
    }

    public List<InvoicesDTO> getAllInvoicesDTO() {
        List<Invoices> invoices = invoicesRepository.findAll();
        return invoices.stream().map(this::toDTO).toList();
    }

    public InvoicesDTO createInvoice(InvoicesDTO dto) {
        Invoices entity = new Invoices();
        entity.setCustomerId(dto.getCustomerId());
        entity.setAppointmentId(dto.getAppointmentId());
        entity.setAmount(dto.getAmount());
        entity.setPaid(dto.getPaid());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setPaymentProof(dto.getPaymentProof());
        entity.setPaidItems(dto.getPaidItems());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setPaymentTxnRef(dto.getPaymentTxnRef());
        entity.setPaymentResponseCode(dto.getPaymentResponseCode());
        entity.setPaymentTime(dto.getPaymentTime());
        entity.setTransferContent(dto.getTransferContent());

        Invoices saved = invoicesRepository.save(entity);

        User user = userRepository.findById(saved.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";

        return new InvoicesDTO(
                saved.getId(),
                saved.getCustomerId(),
                customerName,
                saved.getAppointmentId(),
                saved.getAmount(),
                saved.getPaid(),
                saved.getCreatedAt(),
                saved.getPaymentProof(),
                saved.getPaidItems(),
                customerPhone,
                saved.getPaymentMethod(),
                saved.getPaymentTxnRef(),
                saved.getPaymentResponseCode(),
                saved.getPaymentTime(),
                saved.getTransferContent()
        );
    }

    public InvoicesDTO updatePaidStatus(Long invoiceId, Boolean paid) {
        Invoices invoice = invoicesRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setPaid(paid);
        if (paid && invoice.getPaymentTime() == null)
            invoice.setPaymentTime(LocalDateTime.now());
        Invoices saved = invoicesRepository.save(invoice);

        User user = userRepository.findById(saved.getCustomerId()).orElse(null);
        String customerName = (user != null) ? user.getFullName() : "Unknown";
        String customerPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "";

        return new InvoicesDTO(
                saved.getId(),
                saved.getCustomerId(),
                customerName,
                saved.getAppointmentId(),
                saved.getAmount(),
                saved.getPaid(),
                saved.getCreatedAt(),
                saved.getPaymentProof(),
                saved.getPaidItems(),
                customerPhone,
                saved.getPaymentMethod(),
                saved.getPaymentTxnRef(),
                saved.getPaymentResponseCode(),
                saved.getPaymentTime(),
                saved.getTransferContent()
        );
    }

    // =========================
    // === VNPay Integration ===
    // =========================
    // 1. Tạo paymentUrl (chỉ tạo invoice với trạng thái chưa thanh toán)
    @Transactional
    public Map<String, String> createVnpayPayment(Map<String, Object> req) {
        // Defensive check for paidItems or extraData
        String paidItems = null;
        if (req.containsKey("paidItems") && req.get("paidItems") != null) {
            paidItems = req.get("paidItems").toString();
        } else if (req.containsKey("extraData") && req.get("extraData") != null) {
            paidItems = req.get("extraData").toString();
        }
        if (paidItems == null) {
            throw new RuntimeException("No paidItems or extraData found in payment request");
        }

        // Defensive check for amount
        Object amountObj = req.get("amount");
        if (amountObj == null) {
            throw new RuntimeException("Missing 'amount' in payment request");
        }
        double amount = Double.parseDouble(amountObj.toString());

        // Defensive check for customerId (optional)
        Long customerId = null;
        if (req.containsKey("customerId") && req.get("customerId") != null) {
            customerId = Long.valueOf(req.get("customerId").toString());
        }

        String orderId = "ORDER" + System.currentTimeMillis();

        // Check for existing unpaid invoice for the same customer/amount/items
        Optional<Invoices> existingInvoiceOpt = invoicesRepository.findUnpaidInvoice(customerId, amount, paidItems);
        Invoices invoice;
        if (existingInvoiceOpt.isPresent()) {
            // Reuse the existing unpaid invoice, update txn_ref, createdAt, etc.
            invoice = existingInvoiceOpt.get();
            invoice.setPaymentTxnRef(orderId); // new reference for new payment
            invoice.setCreatedAt(LocalDateTime.now());
        } else {
            // Create new invoice
            invoice = new Invoices();
            invoice.setAmount(amount);
            invoice.setPaid(false);
            invoice.setPaymentMethod("vnpay");
            invoice.setPaymentTxnRef(orderId);
            invoice.setTransferContent("Thanh toán gói xét nghiệm"); // description
            invoice.setCreatedAt(LocalDateTime.now());
            invoice.setCustomerId(customerId);
            invoice.setPaidItems(paidItems); // Store JSON here!
        }
        invoicesRepository.save(invoice);

        // ========== Build VNPay parameters ==========
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf((long) (amount * 100))); // VND * 100
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", orderId);
        vnpParams.put("vnp_OrderInfo", "Thanh toán gói xét nghiệm");
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");
        String createDate = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
        vnpParams.put("vnp_CreateDate", createDate);

        // Build string to hash
        String dataToSign = buildDataToSign(vnpParams);
        String secureHash = hmacSHA512(vnpHashSecret, dataToSign);
        vnpParams.put("vnp_SecureHash", secureHash);

        // Build query url (encode params)
        String paymentUrl = vnpUrl + "?" + buildVnpQueryString(vnpParams);

        // Log debug if needed
        System.out.println("VNPay DataToSign: " + dataToSign);
        System.out.println("VNPay SecureHash: " + secureHash);
        System.out.println("VNPay PaymentUrl: " + paymentUrl);

        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", paymentUrl);
        return result;
    }

    // Xây dựng data để ký hash (alphabet, không có vnp_SecureHash)
    private String buildDataToSign(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        fieldNames.remove("vnp_SecureHash"); // bỏ key này ra
        Collections.sort(fieldNames); // sort alphabet
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = Objects.toString(params.get(key), "");
            sb.append(key).append("=").append(URLEncoder.encode(value, StandardCharsets.UTF_8));
            if (i < fieldNames.size() - 1) {
                sb.append("&");
            }
        }
        return sb.toString();
    }

    // Encode toàn bộ params thành query string (bao gồm cả vnp_SecureHash)
    private String buildVnpQueryString(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        int idx = 0;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (idx > 0) sb.append("&");
            sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            sb.append("=");
            sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
            idx++;
        }
        return sb.toString();
    }

    // HMAC SHA-512 để hash secure
    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac hmac = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error creating HMAC SHA512", e);
        }
    }

    // === VNPay: After payment confirmed, create appointment/result ===
    @Transactional
    public boolean handleVnpayReturn(Map<String, String> params) {
        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpResponseCode = params.get("vnp_ResponseCode");

        Invoices invoice = invoicesRepository.findByPaymentTxnRef(vnpTxnRef);
        if (invoice == null) return false;

        // Already processed by another request
        if (invoice.getAppointmentId() != null) {
            return true;
        }

        invoice.setPaymentResponseCode(vnpResponseCode);
        if ("00".equals(vnpResponseCode)) { // Payment success
            invoice.setPaid(true);
            invoice.setPaymentTime(LocalDateTime.now());

            // Parse paid_items and create appointment/results
            String paidItemsJson = invoice.getPaidItems();
            if (paidItemsJson == null) throw new RuntimeException("No testIds found in paidItems: null");
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<Integer> testIds = new ArrayList<>();
                // Parse as array object
                List<Map<String, Object>> paidItems = mapper.readValue(paidItemsJson, new TypeReference<>() {});
                for (Map<String, Object> item : paidItems) {
                    Object testIdObj = item.get("testId");
                    if (testIdObj != null) {
                        if (testIdObj instanceof Integer) {
                            testIds.add((Integer) testIdObj);
                        } else if (testIdObj instanceof Long) {
                            testIds.add(((Long) testIdObj).intValue());
                        } else if (testIdObj instanceof String) {
                            testIds.add(Integer.parseInt((String) testIdObj));
                        }
                    }
                }
                // This block will run only ONCE (even with concurrent requests!)
                STIAppointment appointment = stiAppointmentService.createAppointmentFromVnpay(
                        invoice.getCustomerId(),
                        invoice.getAmount(),
                        testIds
                );
                invoice.setAppointmentId(Long.valueOf(appointment.getAppointmentId()));
            } catch (Exception ex) {
                throw new RuntimeException("Error parsing paidItems: " + ex.getMessage(), ex);
            }
        }
        invoicesRepository.save(invoice);
        return "00".equals(vnpResponseCode);
    }

}