// TestResultService.java
package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.testing.dto.PdfTestResultDTO;
import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.example.gender_healthcare_stem.testing.model.TestResultDetail;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.testing.repository.TestResultRepository;
import org.example.gender_healthcare_stem.testing.repository.TestResultDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestResultService {
    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private TestResultDetailRepository testResultDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<PdfTestResultDTO> getPdfTestResultsByCustomerId(Integer customerId) {
        List<TestResult> results = testResultRepository.findByCustomer_Id(customerId);
        Customer customer = customerRepository.findById(Long.valueOf(customerId)).orElse(null);

        List<PdfTestResultDTO> pdfList = new ArrayList<>();
        for (TestResult result : results) {
            PdfTestResultDTO dto = new PdfTestResultDTO();
            // Customer info
            if (customer != null && customer.getUser() != null) {
                dto.setCustomerName(customer.getUser().getFullName());
                dto.setGender(customer.getGender());
                // Calculate age
                if (customer.getDateOfBirth() != null) {
                    LocalDate dob = customer.getDateOfBirth();
                    dto.setAge(Period.between(dob, LocalDate.now()).getYears());
                    dto.setDob(customer.getDateOfBirth());
                }
                dto.setAddress(customer.getAddress());

            }
            // Test result info
            dto.setResultId(result.getResultId());
            dto.setAppointmentId(result.getAppointment().getAppointmentId());
            dto.setCollectedAt(result.getCollectedAt());
            dto.setReceivedAt(result.getReceivedAt());
            dto.setReportedAt(result.getReportedAt());

            // Test details
            List<TestResultDetail> details = testResultDetailRepository.findByTestResult_ResultId(result.getResultId());
            List<PdfTestResultDTO.TestDetail> testDetails = details.stream().map(d -> {
                PdfTestResultDTO.TestDetail td = new PdfTestResultDTO.TestDetail();
                td.setTestName(d.getTestType().getTestName());
                td.setValue(d.getValue());
                td.setResult(d.getResult());

                return td;
            }).collect(Collectors.toList());
            dto.setTestDetails(testDetails);

            pdfList.add(dto);
        }
        return pdfList;
    }
}
