package org.example.gender_healthcare_stem.admin.controller;

import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.admin.dto.AdminFeedbackDTO;
import org.example.gender_healthcare_stem.auth.dto.UserRequest;
import org.example.gender_healthcare_stem.auth.dto.UserResponse;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.consultation.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<UserResponse> result = userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getStatus(),
                        user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : null,
                        user.getAvatar()
                )).toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody UserRequest req) {
        User user = userRepository.findById(id).orElseThrow();

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(req.getRole().toUpperCase());
        user.setStatus(req.getStatus().toUpperCase());

        userRepository.save(user);
        return ResponseEntity.ok("Updated successfully");
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/feedbacks")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllFeedbacks() {
        try {
            List<AdminFeedbackDTO> list = feedbackRepository.getAdminFeedbacks();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();  // 🔍 in ra lỗi chi tiết
            return ResponseEntity.status(500).body("Error loading feedbacks: " + e.getMessage());
        }
    }


}