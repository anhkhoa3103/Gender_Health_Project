package org.example.gender_healthcare_stem.consultation.dto;

import java.time.LocalDateTime;

public class ConsultationInvoiceDTO {
    private Long consultationInvoiceId;
    private double amount;
    private Long consultationId;
    private Long customerId;
    private String paymentMethod;
    private String paymentResponseCode;
    private LocalDateTime paymentTime;
    private String paymentTxnRef;

    public ConsultationInvoiceDTO(Long consultationInvoiceId, double amount, Long consultationId, Long customerId,
                                  String paymentMethod, String paymentResponseCode,
                                  LocalDateTime paymentTime, String paymentTxnRef) {
        this.consultationInvoiceId = consultationInvoiceId;
        this.amount = amount;
        this.consultationId = consultationId;
        this.customerId = customerId;
        this.paymentMethod = paymentMethod;
        this.paymentResponseCode = paymentResponseCode;
        this.paymentTime = paymentTime;
        this.paymentTxnRef = paymentTxnRef;
    }

    public ConsultationInvoiceDTO() {
    }

    // Getters and setters

    public Long getConsultationInvoiceId() {
        return consultationInvoiceId;
    }

    public void setConsultationInvoiceId(Long consultationInvoiceId) {
        this.consultationInvoiceId = consultationInvoiceId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentResponseCode() {
        return paymentResponseCode;
    }

    public void setPaymentResponseCode(String paymentResponseCode) {
        this.paymentResponseCode = paymentResponseCode;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }

    public String getPaymentTxnRef() {
        return paymentTxnRef;
    }

    public void setPaymentTxnRef(String paymentTxnRef) {
        this.paymentTxnRef = paymentTxnRef;
    }
}