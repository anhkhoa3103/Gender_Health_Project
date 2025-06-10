package org.example.gender_healthcare_stem.dto;

import java.time.LocalDate;
import java.util.Date;

public record CycleHistoryDTO(
        Date startDate,
        Integer periodDays,
        Integer cycleDays
) {}

