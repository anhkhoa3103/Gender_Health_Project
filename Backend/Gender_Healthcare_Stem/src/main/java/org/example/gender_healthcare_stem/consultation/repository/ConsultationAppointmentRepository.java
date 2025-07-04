package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.ConsultationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsultationAppointmentRepository extends JpaRepository<ConsultationAppointment, Long> {
    List<ConsultationAppointment> findByCustomerId(Long customerId);

    List<ConsultationAppointment> findByConsultantId(Long consultantId);
    // Example method, implement as needed
    Optional<ConsultationAppointment> findByCustomerIdAndConsultantIdAndAppointmentDateAndWorkslotId(
            Long customerId, Long consultantId, LocalDate appointmentDate, Long workslotId);


}
