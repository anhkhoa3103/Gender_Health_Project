package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Data
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;

    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
}
