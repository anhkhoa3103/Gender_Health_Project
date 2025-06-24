package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.TestResultDetailDTO;
import org.example.gender_healthcare_stem.testing.dto.UpdateTestResultDetailsRequest;
import org.example.gender_healthcare_stem.testing.model.TestResultDetail;
import org.example.gender_healthcare_stem.testing.repository.TestResultDetailRepository;
import org.example.gender_healthcare_stem.testing.service.TestResultDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultDetailController {

    @Autowired
    private TestResultDetailRepository detailRepository;
    @Autowired
    private TestResultDetailService detailService;
    @GetMapping("/{resultId}/details")
    public List<TestResultDetailDTO> getDetailsByResultId(@PathVariable Integer resultId) {
        List<TestResultDetail> details = detailRepository.findByTestResult_ResultId(resultId);
        return details.stream()
                .map(d -> new TestResultDetailDTO(
                        d.getTestType().getTestId(),
                        d.getValue(),
                        d.getResult(),
                        d.getTestType().getThreshold()
                ))

                .collect(Collectors.toList());
    }
    @PutMapping("/{resultId}/details")
    public void updateDetails(@PathVariable Integer resultId, @RequestBody UpdateTestResultDetailsRequest request) {
        detailService.updateDetails(resultId, request.getDetails());
    }
}
