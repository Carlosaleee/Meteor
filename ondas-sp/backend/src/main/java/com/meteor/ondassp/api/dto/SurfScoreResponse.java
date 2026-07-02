package com.meteor.ondassp.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record SurfScoreResponse(
        LocalDate date,
        LocalTime bestTime,
        BigDecimal score,
        String level,
        String recommendation
) {}
