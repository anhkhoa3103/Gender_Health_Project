package org.example.gender_healthcare_stem.adminconsultant.dto;

import java.time.LocalDateTime;

public class ConsultationAppointmentDto {
    private Integer consultationId;
    private Integer consultantId;
    private Integer customerId;
    private LocalDateTime appointmentDate;
    private String status;
    private Integer workslotId;
    private String consultantName;
    private String customerName;
    private String googleMeetLink;
    private String slotDescription;

    // Constructors
    public ConsultationAppointmentDto() {}

    public ConsultationAppointmentDto(Integer consultationId, Integer consultantId,
                                      Integer customerId, LocalDateTime appointmentDate,
                                      String status, Integer workslotId) {
        this.consultationId = consultationId;
        this.consultantId = consultantId;
        this.customerId = customerId;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.workslotId = workslotId;
    }

    // Getters and Setters
    public Integer getConsultationId() { return consultationId; }
    public void setConsultationId(Integer consultationId) { this.consultationId = consultationId; }

    public Integer getConsultantId() { return consultantId; }
    public void setConsultantId(Integer consultantId) { this.consultantId = consultantId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getWorkslotId() { return workslotId; }
    public void setWorkslotId(Integer workslotId) { this.workslotId = workslotId; }

    public String getConsultantName() { return consultantName; }
    public void setConsultantName(String consultantName) { this.consultantName = consultantName; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getGoogleMeetLink() { return googleMeetLink; }
    public void setGoogleMeetLink(String googleMeetLink) { this.googleMeetLink = googleMeetLink; }

    public String getSlotDescription() { return slotDescription; }
    public void setSlotDescription(String slotDescription) { this.slotDescription = slotDescription; }
}