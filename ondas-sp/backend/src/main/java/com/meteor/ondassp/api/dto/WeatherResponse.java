package com.meteor.ondassp.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;

public record WeatherResponse(
        Long id,
        LocalDate forecastDate,
        Instant fetchedAt,
        BigDecimal temperatureMax,
        BigDecimal temperatureMin,
        BigDecimal temperatureMean,
        BigDecimal precipitationSum,
        BigDecimal windSpeedMax,
        BigDecimal windDirection,
        BigDecimal cloudCover,
        BigDecimal humidity,
        BigDecimal uvIndex,
        String weatherCode
) {}
