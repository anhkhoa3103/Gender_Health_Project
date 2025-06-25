package org.example.gender_healthcare_stem.testing.dto;

// TestResultSummaryDTO.java
public class TestResultSummaryDTO {
    private Integer resultId;
    private Integer appointmentId;
    // Add other fields if needed

    public TestResultSummaryDTO(Integer resultId, Integer appointmentId) {
        this.resultId = resultId;
        this.appointmentId = appointmentId;
    }

    // getters and setters

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }
}