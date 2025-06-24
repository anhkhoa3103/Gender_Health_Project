package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.TestResultDTO;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.example.gender_healthcare_stem.testing.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultController {

    @Autowired
    private TestResultRepository testResultRepository;

    @GetMapping("/")
    public List<TestResultDTO> getAllTestResults() {
        List<TestResult> results = testResultRepository.findAll();
        return results.stream()
                .map(result -> new TestResultDTO(
                        result.getResultId(),
                        result.getCustomer().getUser().getFullName(),     // Get customer name here!
                        result.getAppointment().getAppointmentId()
                ))
                .collect(Collectors.toList());
    }

}
