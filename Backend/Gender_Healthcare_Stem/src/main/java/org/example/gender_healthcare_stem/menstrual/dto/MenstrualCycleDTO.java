package org.example.gender_healthcare_stem.menstrual.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MenstrualCycleDTO {
    private LocalDate cycleDate;
    private Boolean hasPeriod;
    private Integer flowLevel;
    private Integer painLevel;
    private Integer moodLevel;
    private String habit;
    private String dischargeType;
    private BigDecimal weight;
    private BigDecimal temperature;
    private String note;

    // Getters and Setters

    public LocalDate getCycleDate() {
        return cycleDate;
    }

    public void setCycleDate(LocalDate cycleDate) {
        this.cycleDate = cycleDate;
    }

    public Boolean getHasPeriod() {
        return hasPeriod;
    }

    public void setHasPeriod(Boolean hasPeriod) {
        this.hasPeriod = hasPeriod;
    }

    public Integer getFlowLevel() {
        return flowLevel;
    }

    public void setFlowLevel(Integer flowLevel) {
        this.flowLevel = flowLevel;
    }

    public Integer getPainLevel() {
        return painLevel;
    }

    public void setPainLevel(Integer painLevel) {
        this.painLevel = painLevel;
    }

    public Integer getMoodLevel() {
        return moodLevel;
    }

    public void setMoodLevel(Integer moodLevel) {
        this.moodLevel = moodLevel;
    }

    public String getHabit() {
        return habit;
    }

    public void setHabit(String habit) {
        this.habit = habit;
    }

    public String getDischargeType() {
        return dischargeType;
    }

    public void setDischargeType(String dischargeType) {
        this.dischargeType = dischargeType;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public BigDecimal getTemperature() {
        return temperature;
    }

    public void setTemperature(BigDecimal temperature) {
        this.temperature = temperature;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
