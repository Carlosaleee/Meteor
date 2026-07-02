package com.meteor.ondassp.infrastructure.scheduler;

import com.meteor.ondassp.application.MarineService;
import com.meteor.ondassp.application.WeatherService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DataSyncScheduler {

    private static final Logger log = LoggerFactory.getLogger(DataSyncScheduler.class);

    private final WeatherService weatherService;
    private final MarineService marineService;

    public DataSyncScheduler(WeatherService weatherService, MarineService marineService) {
        this.weatherService = weatherService;
        this.marineService = marineService;
    }

    @PostConstruct
    public void syncOnStartup() {
        log.info("Starting data synchronization on application startup");
        syncAllData();
    }

    @Scheduled(cron = "0 0 */2 * * *")
    public void syncAllData() {
        log.info("Starting scheduled data synchronization");
        try {
            weatherService.syncWeatherData();
        } catch (Exception e) {
            log.error("Error syncing weather data", e);
        }
        try {
            marineService.syncWaveData();
        } catch (Exception e) {
            log.error("Error syncing wave data", e);
        }
        log.info("Synchronization completed");
    }
}
