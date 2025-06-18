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
    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }
    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Long getCustomerId() {
        return customerId;
    }
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentProof() {
        return paymentProof;
    }
    public void setPaymentProof(String paymentProof) {
        this.paymentProof = paymentProof;
    }

    public Boolean getPaid() {
        return paid;
    }
    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getPaidItems() {
        return paidItems;
    }

    public void setPaidItems(String paidItems) {
        this.paidItems = paidItems;
    }

}
