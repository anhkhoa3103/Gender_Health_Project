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
import org.example.gender_healthcare_stem.consultant.model.ConsultantUpdateRequest;
import org.example.gender_healthcare_stem.consultant.repository.ConsultantUpdateRequestRepository;
import org.example.gender_healthcare_stem.consultant.repository.ConsultantRepository;
import org.example.gender_healthcare_stem.consultant.model.Consultant;

import java.util.HashMap;
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

    @Autowired
    private ConsultantUpdateRequestRepository updateRequestRepository;

    @Autowired
    private ConsultantRepository consultantRepository;

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

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/consultant-update-requests")
    public ResponseEntity<List<ConsultantUpdateRequest>> getPendingConsultantUpdateRequests() {
        List<ConsultantUpdateRequest> pending = updateRequestRepository.findByStatus("pending");
        return ResponseEntity.ok(pending);
    }

//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/consultant-update-requests/{id}/review")
    public ResponseEntity<?> reviewConsultantUpdateRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        ConsultantUpdateRequest updateRequest = updateRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu cập nhật"));

        String action = request.get("action"); // "approve" hoặc "reject"
        String reason = request.get("reason"); // tùy chọn

        if ("approve".equalsIgnoreCase(action)) {
            Consultant consultant = consultantRepository.findById(updateRequest.getConsultantId())
                    .orElseThrow(() -> new RuntimeException("Consultant không tồn tại"));

            consultant.setSpecialization(updateRequest.getSpecialization());
            consultant.setQualification(updateRequest.getQualification());
            consultant.setExperiencedYears(updateRequest.getExperiencedYears());
            consultant.setGoogleMeetLinks(updateRequest.getGoogleMeetLinks());

            consultantRepository.save(consultant);
            updateRequest.setStatus("approved");
            updateRequest.setReason(null);

        } else if ("reject".equalsIgnoreCase(action)) {
            updateRequest.setStatus("rejected");
            updateRequest.setReason(reason != null ? reason : "Không có lý do cụ thể");
        } else {
            return ResponseEntity.badRequest().body("Hành động không hợp lệ: chỉ chấp nhận 'approve' hoặc 'reject'");
        }

        updateRequest.setUpdatedAt(java.time.LocalDateTime.now());
        updateRequestRepository.save(updateRequest);

        return ResponseEntity.ok("Đã xử lý yêu cầu cập nhật thành công.");
    }

    @GetMapping("/consultant-info/{id}")
    public ResponseEntity<?> getConsultantInfoForAdmin(@PathVariable Integer id) {
        Consultant consultant = consultantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultant"));

        Map<String, Object> result = new HashMap<>();
        result.put("consultantId", consultant.getUserId());
        result.put("fullName", consultant.getUser().getFullName());
        result.put("avatar", consultant.getUser().getAvatar());
        result.put("specialization", consultant.getSpecialization());
        result.put("qualification", consultant.getQualification());
        result.put("experiencedYears", consultant.getExperiencedYears());
        result.put("googleMeetLinks", consultant.getGoogleMeetLinks());

        return ResponseEntity.ok(result);
    }
}