package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private double amount;

    @Column(name = "payment_method")
    private String payment_method;

    @Column(name = "paid")
    private boolean paid;

//    @Column(name = "created_at")
//    private LocalDateTime paid_at;
}
