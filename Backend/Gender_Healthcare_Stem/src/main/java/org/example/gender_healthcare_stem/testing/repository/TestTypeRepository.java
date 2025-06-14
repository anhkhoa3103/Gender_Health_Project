package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.TestType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestTypeRepository extends JpaRepository<TestType, Integer> {
}