package org.example.gender_healthcare_stem.testing.service;

import jakarta.transaction.Transactional;
import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.STIAppointmentDTO;
import org.example.gender_healthcare_stem.testing.dto.STIAppointmentRequest;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.example.gender_healthcare_stem.testing.model.TestResultDetail;
import org.example.gender_healthcare_stem.testing.model.TestType;
import org.example.gender_healthcare_stem.testing.repository.STIAppointmentRepository;
import org.example.gender_healthcare_stem.testing.repository.TestResultDetailRepository;
import org.example.gender_healthcare_stem.testing.repository.TestResultRepository;
import org.example.gender_healthcare_stem.testing.repository.TestTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class STIAppointmentService {
    @Autowired
    private STIAppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private TestTypeRepository TestTypeRepository;
    @Autowired
    private TestResultDetailRepository testResultDetailRepository;
    public List<STIAppointmentDTO> getAllAppointmentsWithNames() {
        List<STIAppointment> appointments = appointmentRepository.findAll();
        List<STIAppointmentDTO> dtos = new ArrayList<>();
        for (STIAppointment a : appointments) {
            STIAppointmentDTO dto = new STIAppointmentDTO();
            dto.setAppointmentId(a.getAppointmentId());
            dto.setCustomerId(a.getCustomer() != null ? a.getCustomer().getId() : null);
            // Fetch customer name (assuming getCustomer() returns customer object)
            dto.setCustomerName(a.getCustomer() != null ? a.getCustomer().getUser().getFullName() : null);
            dto.setStaffId(a.getStaff() != null ? a.getStaff().getId() : null);
            // Fetch staff name if available
            dto.setStaffName(a.getStaff() != null ? a.getStaff().getFullName() : null);
            dto.setStatus(a.getStatus());
            dto.setAmount(a.getAmount());
            dto.setCustomerPhone(a.getCustomer() != null ? a.getCustomer().getUser().getPhone() : null);
            dtos.add(dto);
        }
        return dtos;
    }

    public STIAppointment createAppointment(STIAppointmentRequest req) {
        Customer customer = customerRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        STIAppointment appointment = new STIAppointment();
        appointment.setCustomer(customer);
        appointment.setStaff(null); // Staff will be assigned later
        appointment.setStatus("pending");
        appointment.setAmount(req.getAmount());

        STIAppointment savedAppointment = appointmentRepository.save(appointment);

        TestResult testResult = new TestResult();
        testResult.setCustomer(customer);
        testResult.setAppointment(savedAppointment);
        TestResult savedTestResult = testResultRepository.save(testResult);
        if (req.getTestIds() != null) {
            for (Integer testId : req.getTestIds()) {
                TestType testType = TestTypeRepository.findById(testId)
                        .orElseThrow(() -> new RuntimeException("Test type not found: " + testId));
                TestResultDetail detail = new TestResultDetail();
                detail.setTestResult(savedTestResult);
                detail.setTestType(testType);
                detail.setValue(null); // for filling later
                detail.setResult("negative");
                testResultDetailRepository.save(detail);
            }
        }
        return savedAppointment;
    }
    @Transactional
    public STIAppointment updateStatusAndTimestamps(int appointmentId, String status, Long staffId) {
        STIAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);

        // Assign staff if needed
        if (staffId != null) {
            User staff = userRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
            appointment.setStaff(staff);
        }

        // Save the appointment
        appointment = appointmentRepository.save(appointment);

        // Update related test result fields based on status
        testResultRepository.findByAppointment(appointment).ifPresent(result -> {
            LocalDateTime now = LocalDateTime.now();
            switch (status) {
                case "sampling":
                    result.setCollectedAt(now);
                    break;
                case "sampled":
                    result.setReceivedAt(now);
                    break;
                case "completed":
                    result.setReportedAt(now);
                    break;
                default:
                    // handle other cases
            }
            testResultRepository.save(result);
        });


        return appointment; // <--- return the updated entity, NOT an int!
    }

}