package org.example.gender_healthcare_stem.testing.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InvoicesDTO {
    private Long id;
    private Long customerId;         // <-- Add this line!
    private String customerName;
    private Long appointmentId;
    private Double amount;
    private Boolean paid;
    private LocalDateTime createdAt;
    private String paymentProof;
    private String paidItems;   // <-- For JSON

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }          // <-- Add this
    public void setCustomerId(Long customerId) { this.customerId = customerId; }  // <-- Add this

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getPaymentProof() { return paymentProof; }
    public void setPaymentProof(String paymentProof) { this.paymentProof = paymentProof; }

    public String getPaidItems() { return paidItems; }
    public void setPaidItems(String paidItems) { this.paidItems = paidItems; }

    // Update the constructor
    public InvoicesDTO(Long id, String customerName, Long appointmentId, Double amount, Boolean paid, LocalDateTime createdAt, String paymentProof, String paidItems) {
        this.id = id;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paid = paid;
        this.createdAt = createdAt;
        this.paymentProof = paymentProof;
        this.paidItems = paidItems;
    }

    // Overloaded constructor for creation (with customerId)
    public InvoicesDTO(Long customerId, Long appointmentId, Double amount, Boolean paid, String paymentProof, String paidItems) {
        this.customerId = customerId;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paid = paid;
        this.paymentProof = paymentProof;
        this.paidItems = paidItems;
    }

    public InvoicesDTO() {
    }
}
