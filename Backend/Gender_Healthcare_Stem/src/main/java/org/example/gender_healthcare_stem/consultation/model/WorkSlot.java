package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_slot")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workslotId;

    private LocalDate workslotDate;

    private Long consultantId;

    private Long slotId;

    private Boolean isAvailable;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

