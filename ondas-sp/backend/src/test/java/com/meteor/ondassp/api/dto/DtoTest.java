package com.meteor.ondassp.api.dto;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class DtoTest {

    @Test
    void weatherResponseRecord() {
        WeatherResponse response = new WeatherResponse(
                1L, LocalDate.now(), java.time.Instant.now(),
                BigDecimal.valueOf(30), BigDecimal.valueOf(22), BigDecimal.valueOf(26),
                BigDecimal.ZERO, BigDecimal.valueOf(15), BigDecimal.valueOf(180),
                BigDecimal.valueOf(20), BigDecimal.valueOf(75), BigDecimal.valueOf(6),
                "2"
        );

        assertEquals(1L, response.id());
        assertEquals(BigDecimal.valueOf(30), response.temperatureMax());
        assertEquals("2", response.weatherCode());
    }

    @Test
    void waveResponseRecord() {
        WaveResponse response = new WaveResponse(
                1L, LocalDate.now(), LocalTime.NOON, java.time.Instant.now(),
                BigDecimal.valueOf(1.5), BigDecimal.valueOf(10), BigDecimal.valueOf(180),
                BigDecimal.valueOf(1.2), BigDecimal.valueOf(9), BigDecimal.valueOf(180),
                BigDecimal.valueOf(0.5), BigDecimal.valueOf(4)
        );

        assertEquals(1L, response.id());
        assertEquals(BigDecimal.valueOf(1.5), response.waveHeight());
        assertEquals(LocalTime.NOON, response.forecastTime());
    }

    @Test
    void surfScoreResponseRecord() {
        SurfScoreResponse response = new SurfScoreResponse(
                LocalDate.now(), LocalTime.NOON,
                BigDecimal.valueOf(7.5), "Bom", "Boas condições"
        );

        assertEquals(BigDecimal.valueOf(7.5), response.score());
        assertEquals("Bom", response.level());
    }

    @Test
    void surfSummaryResponseRecord() {
        SurfSummaryResponse response = new SurfSummaryResponse(
                LocalDate.now(), "Clima ok", "Ondas boas", "Resumo completo", "14:00"
        );

        assertEquals("Clima ok", response.weatherSummary());
        assertEquals("14:00", response.bestTimeToSurf());
    }

    @Test
    void spotResponseRecord() {
        SpotResponse response = new SpotResponse(
                "pedrinhas", "Pedrinhas", "Descrição",
                -24.9, -47.7, "Intermediário", "Quebra de praia",
                "Março–Outubro", "Dica", "Ilha Comprida"
        );

        assertEquals("pedrinhas", response.id());
        assertEquals(-24.9, response.latitude());
    }
}
