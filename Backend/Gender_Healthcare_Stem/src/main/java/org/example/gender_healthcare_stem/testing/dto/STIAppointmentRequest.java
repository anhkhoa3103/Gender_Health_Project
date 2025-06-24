package org.example.gender_healthcare_stem.testing.dto;

import java.util.List;

public class STIAppointmentRequest {
    private Long customerId;
    private Double amount;
    private List<Integer> testIds;

    public Long getCustomerId() {
        return customerId;
    }
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public List<Integer> getTestIds() {   // <-- Add getter
        return testIds;
    }
    public void setTestIds(List<Integer> testIds) {  // <-- Add setter
        this.testIds = testIds;
    }
}
