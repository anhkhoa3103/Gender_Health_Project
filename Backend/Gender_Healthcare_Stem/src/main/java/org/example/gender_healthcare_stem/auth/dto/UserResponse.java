package org.example.gender_healthcare_stem.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String createdAt;
    private String avatar;
}
