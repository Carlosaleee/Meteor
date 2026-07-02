package com.meteor.ondassp.api.dto;

import java.time.LocalDate;

public record SurfSummaryResponse(
        LocalDate date,
        String weatherSummary,
        String waveSummary,
        String fullSummary,
        String bestTimeToSurf
) {}
