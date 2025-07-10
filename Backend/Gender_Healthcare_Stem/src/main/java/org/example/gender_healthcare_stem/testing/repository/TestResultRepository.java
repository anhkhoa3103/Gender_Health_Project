package org.example.gender_healthcare_stem.testing.repository;

import org.example.gender_healthcare_stem.testing.dto.TestResultDTO;
import org.example.gender_healthcare_stem.testing.model.STIAppointment;
import org.example.gender_healthcare_stem.testing.model.TestResult;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Integer> {
    Optional<TestResult> findByAppointment(STIAppointment appointment);

    List<TestResult> findByCustomer_Id(Integer customerId);

    @EntityGraph(attributePaths = "details")
    @Query("SELECT t FROM TestResult t")
        // Bắt buộc khi dùng @EntityGraph để rõ ràng
    List<TestResult> findAllWithDetails();

    @Query("""
                SELECT new org.example.gender_healthcare_stem.testing.dto.TestResultDTO(
                    r.resultId,
                    u.fullName,
                    a.appointmentId,
                    u.id,
                    CASE WHEN COUNT(d) > 0 THEN true ELSE false END
                )
                FROM TestResult r
                JOIN r.customer c
                JOIN c.user u
                JOIN r.appointment a
                LEFT JOIN r.details d ON d.value IS NOT NULL AND d.value <> ''
                GROUP BY r.resultId, u.fullName, a.appointmentId, u.id
            """)
    List<TestResultDTO> getAllTestResultDTOs();

}
