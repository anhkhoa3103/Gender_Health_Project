package org.example.gender_healthcare_stem.consultation.service;

import org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackDTO;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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


    public List<FeedbackDTO> getDTOByConsultantId(Long consultantId) {
        return feedbackRepository.findByConsultantId(consultantId)
                .stream()
                .map(fb -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setFeedbackId(fb.getFeedbackId());
                    dto.setRating(fb.getRating());
                    dto.setComment(fb.getComment());
                    dto.setCreatedAt(fb.getCreatedAt());

                    // Truy cập user name thủ công, nhưng cẩn thận với LAZY
                    if (fb.getCustomer() != null && fb.getCustomer().getUser() != null) {
                        dto.setCustomerName(fb.getCustomer().getUser().getFullName());
                    } else {
                        dto.setCustomerName("Ẩn danh");
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ConsultantRatingSummary getRatingSummaryByConsultantId(Long consultantId) {
        List<Feedback> feedbacks = feedbackRepository.findByConsultantId(consultantId);

        if (feedbacks.isEmpty()) {
            return new ConsultantRatingSummary(consultantId, 0.0, 0L);
        }

        double avg = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        long count = feedbacks.size();

        return new ConsultantRatingSummary(consultantId, Math.round(avg * 10.0) / 10.0, count); // Làm tròn 1 chữ số
    }


}
