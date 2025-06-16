package org.example.gender_healthcare_stem.consultant.controller;


import org.example.gender_healthcare_stem.consultant.dto.ConsultantDTO;
import org.example.gender_healthcare_stem.consultant.service.ConsultantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConsultantController {

    private final ConsultantService consultantService;

    public ConsultantController(ConsultantService consultantService) {
        this.consultantService = consultantService;
    }

    @GetMapping("/getall")
    public List<ConsultantDTO> getAllConsultants() {
        return consultantService.getAllConsultants();
    }
}

