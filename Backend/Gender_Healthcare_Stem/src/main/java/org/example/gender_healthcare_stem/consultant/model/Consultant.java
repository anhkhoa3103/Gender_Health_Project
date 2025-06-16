package org.example.gender_healthcare_stem.consultant.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Consultant")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Consultant {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private org.example.gender_healthcare_stem.auth.model.User user;


    @Column(name = "specialization")
    private String specialization;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "experienced_years")
    private Integer experiencedYears;

    @Column(name = "google_meet_links")
    private String googleMeetLinks;

    // Constructors
    public Consultant() {}

    // Getters and setters
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }
    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperiencedYears() {
        return experiencedYears;
    }
    public void setExperiencedYears(Integer experiencedYears) {
        this.experiencedYears = experiencedYears;
    }

    public String getGoogleMeetLinks() {
        return googleMeetLinks;
    }
    public void setGoogleMeetLinks(String googleMeetLinks) {
        this.googleMeetLinks = googleMeetLinks;
    }
}

