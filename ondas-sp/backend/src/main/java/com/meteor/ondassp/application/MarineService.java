package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.wave.WaveData;
import com.meteor.ondassp.domain.wave.WaveDataRepository;
import com.meteor.ondassp.infrastructure.api.StormglassClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MarineService {

    private static final Logger log = LoggerFactory.getLogger(MarineService.class);

    private final StormglassClient stormglassClient;
    private final WaveDataRepository waveDataRepository;

    public MarineService(StormglassClient stormglassClient, WaveDataRepository waveDataRepository) {
        this.stormglassClient = stormglassClient;
        this.waveDataRepository = waveDataRepository;
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "waves-current", allEntries = true),
            @CacheEvict(value = "waves-hourly", allEntries = true)
    })
    public void syncWaveData() {
        log.info("Starting wave data synchronization");
        LocalDate today = LocalDate.now();
        List<StormglassClient.WaveForecast> forecasts = stormglassClient.getWaveForecast(today);

        Instant now = Instant.now();
        for (StormglassClient.WaveForecast fc : forecasts) {
            WaveData data = new WaveData(fc.forecastDate(), fc.forecastTime(), now);
            data.setWaveHeight(fc.waveHeight());
            data.setWavePeriod(fc.wavePeriod());
            data.setWaveDirection(fc.waveDirection());
            data.setSwellHeight(fc.swellHeight());
            data.setSwellPeriod(fc.swellPeriod());
            data.setSwellDirection(fc.swellDirection());
            data.setWindWaveHeight(fc.windWaveHeight());
            data.setWindWavePeriod(fc.windWavePeriod());
            waveDataRepository.save(data);
        }

        log.info("Wave synchronization completed. Saved {} records", forecasts.size());
    }

    @Cacheable(value = "waves-current", key = "'today'")
    public List<WaveData> getCurrentWaves() {
        LocalDate today = LocalDate.now();
        List<WaveData> todayWaves = waveDataRepository.findByForecastDateOrderByForecastTimeAsc(today);
        if (!todayWaves.isEmpty()) {
            return todayWaves;
        }
        return List.of();
    }

    @Cacheable(value = "waves-hourly", key = "#date")
    public List<WaveData> getHourlyWaves(LocalDate date) {
        return waveDataRepository.findByForecastDateOrderByForecastTimeAsc(date);
    }
}
