package org.example.gender_healthcare_stem.consultation.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.gender_healthcare_stem.auth.model.Customer;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "consultant_id")
    private Long consultantId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}