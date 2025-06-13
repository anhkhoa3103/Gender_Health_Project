package org.example.gender_healthcare_stem.consultation.service;

import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.consultation.dto.AvailableSlotDTO;
import org.example.gender_healthcare_stem.consultation.model.ConsolidationAppointment;
import org.example.gender_healthcare_stem.consultation.model.Slot;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.ConsolidationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.SlotRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotAvailabilityService {
    private final WorkSlotRepository workSlotRepository;
    private final SlotRepository slotRepository;
    private final ConsolidationAppointmentRepository appointmentRepository;

    public List<AvailableSlotDTO> getAvailableSlots(LocalDate date, int consultantId) {
        // 1. Get all work slots for the consultant on the given date
        List<WorkSlot> workSlots = workSlotRepository.findByConsultantIdAndWorkslotDate(consultantId, date);

        if (workSlots.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Get all slot IDs from work slots
        Set<Long> slotIds = workSlots.stream()
                .map(WorkSlot::getSlotId)
                .collect(Collectors.toSet());

        // 3. Get all slot details
        Map<Long, Slot> slotMap = slotRepository.findAllById(slotIds).stream()
                .collect(Collectors.toMap(Slot::getSlotId, slot -> slot));

        // 4. Get all booked appointments for the consultant on the given date
        List<ConsolidationAppointment> appointments = appointmentRepository
                .findByConsultantIdAndAppointmentDate(String.valueOf(consultantId), date);

        Set<Long> bookedSlotIds = appointments.stream()
                .map(ConsolidationAppointment::getWorkslotId)
                .collect(Collectors.toSet());

        // 5. Filter available slots
        return workSlots.stream()
                .filter(workSlot -> !bookedSlotIds.contains(workSlot.getWorkslotId()))
                .map(workSlot -> {
                    Slot slot = slotMap.get(workSlot.getSlotId());
                    AvailableSlotDTO dto = new AvailableSlotDTO();
                    dto.setSlotId(slot.getSlotId());
                    dto.setStartTime(slot.getStartTime());
                    dto.setEndTime(slot.getEndTime());
                    dto.setDescription(slot.getDescription());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}