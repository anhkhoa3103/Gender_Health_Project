package org.example.gender_healthcare_stem.testing.dto;

import java.util.List;

public class SubmitResultRequest {
    private Integer resultId;
    private List<TestResultDetailDTO> details;

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public List<TestResultDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<TestResultDetailDTO> details) {
        this.details = details;
    }
}

