package org.example.gender_healthcare_stem.adminservice.dto;


import java.math.BigDecimal;

public class TestTypeRequest {
    private String testName;
    private BigDecimal price;
    private Double threshold;

    // Constructors
    public TestTypeRequest() {}

    public TestTypeRequest(String testName, BigDecimal price, Double threshold) {
        this.testName = testName;
        this.price = price;
        this.threshold = threshold;
    }

    // Getters and Setters
    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }
}
