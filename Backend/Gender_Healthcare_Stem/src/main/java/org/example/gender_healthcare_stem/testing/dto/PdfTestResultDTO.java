// PdfTestResultDTO.java
package org.example.gender_healthcare_stem.testing.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class PdfTestResultDTO {
    // Customer info
    private String customerName;
    private String gender;
    private Integer age;
    private LocalDate dob;
    private String address;


    // Appointment / Test result info
    private Integer resultId;
    private Integer appointmentId;
    private LocalDateTime collectedAt;
    private LocalDateTime receivedAt;
    private LocalDateTime reportedAt;



    // Test details
    private List<TestDetail> testDetails;

    // TestDetail inner class
    public static class TestDetail {
        private String testName;
        private String value;
        private String result;

        // getters/setters
        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }

    }

    // getters and setters for all fields...
    // (You can generate with your IDE)


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

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

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(LocalDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }


    public List<TestDetail> getTestDetails() {
        return testDetails;
    }

    public void setTestDetails(List<TestDetail> testDetails) {
        this.testDetails = testDetails;
    }
}