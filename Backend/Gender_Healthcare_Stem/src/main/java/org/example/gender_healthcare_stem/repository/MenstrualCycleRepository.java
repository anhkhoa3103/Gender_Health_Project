package org.example.gender_healthcare_stem.repository;

import org.example.gender_healthcare_stem.dto.CycleHistoryDTO;
import org.example.gender_healthcare_stem.model.MenstrualCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Long> {
    List<MenstrualCycle> findByCustomerIdAndCycleDateBetween(Integer customerId, LocalDate start, LocalDate end);

    MenstrualCycle findByCustomerIdAndCycleDate(Integer customerId, LocalDate date);

    Optional<MenstrualCycle> findByCustomerIdAndCycleDate(int customerId, LocalDate cycleDate);

    @Query(value = """
                  SELECT
                    start_date   AS startDate,
                    CAST(period_days AS INTEGER)  AS periodDays,
                    CAST(cycle_days AS INTEGER)   AS cycleDays
                  FROM cycle_history_view
                  WHERE customer_id = :customerId
                  ORDER BY start_date DESC
                  LIMIT 3
            """, nativeQuery = true)
    List<CycleHistoryDTO> findRecentCycles(int customerId);

}