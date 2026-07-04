package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.weather.WeatherData;
import com.meteor.ondassp.domain.weather.WeatherDataRepository;
import com.meteor.ondassp.infrastructure.api.OpenMeteoClient;
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
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final OpenMeteoClient openMeteoClient;
    private final WeatherDataRepository weatherDataRepository;

    public WeatherService(OpenMeteoClient openMeteoClient, WeatherDataRepository weatherDataRepository) {
        this.openMeteoClient = openMeteoClient;
        this.weatherDataRepository = weatherDataRepository;
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "weather-current", allEntries = true),
            @CacheEvict(value = "weather-hourly", allEntries = true)
    })
    public void syncWeatherData() {
        log.info("Starting weather data synchronization");
        LocalDate today = LocalDate.now();
        List<OpenMeteoClient.DailyForecast> forecasts = openMeteoClient.getDailyForecast(today);

        Instant now = Instant.now();
        for (OpenMeteoClient.DailyForecast fc : forecasts) {
            LocalDate forecastDate = LocalDate.parse(fc.date());
            Optional<WeatherData> existing = weatherDataRepository
                    .findTopByForecastDateOrderByFetchedAtDesc(forecastDate);

            if (existing.isPresent() && existing.get().getFetchedAt().isAfter(now.minusSeconds(1800))) {
                log.debug("Skipping weather for {} - data is fresh", forecastDate);
                continue;
            }

            WeatherData data = new WeatherData(forecastDate, now);
            data.setTemperatureMax(fc.temperatureMax());
            data.setTemperatureMin(fc.temperatureMin());
            data.setTemperatureMean(fc.temperatureMean());
            data.setPrecipitationSum(fc.precipitationSum());
            data.setWindSpeedMax(fc.windSpeedMax());
            data.setWindDirection(fc.windDirection());
            data.setCloudCover(fc.cloudCover());
            data.setHumidity(fc.humidity());
            data.setUvIndex(fc.uvIndex());
            if (fc.weatherCode() != null) {
                data.setWeatherCode(String.valueOf(fc.weatherCode().intValue()));
            }
            weatherDataRepository.save(data);
            log.info("Saved weather data for {}", forecastDate);
        }

        log.info("Weather synchronization completed");
    }

    public Optional<WeatherData> getCurrentWeather() {
        return weatherDataRepository.findTopByForecastDateOrderByFetchedAtDesc(LocalDate.now());
    }

    @Cacheable(value = "weather-hourly", key = "#date")
    public List<WeatherData> getHourlyWeather(LocalDate date) {
        return weatherDataRepository.findByForecastDateOrderByFetchedAtAsc(date);
    }
}
