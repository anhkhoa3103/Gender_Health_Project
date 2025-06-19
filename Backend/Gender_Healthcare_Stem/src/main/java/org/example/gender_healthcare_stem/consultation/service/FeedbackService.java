package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    // Gửi feedback mới
    public Feedback submitFeedback(Feedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    // Lấy tất cả feedback theo tư vấn viên
    public List<Feedback> getByConsultantId(Long consultantId) {
        return feedbackRepository.findByConsultantId(consultantId);
    }

    // (Tùy chọn) Lấy tất cả feedback theo khách hàng
    public List<Feedback> getByCustomerId(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId);
    }

    public Optional<Feedback> getByConsultationId(Long consultationId) {
        return feedbackRepository.findByConsultationId(consultationId);
    }

}
