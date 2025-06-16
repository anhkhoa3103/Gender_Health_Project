package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentRequest;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationAppointmentService {
    private final ConsultationAppointmentRepository appointmentRepository;

    public ConsultationAppointmentService(ConsultationAppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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

        return appointmentRepository.save(appointment);
    }
}
