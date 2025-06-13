package org.example.gender_healthcare_stem.consultation.controller;

import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.consultation.dto.AvailableSlotDTO;
import org.example.gender_healthcare_stem.consultation.service.SlotAvailabilityService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/customer/consultation")

@RequiredArgsConstructor
public class AppointmentController {
    private final SlotAvailabilityService slotAvailabilityService;
    @GetMapping("/available-slots")
    public List<AvailableSlotDTO> getAvailableSlots(
            @RequestParam LocalDate date,
            @RequestParam int consultantId) {
        return slotAvailabilityService.getAvailableSlots(date, consultantId);
    }
}
