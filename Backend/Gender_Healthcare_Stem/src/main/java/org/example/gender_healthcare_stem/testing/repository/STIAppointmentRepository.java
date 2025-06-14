package org.example.gender_healthcare_stem.testing.repository;

import java.util.List;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface STIAppointmentRepository extends JpaRepository<STIAppointment, Long> {
    List<STIAppointment> findByCustomer_Id(Long id);
    List<STIAppointment> findByStaff_Id(Long staffId);
}
