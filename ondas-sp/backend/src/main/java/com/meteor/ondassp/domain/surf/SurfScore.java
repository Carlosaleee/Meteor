package com.meteor.ondassp.domain.surf;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record SurfScore(
        LocalDate date,
        LocalTime bestTime,
        BigDecimal score,
        String level,
        String recommendation
) {}
