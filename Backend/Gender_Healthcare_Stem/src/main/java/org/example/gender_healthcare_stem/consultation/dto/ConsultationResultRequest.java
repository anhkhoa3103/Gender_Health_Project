package org.example.gender_healthcare_stem.consultation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResultRequest {
    private Long consultationId;
    private String result;
    private String notes;
}


