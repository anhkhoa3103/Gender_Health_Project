package org.example.gender_healthcare_stem.admin.dto;

import lombok.Data;

@Data
public class AdminFeedbackDTO {
    private Long feedbackId;
    private String consultantName;
    private String customerName;
    private int rating;
    private String comment;
    private String createdAt;
}

