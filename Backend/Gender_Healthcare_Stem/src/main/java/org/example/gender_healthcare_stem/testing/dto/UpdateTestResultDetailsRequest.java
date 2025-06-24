// src/main/java/org/example/gender_healthcare_stem/testing/dto/UpdateTestResultDetailsRequest.java
package org.example.gender_healthcare_stem.testing.dto;

import java.util.List;

public class UpdateTestResultDetailsRequest {
    private List<UpdateTestResultDetailDTO> details;

    public List<UpdateTestResultDetailDTO> getDetails() { return details; }
    public void setDetails(List<UpdateTestResultDetailDTO> details) { this.details = details; }
}
