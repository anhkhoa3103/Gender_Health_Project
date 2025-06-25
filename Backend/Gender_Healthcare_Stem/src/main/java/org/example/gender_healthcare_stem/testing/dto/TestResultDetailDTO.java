package org.example.gender_healthcare_stem.testing.dto;

public class TestResultDetailDTO {
    private Integer testId;
    private String value;
    private String result;
    private Double threshold;
    private String testName;
    public Integer getTestId() {
        return testId;
    }

    public void setTestId(Integer testId) {
        this.testId = testId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public TestResultDetailDTO(Integer testId, String value, String result, Double threshold, String testName) {
        this.testId = testId;
        this.value = value;
        this.result = result;
        this.threshold = threshold;
        this.testName = testName;
    }
}