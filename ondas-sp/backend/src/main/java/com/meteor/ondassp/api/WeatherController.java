package com.meteor.ondassp.api;

import com.meteor.ondassp.api.dto.WeatherResponse;
import com.meteor.ondassp.application.WeatherService;
import com.meteor.ondassp.domain.weather.WeatherData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/weather")
@Tag(name = "Weather", description = "Weather forecast endpoints")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    @Operation(summary = "Get current weather forecast")
    public ResponseEntity<WeatherResponse> getCurrentWeather() {
        Optional<WeatherData> data = weatherService.getCurrentWeather();
        return data.map(d -> ResponseEntity.ok(toResponse(d)))
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/hourly")
    @Operation(summary = "Get hourly weather forecast for a specific date")
    public ResponseEntity<List<WeatherResponse>> getHourlyWeather(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<WeatherData> data = weatherService.getHourlyWeather(date);
        List<WeatherResponse> responses = data.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(responses);
    }

    private WeatherResponse toResponse(WeatherData d) {
        return new WeatherResponse(
                d.getId(),
                d.getForecastDate(),
                d.getFetchedAt(),
                d.getTemperatureMax(),
                d.getTemperatureMin(),
                d.getTemperatureMean(),
                d.getPrecipitationSum(),
                d.getWindSpeedMax(),
                d.getWindDirection(),
                d.getCloudCover(),
                d.getHumidity(),
                d.getUvIndex(),
                d.getWeatherCode()
        );
    }
}
