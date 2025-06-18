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
    public ResponseEntity<?> saveWorkSlots(@RequestBody WorkSlotRequest request) {
        for (Long slotId : request.getSlotIds()) {
            WorkSlot workSlot = WorkSlot.builder()
                    .consultantId(request.getConsultantId())
                    .workslotDate(request.getWorkslotDate())
                    .slotId(slotId)
                    .isAvailable(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            workSlotRepository.save(workSlot);
        }
        return ResponseEntity.ok("Lưu lịch thành công");
    }

    @GetMapping("/appointments")
    public List<ConsultationAppointmentDTO> getAppointmentsForConsultant(@RequestParam Long consultantId) {
        return consultationAppointmentService.findByConsultantId(consultantId);
    }


}

