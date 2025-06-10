package org.example.gender_healthcare_stem.menstrual.controller;

import org.example.gender_healthcare_stem.menstrual.dto.CycleHistoryDTO;
import org.example.gender_healthcare_stem.menstrual.dto.MenstrualCycleDTO;
import org.example.gender_healthcare_stem.menstrual.model.MenstrualCycle;
import org.example.gender_healthcare_stem.menstrual.service.MenstrualCycleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menstrual")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MenstrualCycleController {

    private static final Logger log = LoggerFactory.getLogger(MenstrualCycleController.class);

    @Autowired
    private MenstrualCycleService service;

    @PostMapping("/{customerId}")
    public MenstrualCycle saveCycle(
            @PathVariable Integer customerId,
            @RequestBody MenstrualCycleDTO dto) {
        return service.saveCycle(customerId, dto);
    }

    @GetMapping("/{customerId}/day")
    public MenstrualCycle getCycleByDate(
            @PathVariable Integer customerId,
            @RequestParam String date) {
        return service.getCycleByDate(customerId, date);
    }

    @GetMapping("/{customerId}/month")
    public List<MenstrualCycle> getCyclesByMonth(
            @PathVariable Integer customerId,
            @RequestParam int year,
            @RequestParam int month) {
        return service.getCyclesInMonth(customerId, year, month);
    }

    @PostMapping("/{customerId}/bulk")
    public ResponseEntity<?> saveBulkCycles(
            @PathVariable int customerId,
            @RequestBody List<MenstrualCycleDTO> cycleList) {

        for (MenstrualCycleDTO dto : cycleList) {
            service.saveOrUpdateCycle(customerId, dto);
        }

        return ResponseEntity.ok("Saved successfully");
    }

    @GetMapping("/cycle-history/{customerId}")
    public List<CycleHistoryDTO> getCycleHistory(@PathVariable int customerId) {
        log.debug("📊 getCycleHistory called for customerId={}", customerId);
        return service.getRecentCycles(customerId);
    }
}

