package org.example.gender_healthcare_stem.consultation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResultResponse {
    private Long consultationResultId;
    private Long consultationId;
    private String result;
    private String notes;
    private LocalDateTime createdAt;
}
