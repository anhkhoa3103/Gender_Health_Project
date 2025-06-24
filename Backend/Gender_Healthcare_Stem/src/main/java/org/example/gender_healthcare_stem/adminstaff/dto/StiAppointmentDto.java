// StiAppointmentDto.java
package org.example.gender_healthcare_stem.adminstaff.dto;

import java.sql.Timestamp;

public class StiAppointmentDto {
    private Long appointmentId;
    private Long customerId;
    private Long staffId;
    private String status;
    private Double amount;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String staffName;
    private String staffEmail;
    private Timestamp createdDate;
    private String testPackageName;

    // Constructors
    public StiAppointmentDto() {}

    public StiAppointmentDto(Long appointmentId, Long customerId, Long staffId,
                             String status, Double amount, String customerName,
                             String customerEmail, String customerPhone,
                             String staffName, String staffEmail,
                             Timestamp createdDate, String testPackageName) {
        this.appointmentId = appointmentId;
        this.customerId = customerId;
        this.staffId = staffId;
        this.status = status;
        this.amount = amount;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.staffName = staffName;
        this.staffEmail = staffEmail;
        this.createdDate = createdDate;
        this.testPackageName = testPackageName;
    }

    // Getters and Setters
    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getStaffEmail() {
        return staffEmail;
    }

    public void setStaffEmail(String staffEmail) {
        this.staffEmail = staffEmail;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }

    public String getTestPackageName() {
        return testPackageName;
    }

    public void setTestPackageName(String testPackageName) {
        this.testPackageName = testPackageName;
    }
}
