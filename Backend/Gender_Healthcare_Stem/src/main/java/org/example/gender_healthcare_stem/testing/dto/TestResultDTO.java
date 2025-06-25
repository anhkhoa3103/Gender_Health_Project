package org.example.gender_healthcare_stem.testing.dto;

import java.time.LocalDateTime;

public class TestResultDTO {
    private Integer resultId;
    private String customerName;       // Add this line
    private int appointmentId;

    public TestResultDTO(Integer resultId, String customerName, int appointmentId) {
        this.resultId = resultId;
        this.customerName = customerName;
        this.appointmentId = appointmentId;
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
}
