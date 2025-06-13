package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "consolidation_appointment")
public class ConsolidationAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long consultationId;

    private String consultantId;
    private String customerId;
    private LocalDate appointmentDate;
    private String status;
    private Long workslotId;
}