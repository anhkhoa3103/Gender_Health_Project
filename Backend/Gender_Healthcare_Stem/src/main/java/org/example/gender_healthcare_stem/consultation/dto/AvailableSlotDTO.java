package org.example.gender_healthcare_stem.consultation.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class AvailableSlotDTO {
    private Long slotId;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
}
