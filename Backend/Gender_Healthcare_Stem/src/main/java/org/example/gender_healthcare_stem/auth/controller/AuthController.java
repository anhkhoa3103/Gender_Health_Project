package org.example.gender_healthcare_stem.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.gender_healthcare_stem.auth.dto.*;
import org.example.gender_healthcare_stem.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @PostMapping("/login/management")
    public ResponseEntity<?> loginManagement(@RequestBody LoginRequest req) {
        LoginResponse resp = authService.login(req);

        // Chỉ cho phép các role thuộc nhóm quản lý
        if (!List.of("ADMIN", "STAFF", "CONSULTANT").contains(resp.getRole().toUpperCase())) {
            return ResponseEntity.status(403).body("Bạn không có quyền truy cập khu vực quản lý.");
        }

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout/management")
    public ResponseEntity<?> logoutManagement(HttpServletRequest request) {
        // Invalidate session nếu có
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        // Nếu có sử dụng token blacklist thì thêm vào đây (tùy project)
        return ResponseEntity.ok("Logout for management successful");
    }


}
