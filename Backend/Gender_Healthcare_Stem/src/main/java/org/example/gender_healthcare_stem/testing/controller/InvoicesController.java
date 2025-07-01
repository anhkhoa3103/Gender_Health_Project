package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.InvoicesDTO;
import org.example.gender_healthcare_stem.testing.service.InvoicesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InvoicesController {
    private static final Logger log = LoggerFactory.getLogger(InvoicesController.class);

    @Autowired
    private InvoicesService invoicesService;

    // Get all invoices (DTO)
    @GetMapping("")
    public ResponseEntity<List<InvoicesDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoicesService.getAllInvoicesDTO());
    }

    // Tạo invoice cho chuyển khoản tay/QR (KHÔNG cho VNPay)
    @PostMapping("/create-invoice")
    public ResponseEntity<InvoicesDTO> createInvoice(@RequestBody InvoicesDTO dto) {
        InvoicesDTO created = invoicesService.createInvoice(dto);
        return ResponseEntity.ok(created);
    }

    // Cập nhật trạng thái paid (cho staff xác nhận nếu chuyển khoản tay)
    @PutMapping("/{invoiceId}/paid")
    public ResponseEntity<InvoicesDTO> updatePaidStatus(
            @PathVariable Long invoiceId,
            @RequestBody Map<String, Boolean> body
    ) {
        Boolean paid = body.get("paid");
        InvoicesDTO updated = invoicesService.updatePaidStatus(invoiceId, paid);
        return ResponseEntity.ok(updated);
    }

    // === VNPay: Chỉ sinh payment URL, chưa tạo invoice/appointment ===
    @PostMapping("/vnpay-create")
    public ResponseEntity<Map<String, String>> createVnpayPayment(@RequestBody Map<String, Object> req) {
        Map<String, String> result = invoicesService.createVnpayPayment(req);
        return ResponseEntity.ok(result);
    }

    // === VNPay: Xử lý callback, chỉ tạo invoice/appointment nếu thành công ===
    @RequestMapping(value = "/vnpay-return", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> handleVnpayReturn(@RequestParam Map<String, String> params) {
        boolean updated = invoicesService.handleVnpayReturn(params);
        if (updated)
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment Success!"));
        return ResponseEntity.status(400).body(Map.of("success", false, "message", "Payment Not Verified"));
    }
}