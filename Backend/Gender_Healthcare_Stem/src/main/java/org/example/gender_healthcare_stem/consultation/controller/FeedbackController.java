package org.example.gender_healthcare_stem.consultation.controller;

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
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback updatedFeedback) {
        return feedbackRepository.findById(id)
                .map(existing -> {
                    existing.setRating(updatedFeedback.getRating());
                    existing.setComment(updatedFeedback.getComment());
                    Feedback saved = feedbackRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<?> getFeedbackByConsultationId(@PathVariable Long consultationId) {
        return feedbackService.getByConsultationId(consultationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
