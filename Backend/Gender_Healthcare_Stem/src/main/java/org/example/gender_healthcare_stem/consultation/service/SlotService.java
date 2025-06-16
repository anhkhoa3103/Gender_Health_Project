package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.model.Slot;
import org.example.gender_healthcare_stem.consultation.repository.SlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlotService {

    private final SlotRepository slotRepository;

    public SlotService(SlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }
}

