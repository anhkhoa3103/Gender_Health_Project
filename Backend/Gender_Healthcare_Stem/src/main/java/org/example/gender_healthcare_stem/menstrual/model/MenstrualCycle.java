package org.example.gender_healthcare_stem.menstrual.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MenstrualCycle")
@Getter
@Setter
public class MenstrualCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "cycle_date")
    private LocalDate cycleDate;

    @Column(name = "has_period")
    private Boolean hasPeriod;

    @Column(name = "flow_level")
    private Integer flowLevel;

    @Column(name = "pain_level")
    private Integer painLevel;

    @Column(name = "mood_level")
    private Integer moodLevel;

    @Column(name = "habit")
    private String habit;

    @Column(name = "discharge_type")
    private String dischargeType;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "temperature")
    private BigDecimal temperature;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

