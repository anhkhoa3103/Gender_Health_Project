package org.example.gender_healthcare_stem.auth.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String fullName;
    private String email;
    private String phone;
    private String status; // ACTIVE / INACTIVE
    private String role;   // ADMIN / STAFF / CONSULTANT / CUSTOMER
}
