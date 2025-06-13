package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.model.WorkSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WorkSlotRepository extends JpaRepository<WorkSlot, Long> {
    List<WorkSlot> findByConsultantIdAndWorkslotDate(int consultantId, LocalDate date);
}