package org.example.gender_healthcare_stem.consultant.repository;

import org.example.gender_healthcare_stem.consultant.model.ConsultantUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultantUpdateRequestRepository extends JpaRepository<ConsultantUpdateRequest, Long> {
    List<ConsultantUpdateRequest> findByStatus(String status);
    List<ConsultantUpdateRequest> findByConsultantId(Integer consultantId);
}
