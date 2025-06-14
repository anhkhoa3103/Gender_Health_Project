package org.example.gender_healthcare_stem.testing.model;

import jakarta.persistence.*;
import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.model.User;

import java.math.BigDecimal;


@Entity
@Table(name = "stiappointment")
public class STIAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @MapsId
    @JoinColumn(name = "staff_id") // references User.id
    private User staff;

    @Column(name = "status", nullable = false)
    private String status; // "pending", "completed", etc. — could use enum wrapper

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    // Getters and Setters

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public User getStaff() {
        return staff;
    }

    public void setStaff(User staff) {
        this.staff = staff;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}

