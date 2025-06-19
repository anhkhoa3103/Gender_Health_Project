package org.example.gender_healthcare_stem.consultation.service;

import jakarta.transaction.Transactional;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentDTO;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationAppointmentRequest;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.model.Slot;
import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.SlotRepository;
import org.example.gender_healthcare_stem.consultation.repository.WorkSlotRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationAppointmentService {
    private final ConsultationAppointmentRepository appointmentRepository;
    private final WorkSlotRepository workslotRepository;
    private final SlotRepository slotRepository;


    public ConsultationAppointmentService(
            ConsultationAppointmentRepository appointmentRepository,
            WorkSlotRepository workslotRepository,
            SlotRepository slotRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.workslotRepository = workslotRepository;
        this.slotRepository = slotRepository;
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

    public List<ConsultationAppointmentDTO> findByConsultantId(Long consultantId) {
        List<ConsultationAppointment> appointments = appointmentRepository.findByConsultantId(consultantId);

        return appointments.stream().map(appointment -> {
            String timeRange = "";
            if (appointment.getWorkslotId() != null) {
                Optional<Slot> slotOpt = workslotRepository.findById(appointment.getWorkslotId())
                        .flatMap(ws -> slotRepository.findById(ws.getSlotId()));
                if (slotOpt.isPresent()) {
                    Slot slot = slotOpt.get();
                    timeRange = slot.getStartTime() + " - " + slot.getEndTime();
                }
            }

            return ConsultationAppointmentDTO.builder()
                    .consultationId(appointment.getConsultationId())
                    .name(appointment.getName())
                    .phoneNumber(appointment.getPhoneNumber())
                    .appointmentDate(appointment.getAppointmentDate().toString())
                    .timeRange(timeRange)
                    .note(appointment.getNote())
                    .status(appointment.getStatus())
                    .build();
        }).toList();
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
        appointment.setCreatedAt(LocalDateTime.now());

        ConsultationAppointment savedAppointment = appointmentRepository.save(appointment);

        // 🔒 Sau khi lưu appointment -> set slot isAvailable = false
        WorkSlot slot = workslotRepository.findById(request.getWorkslotId())
                .orElseThrow(() -> new RuntimeException("Workslot not found"));
        System.out.println(">>> Workslot ID: " + request.getWorkslotId());
        slot.setIsAvailable(false);
        workslotRepository.save(slot);

        return savedAppointment;
    }

    public boolean markAsDone(Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus("DONE");
                    appointmentRepository.save(appointment);
                    return true;
                })
                .orElse(false);
    }

    public List<ConsultationAppointmentDTO> getAppointmentsWithConsultantInfo(Long customerId) {
        List<ConsultationAppointment> appointments = appointmentRepository.findByCustomerId(customerId);

        return appointments.stream().map(appointment -> {
            String timeRange = "";
            String consultantName = "";
            String meetLink = "";

            if (appointment.getWorkslotId() != null) {
                Optional<Slot> slotOpt = workslotRepository.findById(appointment.getWorkslotId())
                        .flatMap(ws -> slotRepository.findById(ws.getSlotId()));
                if (slotOpt.isPresent()) {
                    Slot slot = slotOpt.get();
                    timeRange = slot.getStartTime() + " - " + slot.getEndTime();
                }
            }

            if (appointment.getConsultantId() != null) {
                consultantName = appointment.getConsultant().getUser().getFullName();  // cần join consultant
                meetLink = appointment.getConsultant().getGoogleMeetLinks();
            }

            return ConsultationAppointmentDTO.builder()
                    .consultationId(appointment.getConsultationId())
                    .consultantId(appointment.getConsultantId())
                    .name(appointment.getName())
                    .phoneNumber(appointment.getPhoneNumber())
                    .appointmentDate(appointment.getAppointmentDate().toString())
                    .timeRange(timeRange)
                    .note(appointment.getNote())
                    .status(appointment.getStatus())
                    .consultantName(consultantName)
                    .meetLink(meetLink)
                    .build();
        }).toList();
    }

    public boolean cancelAppointment(Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus("CANCELLED");
                    appointmentRepository.save(appointment);

                    // mở lại slot nếu cần
                    if (appointment.getWorkslotId() != null) {
                        workslotRepository.findById(appointment.getWorkslotId())
                                .ifPresent(ws -> {
                                    ws.setIsAvailable(true);
                                    workslotRepository.save(ws);
                                });
                    }

                    return true;
                })
                .orElse(false);
    }

}
