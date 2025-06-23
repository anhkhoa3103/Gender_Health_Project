package org.example.gender_healthcare_stem.consultation.dto;

import org.example.gender_healthcare_stem.consultation.model.Feedback;

import java.time.LocalDateTime;

public class FeedbackDTO {
    private Long feedbackId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String customerName;

    public FeedbackDTO(Feedback fb) {
        this.feedbackId = fb.getFeedbackId();
        this.rating = fb.getRating();
        this.comment = fb.getComment();
        this.createdAt = fb.getCreatedAt();
        this.customerName = fb.getCustomer() != null && fb.getCustomer().getUser() != null
                ? fb.getCustomer().getUser().getFullName()
                : "Ẩn danh";
    }

    public FeedbackDTO() {
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
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

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}