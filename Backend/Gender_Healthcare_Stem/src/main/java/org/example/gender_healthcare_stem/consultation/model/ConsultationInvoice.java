package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.example.gender_healthcare_stem.auth.model.Customer;
@Entity
@Table(name = "consultation_invoices")
public class ConsultationInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_invoice_id")
    private Long id;

    // Foreign key to customers table (or reference your customer entity if you prefer)
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private ConsultationAppointment consultation;

    @Column(name = "amount", nullable = false)
    private Double amount;

    // --- VNPay Integration fields ---
    @Column(name = "payment_method", length = 30)
    private String paymentMethod;         // e.g., "vnpay"

    @Column(name = "payment_txn_ref", length = 128, unique = true)
    private String paymentTxnRef;         // VNPay transaction reference

    @Column(name = "payment_response_code", length = 16)
    private String paymentResponseCode;   // VNPay response code ("00" = success)

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;    // When payment completed

    public ConsultationInvoice() {

    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ConsultationAppointment getConsultation() {
        return consultation;
    }

    public void setConsultation(ConsultationAppointment consultation) {
        this.consultation = consultation;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentTxnRef() {
        return paymentTxnRef;
    }

    public void setPaymentTxnRef(String paymentTxnRef) {
        this.paymentTxnRef = paymentTxnRef;
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

    public ConsultationInvoice(Long id, Customer customer, ConsultationAppointment consultation, Double amount, String paymentMethod, String paymentTxnRef, String paymentResponseCode, LocalDateTime paymentTime) {
        this.id = id;
        this.customer = customer;
        this.consultation = consultation;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentTxnRef = paymentTxnRef;
        this.paymentResponseCode = paymentResponseCode;
        this.paymentTime = paymentTime;
    }
}
