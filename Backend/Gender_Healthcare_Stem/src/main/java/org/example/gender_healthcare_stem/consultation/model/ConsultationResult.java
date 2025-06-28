package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long consultationResultId;

    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private ConsultationAppointment consultation;

    private String result;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt;
}

