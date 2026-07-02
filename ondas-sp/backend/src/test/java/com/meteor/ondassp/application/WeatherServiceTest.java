package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.weather.WeatherData;
import com.meteor.ondassp.domain.weather.WeatherDataRepository;
import com.meteor.ondassp.infrastructure.api.OpenMeteoClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WeatherServiceTest {

    private OpenMeteoClient openMeteoClient;
    private WeatherDataRepository weatherDataRepository;
    private WeatherService weatherService;

    @BeforeEach
    void setUp() {
        openMeteoClient = mock(OpenMeteoClient.class);
        weatherDataRepository = mock(WeatherDataRepository.class);
        weatherService = new WeatherService(openMeteoClient, weatherDataRepository);
    }

    @Test
    void shouldSyncWeatherDataAndPersist() {
        LocalDate today = LocalDate.now();
        OpenMeteoClient.DailyForecast forecast = new OpenMeteoClient.DailyForecast(
                today.toString(),
                BigDecimal.valueOf(30), BigDecimal.valueOf(22), BigDecimal.valueOf(26),
                BigDecimal.ZERO, BigDecimal.valueOf(12), BigDecimal.valueOf(180),
                BigDecimal.valueOf(20), BigDecimal.valueOf(75), BigDecimal.valueOf(6), 2.0
        );

        when(openMeteoClient.getDailyForecast(any())).thenReturn(List.of(forecast));
        when(weatherDataRepository.findTopByForecastDateOrderByFetchedAtDesc(today))
                .thenReturn(Optional.empty());
        when(weatherDataRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        weatherService.syncWeatherData();

        verify(weatherDataRepository, times(1)).save(any(WeatherData.class));
    }

    @Test
    void shouldSkipSyncWhenDataIsFresh() {
        LocalDate today = LocalDate.now();
        WeatherData freshData = new WeatherData(today, Instant.now());

        OpenMeteoClient.DailyForecast forecast = new OpenMeteoClient.DailyForecast(
                today.toString(),
                BigDecimal.valueOf(30), BigDecimal.valueOf(22), BigDecimal.valueOf(26),
                BigDecimal.ZERO, BigDecimal.valueOf(12), BigDecimal.valueOf(180),
                BigDecimal.valueOf(20), BigDecimal.valueOf(75), BigDecimal.valueOf(6), 2.0
        );

        when(openMeteoClient.getDailyForecast(any())).thenReturn(List.of(forecast));
        when(weatherDataRepository.findTopByForecastDateOrderByFetchedAtDesc(today))
                .thenReturn(Optional.of(freshData));

        weatherService.syncWeatherData();

        // Data is fresh (< 30 min) so should NOT be saved again
        verify(weatherDataRepository, never()).save(any());
    }

    @Test
    void shouldHandleEmptyForecastList() {
        when(openMeteoClient.getDailyForecast(any())).thenReturn(List.of());

        assertDoesNotThrow(() -> weatherService.syncWeatherData());
        verify(weatherDataRepository, never()).save(any());
    }

    @Test
    void shouldGetCurrentWeather() {
        LocalDate today = LocalDate.now();
        WeatherData data = new WeatherData(today, Instant.now());
        when(weatherDataRepository.findTopByForecastDateOrderByFetchedAtDesc(today))
                .thenReturn(Optional.of(data));

        Optional<WeatherData> result = weatherService.getCurrentWeather();

        assertTrue(result.isPresent());
        assertEquals(today, result.get().getForecastDate());
    }

    @Test
    void shouldReturnEmptyWhenNoCurrentWeather() {
        when(weatherDataRepository.findTopByForecastDateOrderByFetchedAtDesc(any()))
                .thenReturn(Optional.empty());

        Optional<WeatherData> result = weatherService.getCurrentWeather();

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldGetHourlyWeather() {
        LocalDate date = LocalDate.of(2025, 7, 1);
        WeatherData d1 = new WeatherData(date, Instant.now());
        WeatherData d2 = new WeatherData(date, Instant.now());

        when(weatherDataRepository.findByForecastDateOrderByFetchedAtAsc(date))
                .thenReturn(List.of(d1, d2));

        List<WeatherData> result = weatherService.getHourlyWeather(date);

        assertEquals(2, result.size());
    }
}
