// src/main/java/org/example/gender_healthcare_stem/testing/service/TestResultDetailService.java
package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.testing.dto.UpdateTestResultDetailDTO;
import org.example.gender_healthcare_stem.testing.model.TestResultDetail;
import org.example.gender_healthcare_stem.testing.repository.TestResultDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestResultDetailService {

    @Autowired
    private TestResultDetailRepository detailRepository;

    public void updateDetails(Integer resultId, List<UpdateTestResultDetailDTO> details) {
        for (UpdateTestResultDetailDTO dto : details) {
            TestResultDetail entity = detailRepository.findByTestResult_ResultIdAndTestType_TestId(resultId, dto.getTestId());
            if (entity != null) {
                entity.setValue(dto.getValue());
                entity.setResult(dto.getResult());
                detailRepository.save(entity);
            }
        }
    }
}
