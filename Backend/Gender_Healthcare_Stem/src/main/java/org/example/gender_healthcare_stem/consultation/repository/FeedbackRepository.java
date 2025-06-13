package org.example.gender_healthcare_stem.consultation.repository;

import org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByConsultantId(Long consultantId);
    List<Feedback> findByCustomerId(Long customerId);

    // Custom query to get feedback with user names
    @Query("SELECT new org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO(" +
            "f.feedbackId, f.customerId, cu.fullName, f.consultantId, co.fullName, " +
            "f.rating, f.comment, f.createdAt) " +
            "FROM Feedback f " +
            "JOIN Users cu ON f.customerId = cu.userId " +
            "JOIN Users co ON f.consultantId = co.userId")
    List<FeedbackWithUserDTO> findAllFeedbackWithUserNames();

    // Get feedback by consultant with user names
    @Query("SELECT new org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO(" +
            "f.feedbackId, f.customerId, cu.fullName, f.consultantId, co.fullName, " +
            "f.rating, f.comment, f.createdAt) " +
            "FROM Feedback f " +
            "JOIN Users cu ON f.customerId = cu.userId " +
            "JOIN Users co ON f.consultantId = co.userId " +
            "WHERE f.consultantId = :consultantId")
    List<FeedbackWithUserDTO> findFeedbackByConsultantWithUserNames(@Param("consultantId") Long consultantId);

    // Get feedback by customer with user names
    @Query("SELECT new org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO(" +
            "f.feedbackId, f.customerId, cu.fullName, f.consultantId, co.fullName, " +
            "f.rating, f.comment, f.createdAt) " +
            "FROM Feedback f " +
            "JOIN Users cu ON f.customerId = cu.userId " +
            "JOIN Users co ON f.consultantId = co.userId " +
            "WHERE f.customerId = :customerId")
    List<FeedbackWithUserDTO> findFeedbackByCustomerWithUserNames(@Param("customerId") Long customerId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.consultantId = :consultantId")
    Double calculateAverageRatingByConsultantId(@Param("consultantId") Long consultantId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.consultantId = :consultantId")
    Long countFeedbacksByConsultantId(@Param("consultantId") Long consultantId);
}