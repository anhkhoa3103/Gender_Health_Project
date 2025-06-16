package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentRequest;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.service.ConsultationAppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultationAppointmentController {
    private final ConsultationAppointmentService appointmentService;

    public ConsultationAppointmentController(ConsultationAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Lấy danh sách lịch
    @GetMapping
    public List<ConsultationAppointment> getAllAppointments() {
        return appointmentService.findAll();
    }

    // Tạo lịch mới (dùng DTO request)
    @PostMapping
    public ResponseEntity<ConsultationAppointment> createAppointment(@RequestBody ConsultationAppointmentRequest request) {
        ConsultationAppointment saved = appointmentService.saveAppointment(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{customerId}")
    public ResponseEntity<List<ConsultationAppointment>> getAppointmentsByCustomer(@PathVariable Long customerId) {
        List<ConsultationAppointment> appointments = appointmentService.findByCustomerId(customerId);
        return ResponseEntity.ok(appointments);
    }
}

