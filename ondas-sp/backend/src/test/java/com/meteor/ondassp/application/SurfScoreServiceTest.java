package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.surf.SurfScore;
import com.meteor.ondassp.domain.surf.SurfSummary;
import com.meteor.ondassp.domain.weather.WeatherData;
import com.meteor.ondassp.domain.wave.WaveData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SurfScoreServiceTest {

    private WeatherService weatherService;
    private MarineService marineService;
    private SurfScoreService surfScoreService;

    @BeforeEach
    void setUp() {
        weatherService = mock(WeatherService.class);
        marineService = mock(MarineService.class);
        surfScoreService = new SurfScoreService(weatherService, marineService);
    }

    @Test
    void shouldCalculateScoreWithNoData() {
        when(weatherService.getCurrentWeather()).thenReturn(Optional.empty());
        when(marineService.getHourlyWaves(any())).thenReturn(List.of());

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertEquals(BigDecimal.ZERO, score.score());
        assertEquals("Sem dados", score.level());
    }

    @Test
    void shouldCalculateScoreWithGoodConditions() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setTemperatureMean(BigDecimal.valueOf(25));
        weather.setWindSpeedMax(BigDecimal.valueOf(10));
        weather.setPrecipitationSum(BigDecimal.ZERO);

        WaveData wave = new WaveData(LocalDate.now(), LocalTime.of(12, 0), Instant.now());
        wave.setWaveHeight(BigDecimal.valueOf(1.5));
        wave.setWavePeriod(BigDecimal.valueOf(10));
        wave.setSwellHeight(BigDecimal.valueOf(1.2));
        wave.setSwellPeriod(BigDecimal.valueOf(10));

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(weather));
        when(marineService.getHourlyWaves(any())).thenReturn(List.of(wave));

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertNotNull(score.score());
        assertTrue(score.score().compareTo(BigDecimal.valueOf(5)) > 0);
        assertNotNull(score.level());
        assertNotNull(score.recommendation());
    }

    @Test
    void shouldGenerateSummary() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setTemperatureMean(BigDecimal.valueOf(26));
        weather.setWindSpeedMax(BigDecimal.valueOf(12));
        weather.setPrecipitationSum(BigDecimal.ZERO);

        WaveData wave = new WaveData(LocalDate.now(), LocalTime.of(14, 0), Instant.now());
        wave.setWaveHeight(BigDecimal.valueOf(1.8));
        wave.setWavePeriod(BigDecimal.valueOf(11));
        wave.setSwellHeight(BigDecimal.valueOf(1.5));
        wave.setSwellPeriod(BigDecimal.valueOf(9));

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(weather));
        when(marineService.getHourlyWaves(any())).thenReturn(List.of(wave));

        SurfSummary summary = surfScoreService.generateSummary(LocalDate.now());

        assertNotNull(summary.fullSummary());
        assertTrue(summary.fullSummary().contains("Resumo para"));
        assertNotNull(summary.weatherSummary());
        assertNotNull(summary.waveSummary());
        assertNotNull(summary.bestTimeToSurf());
    }
}
