package org.example.gender_healthcare_stem.testing.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InvoicesDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long appointmentId;
    private Double amount;
    private Boolean paid;
    private LocalDateTime createdAt;
    private String paymentProof;
    private String paidItems;
    private String customerPhone;

    // --- Payment Integration Fields ---
    private String paymentMethod;         // e.g., "manual", "vietqr", "vnpay", "sepay"
    private String paymentTxnRef;         // VNPay/SEPAY/order reference
    private String paymentResponseCode;   // VNPay/SEPAY response code
    private LocalDateTime paymentTime;    // When payment was completed
    private String transferContent;       // For matching VietQR/manual transfer

    // --- Constructors ---

    public InvoicesDTO() {}

    public InvoicesDTO(Long id, Long customerId, String customerName, Long appointmentId, Double amount,
                       Boolean paid, LocalDateTime createdAt, String paymentProof, String paidItems,
                       String customerPhone, String paymentMethod, String paymentTxnRef,
                       String paymentResponseCode, LocalDateTime paymentTime, String transferContent) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paid = paid;
        this.createdAt = createdAt;
        this.paymentProof = paymentProof;
        this.paidItems = paidItems;
        this.customerPhone = customerPhone;
        this.paymentMethod = paymentMethod;
        this.paymentTxnRef = paymentTxnRef;
        this.paymentResponseCode = paymentResponseCode;
        this.paymentTime = paymentTime;
        this.transferContent = transferContent;
    }
}