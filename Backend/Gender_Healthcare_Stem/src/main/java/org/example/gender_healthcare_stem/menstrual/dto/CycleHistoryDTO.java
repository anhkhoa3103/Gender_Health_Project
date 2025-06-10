package org.example.gender_healthcare_stem.menstrual.dto;

import java.util.Date;

public record CycleHistoryDTO(
        Date startDate,
        Integer periodDays,
        Integer cycleDays
) {}

