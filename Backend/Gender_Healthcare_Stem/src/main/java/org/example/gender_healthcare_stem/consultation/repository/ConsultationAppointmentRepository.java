package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationAppointmentRepository extends JpaRepository<ConsultationAppointment, Long> {
    List<ConsultationAppointment> findByCustomerId(Long customerId);

    List<ConsultationAppointment> findByConsultantId(Long consultantId);
}
