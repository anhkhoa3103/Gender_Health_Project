package org.example.gender_healthcare_stem.consultant.service;


import org.example.gender_healthcare_stem.consultant.dto.ConsultantDTO;
import org.example.gender_healthcare_stem.consultant.model.Consultant;
import org.example.gender_healthcare_stem.consultant.repository.ConsultantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultantService {

    private final ConsultantRepository consultantRepository;

    public ConsultantService(ConsultantRepository consultantRepository) {
        this.consultantRepository = consultantRepository;
    }

    public List<ConsultantDTO> getAllConsultants() {
        List<Consultant> consultants = consultantRepository.findAll();

        return consultants.stream()
                .map(c -> new ConsultantDTO(
                        c.getUserId(),
                        c.getUser() != null ? c.getUser().getFullName() : null,
                        c.getUser() != null ? c.getUser().getAvatar() : null,
                        c.getSpecialization(),
                        c.getQualification(),
                        c.getExperiencedYears(),
                        c.getGoogleMeetLinks()))
                .collect(Collectors.toList());
    }

    public ConsultantDTO getConsultantById(Long consultantId) {
        Consultant consultant = consultantRepository.findById(consultantId.intValue())
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        return new ConsultantDTO(
                consultant.getUserId(),
                consultant.getUser().getFullName(),
                consultant.getUser().getAvatar(),
                consultant.getSpecialization(),
                consultant.getQualification(),
                consultant.getExperiencedYears(),
                consultant.getGoogleMeetLinks()
        );
    }
}


