package org.example.gender_healthcare_stem.consultant.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultant_update_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantUpdateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer consultantId;

    private String specialization;
    private String qualification;
    private Integer experiencedYears;
    private String googleMeetLinks;

    private String status; // pending, approved, rejected
    private String reason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
