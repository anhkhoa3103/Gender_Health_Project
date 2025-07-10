package org.example.gender_healthcare_stem.consultant.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantUpdateRequestDTO {
    private Integer consultantId;
    private String specialization;
    private String qualification;
    private Integer experiencedYears;
    private String googleMeetLinks;
}
