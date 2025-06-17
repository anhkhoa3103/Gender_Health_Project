package org.example.gender_healthcare_stem.testing.service;

import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.testing.dto.CollectSampleRequest;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.repository.STIAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private STIAppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean collectSample(Long orderId) {
        // Validate the order ID and staff ID
        Optional<User> staff = userRepository.findByEmail("staff@example.com");
        if (staff.isEmpty()) {
            throw new RuntimeException("Staff not found");
        }
        boolean exists = appointmentRepository.existsById(orderId);
        return exists;
    }

    public boolean updateStatus(Long orderId, CollectSampleRequest request) {
        // Validate the staff by email from request
        Optional<User> staff = userRepository.findByEmail(request.getStaffId() != null ? request.getStaffId().toString() : "");
        if (staff.isEmpty()) {
            throw new RuntimeException("Staff not found");
        }
        // Find the appointment by orderId
        Optional<STIAppointment> appointmentOpt = appointmentRepository.findById(orderId);
        if (appointmentOpt.isEmpty()) {
            return false;
        }
        STIAppointment appointment = appointmentOpt.get();
        // Example: set status to a new value from request notes (or hardcoded for demo)
        appointment.setStatus(request.getNotes() != null ? request.getNotes() : "COLLECTED");
        appointmentRepository.save(appointment);
        return true;
    }
}
