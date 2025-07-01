package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long id;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_proof", columnDefinition = "text")
    private String paymentProof;

    @Column(name = "paid")
    private Boolean paid;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_items", columnDefinition = "jsonb")
    private String paidItems;

    // --- Payment Integration Fields ---
    @Column(name = "payment_method", length = 30)
    private String paymentMethod;         // e.g., "manual", "vietqr", "vnpay", "sepay"

    @Column(name = "payment_txn_ref", length = 128, unique = true)
    private String paymentTxnRef;         // VNPay/SEPAY/order reference

    @Column(name = "payment_response_code", length = 16)
    private String paymentResponseCode;   // VNPay/SEPAY response code

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;    // When payment was completed

    @Column(name = "transfer_content", length = 64)
    private String transferContent;       // Used for matching VietQR/manual transfer

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentProof() { return paymentProof; }
    public void setPaymentProof(String paymentProof) { this.paymentProof = paymentProof; }

    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getPaidItems() { return paidItems; }
    public void setPaidItems(String paidItems) { this.paidItems = paidItems; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentTxnRef() { return paymentTxnRef; }
    public void setPaymentTxnRef(String paymentTxnRef) { this.paymentTxnRef = paymentTxnRef; }

    public String getPaymentResponseCode() { return paymentResponseCode; }
    public void setPaymentResponseCode(String paymentResponseCode) { this.paymentResponseCode = paymentResponseCode; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    public String getTransferContent() { return transferContent; }
    public void setTransferContent(String transferContent) { this.transferContent = transferContent; }
}
