package org.example.gender_healthcare_stem.consultation.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationResultRequest;
import org.example.gender_healthcare_stem.consultation.dto.ConsultationResultResponse;
import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.example.gender_healthcare_stem.consultation.model.ConsultationResult;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationAppointmentRepository;
import org.example.gender_healthcare_stem.consultation.repository.ConsultationResultRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConsultationResultService {

    private final ConsultationAppointmentRepository appointmentRepository;
    private final ConsultationResultRepository resultRepository;

    @Transactional
    public ConsultationResultResponse saveResult(ConsultationResultRequest request) {
        ConsultationAppointment appointment = appointmentRepository.findById(request.getConsultationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn"));

        ConsultationResult result = ConsultationResult.builder()
                .consultation(appointment)  // chỉ cần cái này
                .result(request.getResult())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        ConsultationResult saved = resultRepository.save(result);

        return new ConsultationResultResponse(
                saved.getConsultationResultId(),
                appointment.getConsultationId(), // dùng từ appointment
                saved.getResult(),
                saved.getNotes(),
                saved.getCreatedAt()
        );
    }


}
