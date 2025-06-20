package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import org.example.gender_healthcare_stem.testing.model.TestType;
@Entity
@Table(name = "test_result_detail")
public class TestResultDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resultdetail_id")
    private Integer resultDetailId;

    @ManyToOne
    @JoinColumn(name = "result_id", nullable = false)
    private TestResult testResult;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private TestType testType;

    @Column(name = "value")
    private String value;

    @Column(name = "result")
    private String result;

    // Getters and Setters

    public Integer getResultDetailId() {
        return resultDetailId;
    }

    public void setResultDetailId(Integer resultDetailId) {
        this.resultDetailId = resultDetailId;
    }

    public TestResult getTestResult() {
        return testResult;
    }

    public void setTestResult(TestResult testResult) {
        this.testResult = testResult;
    }

    public TestType getTestType() {
        return testType;
    }

    public void setTestType(TestType testType) {
        this.testType = testType;
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