package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.ConsultationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultationResultRepository extends JpaRepository<ConsultationResult, Long> {
    Optional<ConsultationResult> findByConsultation_ConsultationId(Long consultationId);
}

