package org.example.genderhealthsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    private String phone;

    private String role;    // customer, consultant, admin...

    private String status;  // active, blocked, inactive

    private String createdAt;

    private String avatar;  // <--- bổ sung ở đây
}
