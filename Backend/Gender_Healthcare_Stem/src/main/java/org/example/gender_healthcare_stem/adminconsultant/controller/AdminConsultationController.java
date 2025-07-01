package org.example.gender_healthcare_stem.adminconsultant.controller;

import org.example.gender_healthcare_stem.adminconsultant.dto.ConsultantFeedbackDTO;
import org.example.gender_healthcare_stem.adminconsultant.dto.ConsultationAppointmentDto;
import org.example.gender_healthcare_stem.adminconsultant.service.AdminConsultationService;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/consultation")
public class AdminConsultationController {

    @Autowired
    private AdminConsultationService adminConsultationService;

    @Autowired
    private ConsultationAppointmentRepository appointmentRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public AdminConsultationController(AdminConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ConsultationAppointmentDto>> getAllConsultations() {
        List<ConsultationAppointmentDto> appointments = adminConsultationService.getAllConsultations();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/override-status/{id}")
    public ResponseEntity<String> overrideStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String newStatus = request.get("status");
        adminConsultationService.overrideAppointmentStatus(id, newStatus);
        return ResponseEntity.ok("Status updated successfully");
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ConsultationAppointmentDto>> getConsultationLogs() {
        List<ConsultationAppointmentDto> appointments = adminConsultationService.getConsultationLogs();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/consultant-performance")
    public ResponseEntity<List<Map<String, Object>>> getConsultantPerformance() {
        List<Map<String, Object>> performance = adminConsultationService.getConsultantPerformance();
        return ResponseEntity.ok(performance);
    }
    private final AdminConsultationService consultationService;

    @GetMapping("/consultant-feedback/{consultantId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getConsultantFeedback(@PathVariable Long consultantId) {
        try {
            List<ConsultantFeedbackDTO> feedbacks = consultationService.getFeedbacksByConsultantId(consultantId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching feedback: " + e.getMessage());
        }
    }

    @GetMapping("/statistics/total-appointments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Integer> getTotalConsultations() {
        int total = adminConsultationService.getTotalConsultations();
        return ResponseEntity.ok(total);
    }
}