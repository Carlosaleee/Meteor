package com.meteor.ondassp.domain.spot;

/**
 * Represents a surf spot in or near Ilha Comprida, SP.
 * This is a value object — not persisted in the database.
 */
public record Spot(
        String id,
        String name,
        String description,
        double latitude,
        double longitude,
        String difficulty,
        String waveType,
        String bestSeason,
        String tip,
        String region
) {}
