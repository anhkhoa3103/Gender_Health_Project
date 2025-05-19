package org.example.genderhealthsystem.dto;

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
