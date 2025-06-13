package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.ConsolidationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ConsolidationAppointmentRepository extends JpaRepository<ConsolidationAppointment, Long> {
    List<ConsolidationAppointment> findByConsultantIdAndAppointmentDate(String consultantId, LocalDate date);
}
