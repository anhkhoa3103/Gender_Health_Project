package org.example.gender_healthcare_stem.adminconsultant.dto;

public class ConsultantPerformanceDto {
    private Long consultantId;
    private String consultantName;
    private String consultantEmail;
    private String specialization;
    private Integer totalAppointments;
    private Integer completedAppointments;
    private Integer cancelledAppointments;
    private Double completionRate;
    private Double averageRating;
    private Integer totalFeedback;
    private Double revenue;

    // Constructors
    public ConsultantPerformanceDto() {}

    // Getters and Setters
    public Long getConsultantId() { return consultantId; }
    public void setConsultantId(Long consultantId) { this.consultantId = consultantId; }

    public String getConsultantName() { return consultantName; }
    public void setConsultantName(String consultantName) { this.consultantName = consultantName; }

    public String getConsultantEmail() { return consultantEmail; }
    public void setConsultantEmail(String consultantEmail) { this.consultantEmail = consultantEmail; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(Integer totalAppointments) { this.totalAppointments = totalAppointments; }

    public Integer getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(Integer completedAppointments) { this.completedAppointments = completedAppointments; }

    public Integer getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(Integer cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }

    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalFeedback() { return totalFeedback; }
    public void setTotalFeedback(Integer totalFeedback) { this.totalFeedback = totalFeedback; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }
}