package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.wave.WaveData;
import com.meteor.ondassp.domain.wave.WaveDataRepository;
import com.meteor.ondassp.infrastructure.api.StormglassClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MarineServiceTest {

    private StormglassClient stormglassClient;
    private WaveDataRepository waveDataRepository;
    private MarineService marineService;

    @BeforeEach
    void setUp() {
        stormglassClient = mock(StormglassClient.class);
        waveDataRepository = mock(WaveDataRepository.class);
        marineService = new MarineService(stormglassClient, waveDataRepository);
    }

    @Test
    void shouldSyncWaveDataAndPersistAll() {
        LocalDate today = LocalDate.now();
        StormglassClient.WaveForecast fc1 = buildForecast(today, LocalTime.of(6, 0), 1.5);
        StormglassClient.WaveForecast fc2 = buildForecast(today, LocalTime.of(12, 0), 1.8);
        StormglassClient.WaveForecast fc3 = buildForecast(today, LocalTime.of(18, 0), 1.2);

        when(stormglassClient.getWaveForecast(any())).thenReturn(List.of(fc1, fc2, fc3));
        when(waveDataRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        marineService.syncWaveData();

        verify(waveDataRepository, times(3)).save(any(WaveData.class));
    }

    @Test
    void shouldHandleEmptyWaveForecast() {
        when(stormglassClient.getWaveForecast(any())).thenReturn(List.of());

        assertDoesNotThrow(() -> marineService.syncWaveData());
        verify(waveDataRepository, never()).save(any());
    }

    @Test
    void shouldGetCurrentWavesWhenDataExists() {
        LocalDate today = LocalDate.now();
        WaveData d1 = new WaveData(today, LocalTime.of(8, 0), Instant.now());
        d1.setWaveHeight(BigDecimal.valueOf(1.5));

        when(waveDataRepository.findByForecastDateOrderByForecastTimeAsc(today))
                .thenReturn(List.of(d1));

        List<WaveData> result = marineService.getCurrentWaves();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnEmptyListWhenNoCurrentWaves() {
        when(waveDataRepository.findByForecastDateOrderByForecastTimeAsc(any()))
                .thenReturn(List.of());

        List<WaveData> result = marineService.getCurrentWaves();

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldGetHourlyWaves() {
        LocalDate date = LocalDate.of(2025, 7, 1);
        WaveData d1 = new WaveData(date, LocalTime.of(6, 0), Instant.now());
        WaveData d2 = new WaveData(date, LocalTime.of(12, 0), Instant.now());

        when(waveDataRepository.findByForecastDateOrderByForecastTimeAsc(date))
                .thenReturn(List.of(d1, d2));

        List<WaveData> result = marineService.getHourlyWaves(date);

        assertEquals(2, result.size());
    }

    private StormglassClient.WaveForecast buildForecast(LocalDate date, LocalTime time, double height) {
        return new StormglassClient.WaveForecast(
                date, time,
                BigDecimal.valueOf(height),
                BigDecimal.valueOf(10.0),
                BigDecimal.valueOf(180),
                BigDecimal.valueOf(height * 0.8),
                BigDecimal.valueOf(9.0),
                BigDecimal.valueOf(180),
                BigDecimal.valueOf(0.4),
                BigDecimal.valueOf(4.0)
        );
    }
}
