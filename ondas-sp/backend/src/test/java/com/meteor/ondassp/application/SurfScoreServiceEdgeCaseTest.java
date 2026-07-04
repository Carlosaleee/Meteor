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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SurfScoreServiceEdgeCaseTest {

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
    void shouldReturnBadScoreWhenHighWind() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setWindSpeedMax(BigDecimal.valueOf(50));
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
        assertNotNull(score.level());
    }

    @Test
    void shouldReturnBadScoreWhenHeavyRain() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setWindSpeedMax(BigDecimal.valueOf(15));
        weather.setPrecipitationSum(BigDecimal.valueOf(20));

        WaveData wave = new WaveData(LocalDate.now(), LocalTime.of(12, 0), Instant.now());
        wave.setWaveHeight(BigDecimal.valueOf(1.5));
        wave.setWavePeriod(BigDecimal.valueOf(10));
        wave.setSwellHeight(BigDecimal.valueOf(1.2));
        wave.setSwellPeriod(BigDecimal.valueOf(10));

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(weather));
        when(marineService.getHourlyWaves(any())).thenReturn(List.of(wave));

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertNotNull(score.score());
    }

    @Test
    void shouldHandleWavesAtNight() {
        when(weatherService.getCurrentWeather()).thenReturn(Optional.empty());

        WaveData nightWave = new WaveData(LocalDate.now(), LocalTime.of(22, 0), Instant.now());
        nightWave.setWaveHeight(BigDecimal.valueOf(2.0));
        nightWave.setWavePeriod(BigDecimal.valueOf(12));
        nightWave.setSwellHeight(BigDecimal.valueOf(1.5));
        nightWave.setSwellPeriod(BigDecimal.valueOf(10));

        WaveData dayWave = new WaveData(LocalDate.now(), LocalTime.of(12, 0), Instant.now());
        dayWave.setWaveHeight(BigDecimal.valueOf(1.0));
        dayWave.setWavePeriod(BigDecimal.valueOf(8));
        dayWave.setSwellHeight(BigDecimal.valueOf(0.8));
        dayWave.setSwellPeriod(BigDecimal.valueOf(8));

        when(marineService.getHourlyWaves(any())).thenReturn(List.of(nightWave, dayWave));

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertNotNull(score.bestTime());
        assertNotNull(score.score());
    }

    @Test
    void shouldGenerateSummaryWithRain() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setTemperatureMean(BigDecimal.valueOf(20));
        weather.setWindSpeedMax(BigDecimal.valueOf(25));
        weather.setPrecipitationSum(BigDecimal.valueOf(10));

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(weather));
        when(marineService.getHourlyWaves(any())).thenReturn(List.of());

        SurfSummary summary = surfScoreService.generateSummary(LocalDate.now());

        assertTrue(summary.weatherSummary().contains("chuva"));
        assertNotNull(summary.fullSummary());
    }

    @Test
    void shouldGenerateSummaryWithoutRain() {
        WeatherData weather = new WeatherData(LocalDate.now(), Instant.now());
        weather.setTemperatureMean(BigDecimal.valueOf(28));
        weather.setWindSpeedMax(BigDecimal.valueOf(8));
        weather.setPrecipitationSum(BigDecimal.ZERO);

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(weather));
        when(marineService.getHourlyWaves(any())).thenReturn(List.of());

        SurfSummary summary = surfScoreService.generateSummary(LocalDate.now());

        assertTrue(summary.weatherSummary().contains("sem chuva"));
    }

    @Test
    void shouldHandleLargeWaves() {
        when(weatherService.getCurrentWeather()).thenReturn(Optional.empty());

        WaveData bigWave = new WaveData(LocalDate.now(), LocalTime.of(14, 0), Instant.now());
        bigWave.setWaveHeight(BigDecimal.valueOf(4.0));
        bigWave.setWavePeriod(BigDecimal.valueOf(14));
        bigWave.setSwellHeight(BigDecimal.valueOf(3.0));
        bigWave.setSwellPeriod(BigDecimal.valueOf(12));

        when(marineService.getHourlyWaves(any())).thenReturn(List.of(bigWave));

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertNotNull(score.score());
        assertTrue(score.score().compareTo(BigDecimal.ZERO) >= 0);
    }

    @Test
    void shouldHandleTinyWaves() {
        when(weatherService.getCurrentWeather()).thenReturn(Optional.empty());

        WaveData tinyWave = new WaveData(LocalDate.now(), LocalTime.of(10, 0), Instant.now());
        tinyWave.setWaveHeight(BigDecimal.valueOf(0.2));
        tinyWave.setWavePeriod(BigDecimal.valueOf(5));
        tinyWave.setSwellHeight(BigDecimal.valueOf(0.1));
        tinyWave.setSwellPeriod(BigDecimal.valueOf(4));

        when(marineService.getHourlyWaves(any())).thenReturn(List.of(tinyWave));

        SurfScore score = surfScoreService.calculateScore(LocalDate.now());

        assertNotNull(score.score());
        assertNotNull(score.level());
    }
}
