package org.example.gender_healthcare_stem.testing.dto;

import java.time.LocalDateTime;

public class TestResultDTO {
    private Integer resultId;
    private String customerName;       // Add this line
    private int appointmentId;
    private Long customerId;
    public TestResultDTO(Integer resultId, String customerName, int appointmentId, Long customerId) {
        this.resultId = resultId;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
        this.customerId = customerId;
    }
    // getters & setters...

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }
    public Long getCustomerId() {
        return customerId;

    }
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}