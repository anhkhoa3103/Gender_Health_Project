package org.example.gender_healthcare_stem.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role;
    private String avatar;  // <--- thêm avatar
}
