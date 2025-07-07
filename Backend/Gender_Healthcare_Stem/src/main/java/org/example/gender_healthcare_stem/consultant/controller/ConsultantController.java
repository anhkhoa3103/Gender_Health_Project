package org.example.gender_healthcare_stem.consultant.controller;


import org.example.gender_healthcare_stem.consultant.dto.ConsultantDTO;
import org.example.gender_healthcare_stem.consultant.service.ConsultantService;
import org.example.gender_healthcare_stem.consultation.dto.*;
import org.example.gender_healthcare_stem.consultation.model.ConsultationResult;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationResultRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.example.gender_healthcare_stem.consultation.service.ConsultationAppointmentService;
import org.example.gender_healthcare_stem.consultation.service.ConsultationResultService;
import org.example.gender_healthcare_stem.consultation.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultantController {

    private final ConsultantService consultantService;
    private final WorkSlotRepository workSlotRepository;
    private final ConsultationAppointmentService consultationAppointmentService;
    private final FeedbackService feedbackService;
    private final ConsultationResultService consultationResultService;
    private final ConsultationResultRepository consultationResultRepository;

    public ConsultantController(ConsultantService consultantService, WorkSlotRepository workSlotRepository,
                                ConsultationAppointmentService consultationAppointmentService,
                                FeedbackService feedbackService,
                                ConsultationResultService consultationResultService,
                                ConsultationResultRepository consultationResultRepository) {
        this.workSlotRepository = workSlotRepository;
        this.consultantService = consultantService;
        this.consultationAppointmentService = consultationAppointmentService;
        this.feedbackService = feedbackService;
        this.consultationResultService = consultationResultService;
        this.consultationResultRepository = consultationResultRepository;
    }

    @GetMapping("/getall")
    public List<ConsultantDTO> getAllConsultants() {
        return consultantService.getAllConsultants();
    }

    @PostMapping("/workslots")
    public ResponseEntity<?> updateWorkSlots(@RequestBody WorkSlotRequest request) {
        Long consultantId = request.getConsultantId();
        LocalDate date = request.getWorkslotDate();
        List<Long> newSlotIds = request.getSlotIds();

        // Lấy tất cả workslots trong ngày của consultant
        List<WorkSlot> existingSlots = workSlotRepository
                .findByConsultantIdAndWorkslotDate(consultantId, date);

        // Cập nhật trạng thái: slot nào được chọn thì rãnh, ngược lại không rãnh
        for (WorkSlot ws : existingSlots) {
            ws.setIsAvailable(newSlotIds.contains(ws.getSlotId()));
            ws.setUpdatedAt(LocalDateTime.now());
        }

        // Thêm mới các slot chưa tồn tại
        for (Long slotId : newSlotIds) {
            boolean exists = existingSlots.stream().anyMatch(ws -> ws.getSlotId().equals(slotId));
            if (!exists) {
                WorkSlot newSlot = WorkSlot.builder()
                        .consultantId(consultantId)
                        .slotId(slotId)
                        .workslotDate(date)
                        .isAvailable(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                existingSlots.add(newSlot);
            }
        }

        workSlotRepository.saveAll(existingSlots);
        return ResponseEntity.ok("Cập nhật lịch làm việc thành công.");
    }


    @GetMapping("/appointments")
    public List<ConsultationAppointmentDTO> getAppointmentsForConsultant(@RequestParam Long consultantId) {
        return consultationAppointmentService.findByConsultantId(consultantId);
    }

    @PutMapping("/appointments/{id}/complete")
    public ResponseEntity<String> markAppointmentAsDone(@PathVariable Long id) {
        boolean updated = consultationAppointmentService.markAsDone(id);
        if (updated) {
            return ResponseEntity.ok("Cập nhật trạng thái thành công.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{consultantId}/feedbacks")
    public ResponseEntity<List<FeedbackDTO>> getFeedbacksForConsultant(@PathVariable Long consultantId) {
        List<FeedbackDTO> feedbacks = feedbackService.getDTOByConsultantId(consultantId);
        System.out.println("Feedback DTOs size: " + feedbacks.size());
        return ResponseEntity.ok(feedbacks);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteCancelledAppointment(@PathVariable Long id, Authentication authentication) {
        boolean deleted = consultationAppointmentService.deleteCancelledAppointment(id);
        if (deleted) {
            return ResponseEntity.ok("Xóa lịch hẹn đã hủy thành công.");
        } else {
            return ResponseEntity.badRequest().body("Chỉ được xóa các lịch hẹn đã hủy hoặc không tồn tại.");
        }
    }

    @PostMapping("/results")
    public ResponseEntity<?> submitResult(@RequestBody ConsultationResultRequest request) {
        System.out.println("📥 Nhận request: " + request);
        try {
            ConsultationResultResponse savedResult = consultationResultService.saveResult(request);
            return ResponseEntity.ok(savedResult); // ✅ Trả về object chi tiết
        } catch (Exception e) {
            e.printStackTrace(); // log lỗi cụ thể
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/results/by-consultation/{id}")
    public ResponseEntity<ConsultationResultResponse> getResultByConsultationId(@PathVariable Long id) {
        ConsultationResult result = consultationResultRepository.findByConsultation_ConsultationId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kết quả tư vấn"));

        return ResponseEntity.ok(new ConsultationResultResponse(
                result.getConsultationResultId(),
                result.getConsultation().getConsultationId(),  // ✅ Sửa dòng này
                result.getResult(),
                result.getNotes(),
                result.getCreatedAt()
        ));
    }

    @GetMapping("/{consultantId}")
    public ResponseEntity<ConsultantDTO> getConsultantInfo(@PathVariable Long consultantId) {
        ConsultantDTO dto = consultantService.getConsultantById(consultantId);
        return ResponseEntity.ok(dto);
    }
}

