// src/main/java/org/example/gender_healthcare_stem/auth/dto/CustomerUserDTO.java
package org.example.gender_healthcare_stem.testing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerUserDTO {
    private Long customerId;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String role;
    private String status;
    private LocalDateTime createdAt;
    private String avatar;
}
