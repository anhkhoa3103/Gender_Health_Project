package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "work_slot")
public class WorkSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workslotId;

    private LocalDate workslotDate;
    private int consultantId;
    private Long slotId;
}
