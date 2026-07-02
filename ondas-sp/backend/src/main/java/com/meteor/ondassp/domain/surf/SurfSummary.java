package com.meteor.ondassp.domain.surf;

import java.time.LocalDate;

public record SurfSummary(
        LocalDate date,
        String weatherSummary,
        String waveSummary,
        String fullSummary,
        String bestTimeToSurf
) {}
