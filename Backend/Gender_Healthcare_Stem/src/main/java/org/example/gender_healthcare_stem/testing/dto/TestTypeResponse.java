package org.example.gender_healthcare_stem.testing.dto;

import java.math.BigDecimal;

public class TestTypeResponse {
    private Integer testId;
    private String testName;
    private BigDecimal price;

    //getters and setters

    public Integer getTestId() {
        return testId;
    }

    public void setTestId(Integer testId) {
        this.testId = testId;
    }

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
}
