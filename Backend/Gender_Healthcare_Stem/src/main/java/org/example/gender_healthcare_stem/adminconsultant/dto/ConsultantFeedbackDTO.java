package org.example.gender_healthcare_stem.adminconsultant.dto;

public class ConsultantFeedbackDTO {
    private String customerName;
    private String comment;
    private Integer rating;

    public ConsultantFeedbackDTO() {
    }

    public ConsultantFeedbackDTO(String customerName, String comment, Integer rating) {
        this.customerName = customerName;
        this.comment = comment;
        this.rating = rating;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
