package com.meteor.ondassp.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.time.LocalTime;

public record WaveResponse(
        Long id,
        LocalDate forecastDate,
        LocalTime forecastTime,
        Instant fetchedAt,
        BigDecimal waveHeight,
        BigDecimal wavePeriod,
        BigDecimal waveDirection,
        BigDecimal swellHeight,
        BigDecimal swellPeriod,
        BigDecimal swellDirection,
        BigDecimal windWaveHeight,
        BigDecimal windWavePeriod
) {}
