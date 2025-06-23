package org.example.gender_healthcare_stem.adminconsultant.dto;

import java.util.List;
import java.util.Map;

public class AdminStatisticsDto {
    private Integer totalAppointments;
    private Integer totalConsultants;
    private Integer totalCustomers;
    private Integer activeAppointments;
    private Integer completedAppointments;
    private Integer cancelledAppointments;
    private Double averageRating;
    private List<Map<String, Object>> monthlyAppointments;
    private List<Map<String, Object>> appointmentsByStatus;
    private List<Map<String, Object>> topConsultants;

    // Constructors
    public AdminStatisticsDto() {}

    // Getters and Setters
    public Integer getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(Integer totalAppointments) { this.totalAppointments = totalAppointments; }

    public Integer getTotalConsultants() { return totalConsultants; }
    public void setTotalConsultants(Integer totalConsultants) { this.totalConsultants = totalConsultants; }

    public Integer getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Integer totalCustomers) { this.totalCustomers = totalCustomers; }

    public Integer getActiveAppointments() { return activeAppointments; }
    public void setActiveAppointments(Integer activeAppointments) { this.activeAppointments = activeAppointments; }

    public Integer getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(Integer completedAppointments) { this.completedAppointments = completedAppointments; }

    public Integer getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(Integer cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public List<Map<String, Object>> getMonthlyAppointments() { return monthlyAppointments; }
    public void setMonthlyAppointments(List<Map<String, Object>> monthlyAppointments) { this.monthlyAppointments = monthlyAppointments; }

    public List<Map<String, Object>> getAppointmentsByStatus() { return appointmentsByStatus; }
    public void setAppointmentsByStatus(List<Map<String, Object>> appointmentsByStatus) { this.appointmentsByStatus = appointmentsByStatus; }

    public List<Map<String, Object>> getTopConsultants() { return topConsultants; }
    public void setTopConsultants(List<Map<String, Object>> topConsultants) { this.topConsultants = topConsultants; }
}