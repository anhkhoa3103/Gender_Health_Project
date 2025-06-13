package org.example.gender_healthcare_stem.consultation.controller;

import org.example.gender_healthcare_stem.consultation.dto.ConsultantRatingSummary;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackDTO;
import org.example.gender_healthcare_stem.consultation.dto.FeedbackWithUserDTO;
import org.example.gender_healthcare_stem.consultation.model.Feedback;
import org.example.gender_healthcare_stem.consultation.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Validated
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackService.createFeedback(feedbackDTO);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByConsultant(@PathVariable Long consultantId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByConsultant(consultantId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByCustomer(@PathVariable Long customerId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByCustomer(customerId);
        return ResponseEntity.ok(feedbacks);
    }

    // New endpoints with user names
    @GetMapping("/with-names")
    public ResponseEntity<List<FeedbackWithUserDTO>> getAllFeedbackWithUserNames() {
        List<FeedbackWithUserDTO> feedbacks = feedbackService.getAllFeedbackWithUserNames();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/consultant/{consultantId}/with-names")
    public ResponseEntity<List<FeedbackWithUserDTO>> getFeedbacksByConsultantWithUserNames(@PathVariable Long consultantId) {
        List<FeedbackWithUserDTO> feedbacks = feedbackService.getFeedbacksByConsultantWithUserNames(consultantId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/customer/{customerId}/with-names")
    public ResponseEntity<List<FeedbackWithUserDTO>> getFeedbacksByCustomerWithUserNames(@PathVariable Long customerId) {
        List<FeedbackWithUserDTO> feedbacks = feedbackService.getFeedbacksByCustomerWithUserNames(customerId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/test")
    public String test() {
        return "FeedbackController is working";
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId, @RequestParam Long customerId) {
        boolean deleted = feedbackService.deleteFeedback(feedbackId, customerId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/consultant/{consultantId}/rating-summary")
    public ResponseEntity<ConsultantRatingSummary> getConsultantRatingSummary(
            @PathVariable Long consultantId) {
        ConsultantRatingSummary summary = feedbackService.getRatingSummaryForConsultant(consultantId);
        return ResponseEntity.ok(summary);
    }

    // Hoặc các endpoint riêng lẻ
    @GetMapping("/consultant/{consultantId}/average-rating")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long consultantId) {
        Double rating = feedbackService.getAverageRatingForConsultant(consultantId);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/consultant/{consultantId}/feedback-count")
    public ResponseEntity<Long> getFeedbackCount(
            @PathVariable Long consultantId) {
        Long count = feedbackService.getFeedbackCountForConsultant(consultantId);
        return ResponseEntity.ok(count);
    }
}
