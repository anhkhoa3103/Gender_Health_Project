package org.example.gender_healthcare_stem.consultation.service;

import jakarta.transaction.Transactional;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentRequest;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationAppointmentService {
    private final ConsultationAppointmentRepository appointmentRepository;
    private final WorkSlotRepository workslotRepository;


    public ConsultationAppointmentService(
            ConsultationAppointmentRepository appointmentRepository,
            WorkSlotRepository workslotRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.workslotRepository = workslotRepository;
    }

    public ConsultationAppointment save(ConsultationAppointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<ConsultationAppointment> findAll() {
        return appointmentRepository.findAll();
    }

    public Optional<ConsultationAppointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<ConsultationAppointment> findByCustomerId(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    @Transactional
    public ConsultationAppointment saveAppointment(ConsultationAppointmentRequest request) {
        ConsultationAppointment appointment = new ConsultationAppointment();

        appointment.setConsultantId(request.getConsultantId());
        appointment.setCustomerId(request.getCustomerId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setWorkslotId(request.getWorkslotId());
        appointment.setName(request.getName());
        appointment.setPhoneNumber(request.getPhoneNumber());
        appointment.setNote(request.getNote());
        appointment.setStatus("PENDING");

        ConsultationAppointment savedAppointment = appointmentRepository.save(appointment);

        // 🔒 Sau khi lưu appointment -> set slot isAvailable = false
        WorkSlot slot = workslotRepository.findById(request.getWorkslotId())
                .orElseThrow(() -> new RuntimeException("Workslot not found"));
        System.out.println(">>> Workslot ID: " + request.getWorkslotId());
        slot.setIsAvailable(false);
        workslotRepository.save(slot);

        return savedAppointment;
    }

}
