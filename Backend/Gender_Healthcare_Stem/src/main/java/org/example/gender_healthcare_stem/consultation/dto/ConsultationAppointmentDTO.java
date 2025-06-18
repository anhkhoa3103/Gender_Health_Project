package org.example.gender_healthcare_stem.consultation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationAppointmentDTO {
    private Long consultationId;
    private String name;
    private String phoneNumber;
    private String appointmentDate;
    private String timeRange; // ví dụ: 09:00 - 09:30
    private String note;
    private String status;
    private String consultantName;
    private String meetLink;
}

