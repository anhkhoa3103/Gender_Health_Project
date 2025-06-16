package org.example.gender_healthcare_stem.testing.dto;

public class TestResultDetailDTO {
    private Integer testId;
    private String value;
    private String result;

    public TestResultDetailDTO(Integer testId, String value, String result) {
        this.testId = testId;
        this.value = value;
        this.result = result;
    }

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
}
