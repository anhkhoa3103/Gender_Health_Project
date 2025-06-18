package org.example.gender_healthcare_stem.consultation.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkSlotRequest {
    private Long consultantId;
    private LocalDate workslotDate;
    private List<Long> slotIds;
}
