package org.example.gender_healthcare_stem.consultation.dto;

import java.time.LocalDateTime;

public class FeedbackWithUserDTO {
    private Long feedbackId;
    private Long customerId;
    private String customerName;
    private Long consultantId;
    private String consultantName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    // Constructors
    public FeedbackWithUserDTO() {}

    public FeedbackWithUserDTO(Long feedbackId, Long customerId, String customerName,
                               Long consultantId, String consultantName, Integer rating,
                               String comment, LocalDateTime createdAt) {
        this.feedbackId = feedbackId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.consultantId = consultantId;
        this.consultantName = consultantName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getConsultantId() {
        return consultantId;
    }

    public void setConsultantId(Long consultantId) {
        this.consultantId = consultantId;
    }

    public String getConsultantName() {
        return consultantName;
    }

    public void setConsultantName(String consultantName) {
        this.consultantName = consultantName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}