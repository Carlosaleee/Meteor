package com.meteor.ondassp.api.dto;

/**
 * DTO for surf spot data returned to the client.
 */
public record SpotResponse(
        String id,
        String name,
        String description,
        double latitude,
        double longitude,
        String difficulty,
        String waveType
) {}
