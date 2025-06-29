package org.example.gender_healthcare_stem.testing.controller;

import org.example.gender_healthcare_stem.testing.dto.PdfTestResultDTO;
import org.example.gender_healthcare_stem.testing.dto.TestResultDTO;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.example.gender_healthcare_stem.testing.repository.TestResultRepository;
import org.example.gender_healthcare_stem.testing.service.TestResultService;
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
    @Autowired
    private TestResultService testResultService;
    @GetMapping("/")
    public List<TestResultDTO> getAllTestResults() {
        List<TestResult> results = testResultRepository.findAll();
        return results.stream()
                .map(result -> new TestResultDTO(
                        result.getResultId(),
                        result.getCustomer().getUser().getFullName(),     // Get customer name here!
                        result.getAppointment().getAppointmentId(),
                        result.getCustomer().getUser().getId()
                ))
                .collect(Collectors.toList());
    }

    // ⭐️ Customer-only endpointMore actions
    @GetMapping("/customer")
    public List<TestResultDTO> getTestResultsByCustomer(@RequestParam Integer customerId) {
        List<TestResult> results = testResultRepository.findByCustomer_Id(customerId);
        return results.stream()
                .map(result -> new TestResultDTO(
                        result.getResultId(),
                        result.getCustomer().getUser().getFullName(),
                        result.getAppointment().getAppointmentId(),
                        result.getCustomer().getUser().getId()
                ))
                .collect(Collectors.toList());
    }
    @GetMapping("/pdf-data/customer/{customerId}")
    public List<PdfTestResultDTO> getPdfDataByCustomerId(@PathVariable Integer customerId) {
        return testResultService.getPdfTestResultsByCustomerId(customerId);
    }

}