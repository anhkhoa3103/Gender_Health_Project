package org.example.gender_healthcare_stem.testing.dto;

public class CollectSampleRequest {
    private Long orderId;
    private Long staffId;
    private String notes; // e.g., "blood", "urine", etc.

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
