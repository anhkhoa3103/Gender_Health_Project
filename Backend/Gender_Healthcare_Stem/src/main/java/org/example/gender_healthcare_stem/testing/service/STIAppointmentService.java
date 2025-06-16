package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.testing.dto.*;
import org.example.gender_healthcare_stem.testing.model.*;
import org.example.gender_healthcare_stem.testing.model.Package;
import org.example.gender_healthcare_stem.testing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class STIAppointmentService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private STIAppointmentRepository appointmentRepository;

    @Autowired
    private TestTypeRepository testTypeRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private PackageTestRepository packageTestRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private TestResultDetailRepository testResultDetailRepository;

    public STIAppointment createAppointment(CreateOrderRequest request) {
        // 1. Validate customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 2. Validate order input: must choose either package or at least one test
        boolean hasPackage = request.getPackageId() != null;
        boolean hasTestTypes = request.getTestTypeIds() != null && !request.getTestTypeIds().isEmpty();

        if (!hasPackage && !hasTestTypes) {
            throw new RuntimeException("You must select a test package or at least one individual test.");
        }

        // 3. Create appointment
        STIAppointment appointment = new STIAppointment();
        appointment.setCustomer(customer);
        appointment.setStatus("BOOKED");
        appointment.setAmount(request.getAmount());
        appointment = appointmentRepository.save(appointment);

        // 4. Create test result
        TestResult result = new TestResult();
        result.setAppointment(appointment);
        result.setCustomer(customer);
        result.setCollectedAt(null);
        result.setReceivedAt(null);
        result.setReportedAt(null);
        result = testResultRepository.save(result);

        // 5. Get test types based on package or individual selection
        List<TestType> selectedTests = new ArrayList<>();

        if (hasPackage) {
            List<PackageTest> packageTests = packageTestRepository.findByAPackage_PackageId(request.getPackageId());
            for (PackageTest pt : packageTests) {
                selectedTests.add(pt.getTestType());
            }
        } else {
            selectedTests = testTypeRepository.findAllById(request.getTestTypeIds());
        }

        // 6. Create TestResultDetail for each test
        for (TestType testType : selectedTests) {
            TestResultDetail detail = new TestResultDetail();
            detail.setTestResult(result);
            detail.setTestType(testType);
            detail.setValue(null);  // Staff will input this later
            detail.setResult(null);
            testResultDetailRepository.save(detail);
        }

        return appointment;
    }

    //Lấy danh sách gói test
    public List<PackageResponse> getAllPackages() {
        List<Package> packages = packageRepository.findAll();
        List<PackageResponse> responses = new ArrayList<>();
        for (Package p : packages) {
            PackageResponse response = new PackageResponse();
            response.setPackageId(p.getPackageId());
            response.setPackageName(p.getPackageName());
            response.setTotalPrice(p.getTotalPrice());
            // Map TestType to TestTypeResponse
            List<TestTypeResponse> testTypeResponses = new ArrayList<>();
            for (PackageTest pt : p.getPackageTests()) {
                TestType test = pt.getTestType();
                TestTypeResponse ttr = new TestTypeResponse();
                ttr.setTestId(test.getTestId());
                ttr.setTestName(test.getTestName());
                ttr.setPrice(test.getPrice());
                testTypeResponses.add(ttr);
            }
            response.setTestTypes(testTypeResponses);
            responses.add(response);
        }
        return responses;
    }
    //Lấy danh sách test lẻ
    public List<TestTypeResponse> getAllIndividualTests() {
        List<TestType> testTypes = testTypeRepository.findAll();
        List<TestTypeResponse> responses = new ArrayList<>();
        for (TestType test : testTypes) {
            TestTypeResponse response = new TestTypeResponse();
            response.setTestId(test.getTestId());
            response.setTestName(test.getTestName());
            response.setPrice(test.getPrice());
            responses.add(response);
        }
        return  responses;
    }
    //Lấy lịch sử đặt xét nghiệm
    public List<STIAppointment> getAppointmentsByCustomerId(Long customerId) {
        return appointmentRepository.findByCustomer_Id(customerId);
    }
    public SubmitResultRequest getAppointmentById(Long id) {
        STIAppointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        // Find TestResult by appointment id
        TestResult result = testResultRepository.findByAppointment_AppointmentId(appointment.getAppointmentId());

        if (result == null) {
            throw new RuntimeException("Test result not found for this appointment");
        }
        // Find TestResultDetails by test result id
        List<TestResultDetail> details = testResultDetailRepository.findByTestResult_ResultId(result.getResultId());

        List<TestResultDetailDTO> detailDTOS = details.stream()
                .map(d -> new TestResultDetailDTO(
                        d.getResultDetailId(),
                        d.getValue(),
                        d.getResult()
                ))
                .collect(Collectors.toList());
        // Use constructor if setters are missing
        SubmitResultRequest response = new SubmitResultRequest();
        response.setResultId(appointment.getAppointmentId().intValue());
        response.setDetails(detailDTOS);
        return response;
    }
}

