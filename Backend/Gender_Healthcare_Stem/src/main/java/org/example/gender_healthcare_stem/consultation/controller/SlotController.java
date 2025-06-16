package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.model.Slot;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.SlotRepository;
import org.example.gender_healthcare_stem.consultation.service.WorkSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consultation")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SlotController {

    private final SlotRepository slotRepository;
    private final WorkSlotService workSlotService;

    public SlotController(SlotRepository slotRepository, WorkSlotService workSlotService) {
        this.slotRepository = slotRepository;
        this.workSlotService = workSlotService;
    }

    // 1. API lấy tất cả slot
    @GetMapping("/slots")
    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }

    // 2. API lấy các work slot có sẵn trong ngày cho consultant
    @GetMapping("/available-workslots")
    public List<WorkSlot> getAvailableWorkSlots(
            @RequestParam Long consultantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return workSlotService.getAvailableWorkSlots(consultantId, date);
    }
}


