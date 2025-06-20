package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.AssignedOrderDTO;
import org.example.gender_healthcare_stem.testing.dto.CollectSampleRequest;
import org.example.gender_healthcare_stem.testing.dto.TestResultDetailDTO;
import org.example.gender_healthcare_stem.testing.dto.TestTypeDetailDTO;
import org.example.gender_healthcare_stem.testing.model.*;
import org.example.gender_healthcare_stem.testing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private STIAppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private TestResultDetailRepository testResultDetailRepository;

    @Autowired
    private TestTypeRepository testTypeRepository;

    public boolean collectSample(Long orderId) {
        // Validate the order ID and staff ID
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> staff = userRepository.findByEmail(email);
        if (staff.isEmpty()) {
            throw new RuntimeException("Staff not found");
        }
        User staffUser = staff.get();

        //Find appointment by orderId
        Optional<STIAppointment> appointmentO = appointmentRepository.findById(orderId);
        if (appointmentO.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        STIAppointment appointment = appointmentO.get();
        // Check if staff is assigned to this appointment
        if (appointment.getStaff() != null && !appointment.getStaff().equals(staffUser.getId())) {
            throw new RuntimeException("Staff not assigned to this appointment");
        }

        // Update appointment status
        appointment.setStatus("completed");

        // if no staff is assigned, assign the current staff
//        if(appointment.getStaff() == null){
//            appointment.setStaff(staffUser.getId());
//        }

        appointmentRepository.save(appointment);
        return true;
    }

    public boolean updateToInProgress(Long orderId) {
        // Validate the order ID and staff ID
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> staff = userRepository.findByEmail(email);
        if (staff.isEmpty()) {
            throw new RuntimeException("Staff not found");
        }
        User staffUser = staff.get();

        //Find appointment by orderId
        Optional<STIAppointment> appointmentO = appointmentRepository.findById(orderId);
        if (appointmentO.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        STIAppointment appointment = appointmentO.get();
        // Check if staff is assigned to this appointment
        if (appointment.getStaff() != null && !appointment.getStaff().equals(staffUser.getId())) {
            throw new RuntimeException("Staff not assigned to this appointment");
        }

        // Update appointment status
        appointment.setStatus("pending");

        // if no staff is assigned, assign the current staff
//        if(appointment.getStaff() == null){
//            appointment.setStaff(staffUser.getId());
//        }

        appointmentRepository.save(appointment);
        return true;
    }

    public List<AssignedOrderDTO> getAssignedOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> staffO = userRepository.findByEmail(email);
        if (staffO.isEmpty()) {
            throw new RuntimeException("Staff not found");
        }
        User staffUser = staffO.get();

        // Fetch all appointments assigned to the staff
        List<STIAppointment> appointments = appointmentRepository.findByStaff_Id(staffUser.getId());
        List<AssignedOrderDTO> dtoList = new ArrayList<>();
        // Convert to DTOs
        for (STIAppointment a : appointments) {
            AssignedOrderDTO dto = new AssignedOrderDTO();
            dto.setAppointmentId(a.getAppointmentId());
            dto.setCustomerId(a.getCustomer().getCustomerId());
            dto.setCustomerName(a.getCustomer().getUser().getFullName());
            dto.setStatus(a.getStatus());
            dto.setAmount(a.getAmount());

            // Fetch invoice
            Invoices invoice = invoiceRepository.findByAppointmentId(a.getAppointmentId()).orElse(null);
            if (invoice != null) {
                dto.setPaid(invoice.isPaid());
                dto.setPaymentProof(invoice.getPayment_method()); // or payment_proof if renamed
            }

            //Fetch test results and details
            TestResult testResult = testResultRepository.findByAppointment_AppointmentId(a.getAppointmentId());

            List<String> testNames = new ArrayList<>();

            if (testResult != null) {
                List<TestResultDetail> details = testResultDetailRepository.findByTestResult_ResultId(testResult.getResultId());

                for (TestResultDetail detail : details) {
                    TestType test = testTypeRepository.findById(detail.getTestType().getTestId()).orElseThrow(() -> new RuntimeException("Test type not found"));
                    if(test == null){
                        testNames.add(test.getTestName());
                    }
                }
            }
            dto.setTestNames(testNames);
            dtoList.add(dto);
        }
        return dtoList;
    }
}