package org.example.gender_healthcare_stem.testing.dto;

import java.time.LocalDateTime;

public class TestResultDTO {
    private int resultId;
    private String customerName;
    private int appointmentId;
    private Long customerId;
    private boolean hasResult;

    public TestResultDTO(int resultId, String customerName, int appointmentId, Long customerId, boolean hasResult) {
        this.resultId = resultId;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
        this.customerId = customerId;
        this.hasResult = hasResult;
    }

    public TestResultDTO(int resultId, String customerName, int appointmentId, Long customerId) {
        this.resultId = resultId;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
        this.customerId = customerId;
    }

    // getters & setters

    public int getResultId() {
        return resultId;
    }

    public void setResultId(int resultId) {
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

    public boolean isHasResult() {
        return hasResult;
    }

    public void setHasResult(boolean hasResult) {
        this.hasResult = hasResult;
    }
}

