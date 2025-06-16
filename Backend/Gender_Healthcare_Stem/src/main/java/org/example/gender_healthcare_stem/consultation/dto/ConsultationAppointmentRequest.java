package org.example.gender_healthcare_stem.consultation.dto;

import java.time.LocalDate;

public class ConsultationAppointmentRequest {
    private Long consultantId;
    private Long customerId;
    private LocalDate appointmentDate;
    private Long workslotId;
    private String name;
    private String phoneNumber;
    private String note;

    public Long getConsultantId() {
        return consultantId;
    }

    public void setConsultantId(Long consultantId) {
        this.consultantId = consultantId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public Long getWorkslotId() {
        return workslotId;
    }

    public void setWorkslotId(Long workslotId) {
        this.workslotId = workslotId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

