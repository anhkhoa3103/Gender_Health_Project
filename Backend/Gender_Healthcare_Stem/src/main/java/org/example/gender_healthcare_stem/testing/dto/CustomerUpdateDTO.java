package org.example.gender_healthcare_stem.testing.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerUpdateDTO {
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String avatar; // a string URL/path
}