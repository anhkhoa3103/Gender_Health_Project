package org.example.gender_healthcare_stem.auth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    /* dùng cùng PK với Users */
    @Id
    @Column(name = "customer_id")
    private Long id;

    @OneToOne
    @MapsId                 // <─ trùng id với User
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private User user;

    private String gender;
    private LocalDate dateOfBirth;
    private String address;


    public Long getCustomerId() {
        return this.id;
    }

}

