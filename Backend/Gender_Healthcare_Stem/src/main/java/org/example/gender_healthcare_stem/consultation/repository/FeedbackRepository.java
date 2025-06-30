package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.admin.dto.AdminFeedbackDTO;
import org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByConsultantId(Long consultantId);

    List<Feedback> findByCustomerId(Long customerId);

    Optional<Feedback> findByConsultationId(Long consultationId);

    @Query("""
                SELECT 
                    f.feedbackId AS feedbackId,
                    cu.user.fullName AS customerName,
                    co.user.fullName AS consultantName,
                    f.rating AS rating,
                    f.comment AS comment,
                    TO_CHAR(f.createdAt, 'YYYY-MM-DD HH24:MI:SS') AS createdAt
                FROM Feedback f
                LEFT JOIN Customer cu ON cu.id = f.customerId
                LEFT JOIN Consultant co ON co.userId = f.consultantId
            """)
    List<AdminFeedbackDTO> getAdminFeedbacks();
    @Query("SELECT new org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary(f.consultantId, AVG(f.rating), COUNT(f)) " +
            "FROM Feedback f GROUP BY f.consultantId")
    List<ConsultantRatingSummary> getConsultantRatingSummaries();


}
