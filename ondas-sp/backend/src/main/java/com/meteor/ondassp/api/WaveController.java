package com.meteor.ondassp.api;

import com.meteor.ondassp.api.dto.WaveResponse;
import com.meteor.ondassp.application.MarineService;
import com.meteor.ondassp.domain.wave.WaveData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/waves")
@Tag(name = "Waves", description = "Wave forecast endpoints")
public class WaveController {

    private final MarineService marineService;

    public WaveController(MarineService marineService) {
        this.marineService = marineService;
    }

    @GetMapping("/current")
    @Operation(summary = "Get current wave forecast")
    public ResponseEntity<List<WaveResponse>> getCurrentWaves() {
        List<WaveData> data = marineService.getCurrentWaves();
        if (data.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(data.stream().map(this::toResponse).toList());
    }

    @GetMapping("/hourly")
    @Operation(summary = "Get hourly wave forecast for a specific date")
    public ResponseEntity<List<WaveResponse>> getHourlyWaves(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<WaveData> data = marineService.getHourlyWaves(date);
        return ResponseEntity.ok(data.stream().map(this::toResponse).toList());
    }

    private WaveResponse toResponse(WaveData d) {
        return new WaveResponse(
                d.getId(),
                d.getForecastDate(),
                d.getForecastTime(),
                d.getFetchedAt(),
                d.getWaveHeight(),
                d.getWavePeriod(),
                d.getWaveDirection(),
                d.getSwellHeight(),
                d.getSwellPeriod(),
                d.getSwellDirection(),
                d.getWindWaveHeight(),
                d.getWindWavePeriod()
        );
    }
}
