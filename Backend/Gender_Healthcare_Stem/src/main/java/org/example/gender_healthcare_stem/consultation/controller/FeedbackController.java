package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackDTO;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.example.gender_healthcare_stem.consultation.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FeedbackController {

    @Autowired
    private final FeedbackRepository feedbackRepository;
    private final FeedbackService feedbackService;


    public FeedbackController(FeedbackRepository feedbackRepository, FeedbackService feedbackService) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        Feedback saved = feedbackService.submitFeedback(feedback);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<List<Feedback>> getByConsultant(@PathVariable Long consultantId) {
        return ResponseEntity.ok(feedbackService.getByConsultantId(consultantId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Feedback>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.getByCustomerId(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestBody Feedback updatedFeedback) {
        return feedbackRepository.findById(id)
                .map(existing -> {
                    existing.setRating(updatedFeedback.getRating());
                    existing.setComment(updatedFeedback.getComment());
                    Feedback saved = feedbackRepository.save(existing);

                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setFeedbackId(saved.getFeedbackId());
                    dto.setRating(saved.getRating());
                    dto.setComment(saved.getComment());
                    dto.setCreatedAt(saved.getCreatedAt());

                    if (saved.getCustomer() != null && saved.getCustomer().getUser() != null) {
                        dto.setCustomerName(saved.getCustomer().getUser().getFullName());
                    } else {
                        dto.setCustomerName("Ẩn danh");
                    }

                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<?> getFeedbackByConsultationId(@PathVariable Long consultationId) {
        return feedbackService.getByConsultationId(consultationId)
                .map(fb -> {
                    FeedbackDTO dto = new FeedbackDTO();
                    dto.setFeedbackId(fb.getFeedbackId());
                    dto.setRating(fb.getRating());
                    dto.setComment(fb.getComment());
                    dto.setCreatedAt(fb.getCreatedAt());

                    if (fb.getCustomer() != null && fb.getCustomer().getUser() != null) {
                        dto.setCustomerName(fb.getCustomer().getUser().getFullName());
                    } else {
                        dto.setCustomerName("Ẩn danh");
                    }

                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/rating-summary/{consultantId}")
    public ResponseEntity<ConsultantRatingSummary> getRatingSummary(@PathVariable Long consultantId) {
        ConsultantRatingSummary summary = feedbackService.getRatingSummaryByConsultantId(consultantId);
        return ResponseEntity.ok(summary);
    }


}
