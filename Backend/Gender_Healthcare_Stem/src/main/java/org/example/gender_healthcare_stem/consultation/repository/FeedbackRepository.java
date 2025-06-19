package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByConsultantId(Long consultantId);
    List<Feedback> findByCustomerId(Long customerId);
    Optional<Feedback> findByConsultationId(Long consultationId);
}
