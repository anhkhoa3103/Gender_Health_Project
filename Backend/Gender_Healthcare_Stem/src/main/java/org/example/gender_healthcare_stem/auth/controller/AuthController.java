package org.example.gender_healthcare_stem.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.gender_healthcare_stem.auth.dto.*;
import org.example.gender_healthcare_stem.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<LoginResponse> google(@RequestBody GoogleTokenDTO dto) {
        return ResponseEntity.ok(authService.handleGoogleLogin(dto.getToken()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return ResponseEntity.ok(authService.sendResetLink(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Nếu có session, invalidate nó
        request.getSession(false).invalidate();

        // Hoặc thêm token vào blacklist nếu bạn có triển khai

        return ResponseEntity.ok("Logout successful");
    }


}
