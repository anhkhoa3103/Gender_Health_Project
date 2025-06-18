package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface STIAppointmentRepository extends JpaRepository<STIAppointment, Long> {

}
