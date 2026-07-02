package com.meteor.ondassp.domain.spot;

/**
 * Represents a surf spot in or near Ilha Comprida, SP.
 * This is a value object — not persisted in the database.
 *
 * @param id          Unique identifier
 * @param name        Name of the surf spot
 * @param description Short description
 * @param latitude    Geographic latitude
 * @param longitude   Geographic longitude
 * @param difficulty  Beginner / Intermediate / Advanced
 * @param waveType    Type of waves (beach break, point break, etc.)
 */
public record Spot(
        String id,
        String name,
        String description,
        double latitude,
        double longitude,
        String difficulty,
        String waveType
) {}
