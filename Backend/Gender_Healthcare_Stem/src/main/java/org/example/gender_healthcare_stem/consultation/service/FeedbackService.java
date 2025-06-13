package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackDTO;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback createFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = new Feedback();
        feedback.setCustomerId(feedbackDTO.getCustomerId());
        feedback.setConsultantId(feedbackDTO.getConsultantId());
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComment(feedbackDTO.getComment());
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbacksByConsultant(Long consultantId) {
        return feedbackRepository.findByConsultantId(consultantId);
    }

    public List<Feedback> getFeedbacksByCustomer(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId);
    }

    public Optional<Feedback> getFeedbackById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId);
    }

    public boolean deleteFeedback(Long feedbackId, Long customerId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (feedbackOpt.isPresent() && feedbackOpt.get().getCustomerId().equals(customerId)) {
            feedbackRepository.deleteById(feedbackId);
            return true;
        }
        return false;
    }

    // New methods to get feedback with user names
    public List<FeedbackWithUserDTO> getAllFeedbackWithUserNames() {
        return feedbackRepository.findAllFeedbackWithUserNames();
    }

    public List<FeedbackWithUserDTO> getFeedbacksByConsultantWithUserNames(Long consultantId) {
        return feedbackRepository.findFeedbackByConsultantWithUserNames(consultantId);
    }

    public List<FeedbackWithUserDTO> getFeedbacksByCustomerWithUserNames(Long customerId) {
        return feedbackRepository.findFeedbackByCustomerWithUserNames(customerId);
    }
    public Double getAverageRatingForConsultant(Long consultantId) {
        return feedbackRepository.calculateAverageRatingByConsultantId(consultantId);
    }

    public Long getFeedbackCountForConsultant(Long consultantId) {
        return feedbackRepository.countFeedbacksByConsultantId(consultantId);
    }

    // Hoặc trả về cả 2 thông tin trong một DTO
    public ConsultantRatingSummary getRatingSummaryForConsultant(Long consultantId) {
        Double averageRating = feedbackRepository.calculateAverageRatingByConsultantId(consultantId);
        Long feedbackCount = feedbackRepository.countFeedbacksByConsultantId(consultantId);

        return new ConsultantRatingSummary(
                consultantId,
                averageRating != null ? averageRating : 0.0,
                feedbackCount
        );
    }
}
