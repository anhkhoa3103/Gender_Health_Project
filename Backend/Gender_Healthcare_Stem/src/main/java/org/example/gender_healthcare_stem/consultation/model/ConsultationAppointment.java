package org.example.gender_healthcare_stem.consultation.model;

import jakarta.persistence.*;
import lombok.Data;
import org.example.gender_healthcare_stem.consultant.model.Consultant;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "consultationappointment")
public class ConsultationAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long consultationId;
    @Column(name = "consultant_id")
    private Long consultantId;  // sửa từ String thành Long
    private Long customerId;    // sửa từ String thành Long
    private LocalDate appointmentDate;
    private String status;
    private Long workslotId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private Consultant consultant;

    @Column(length = 100)
    private String name;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    public Consultant getConsultant() {
        return consultant;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
