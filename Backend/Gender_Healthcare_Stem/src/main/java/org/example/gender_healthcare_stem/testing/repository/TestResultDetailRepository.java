package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.model.TestResultDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultDetailRepository extends JpaRepository<TestResultDetail, Integer> {
    List<TestResultDetail> findByTestResult_ResultId(Integer resultId);
}
