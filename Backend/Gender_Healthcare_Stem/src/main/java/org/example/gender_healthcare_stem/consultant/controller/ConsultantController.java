package org.example.gender_healthcare_stem.consultant.controller;


import org.example.gender_healthcare_stem.consultant.dto.ConsultantDTO;
import org.example.gender_healthcare_stem.consultant.service.ConsultantService;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentDTO;
import org.example.gender_healthcare_stem.consultation.dto.WorkSlotRequest;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.example.gender_healthcare_stem.consultation.service.ConsultationAppointmentService;
import org.springframework.http.ResponseEntity;
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

    public ConsultantController(ConsultantService consultantService, WorkSlotRepository workSlotRepository,
                                ConsultationAppointmentService consultationAppointmentService) {
        this.workSlotRepository = workSlotRepository;
        this.consultantService = consultantService;
        this.consultationAppointmentService = consultationAppointmentService;
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

}

