package org.example.gender_healthcare_stem.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String role;
    private String token;
    private String fullName;
    private String phoneNumber;
    private String email;        // ✅ thêm
    private String avatar;       // ✅ thêm
}

