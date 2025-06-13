package org.example.gender_healthcare_stem.consultation.dto;

public class ConsultantRatingSummary {
    private Long consultantId;
    private Double averageRating;
    private Long feedbackCount;

    // Constructor
    public ConsultantRatingSummary(Long consultantId, Double averageRating, Long feedbackCount) {
        this.consultantId = consultantId;
        this.averageRating = averageRating;
        this.feedbackCount = feedbackCount;
    }

    // Getters
    public Long getConsultantId() {
        return consultantId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Long getFeedbackCount() {
        return feedbackCount;
    }
}