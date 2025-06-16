package org.example.gender_healthcare_stem.consultant.dto;

public class ConsultantDTO {
    private Integer userId;
    private String avatar;
    private String fullName; // lấy từ User.avatar
    private String specialization;
    private String qualification;
    private Integer experiencedYears;
    private String googleMeetLinks;

    public ConsultantDTO(Integer userId, String fullName, String avatar, String specialization,
                         String qualification, Integer experiencedYears, String googleMeetLinks) {
        this.userId = userId;
        this.fullName = fullName;
        this.avatar = avatar;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experiencedYears = experiencedYears;
        this.googleMeetLinks = googleMeetLinks;
    }

    // getters/setters cho name
    public String getFullName() { return fullName; }
    public void setFullName(String name) { this.fullName = name; }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    // Getters và setters
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

