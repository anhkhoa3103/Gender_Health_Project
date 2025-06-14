package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestResultRepository extends JpaRepository<TestResult, Integer> {
    TestResult findByAppointment_AppointmentId(Integer appointmentId);
}
