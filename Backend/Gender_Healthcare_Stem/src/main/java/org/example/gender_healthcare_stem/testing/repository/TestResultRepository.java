package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Integer> {
    Optional<TestResult> findByAppointment(STIAppointment appointment);


}
