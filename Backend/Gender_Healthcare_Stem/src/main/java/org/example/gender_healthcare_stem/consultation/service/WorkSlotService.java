package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkSlotService {

    private final WorkSlotRepository workSlotRepository;

    public WorkSlotService(WorkSlotRepository workSlotRepository) {
        this.workSlotRepository = workSlotRepository;
    }

    public List<WorkSlot> getAvailableWorkSlots(Long consultantId, LocalDate date) {
        return workSlotRepository.findByConsultantIdAndWorkslotDateAndIsAvailableTrue(consultantId, date);
    }
}
