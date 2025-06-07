package org.example.gender_healthcare_stem.dto;

import java.time.LocalDate;

public record CycleHistoryDTO(
        LocalDate startDate,
        Integer periodDays,
        Integer cycleDays
) {}

