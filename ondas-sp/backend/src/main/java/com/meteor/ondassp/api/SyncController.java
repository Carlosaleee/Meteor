package com.meteor.ondassp.api;

import com.meteor.ondassp.application.MarineService;
import com.meteor.ondassp.application.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sync")
@Tag(name = "Sync", description = "Data synchronization endpoints")
public class SyncController {

    private static final Logger log = LoggerFactory.getLogger(SyncController.class);

    private final WeatherService weatherService;
    private final MarineService marineService;

    public SyncController(WeatherService weatherService, MarineService marineService) {
        this.weatherService = weatherService;
        this.marineService = marineService;
    }

    @PostMapping
    @Operation(summary = "Force manual data sync from external APIs")
    public ResponseEntity<Map<String, Object>> syncAll() {
        List<String> errors = new ArrayList<>();
        boolean weatherOk = false;
        boolean wavesOk = false;

        try {
            weatherService.syncWeatherData();
            weatherOk = true;
        } catch (Exception e) {
            log.error("Weather sync failed", e);
            errors.add("Weather: " + e.getMessage());
        }

        try {
            marineService.syncWaveData();
            wavesOk = true;
        } catch (Exception e) {
            log.error("Wave sync failed", e);
            errors.add("Waves: " + e.getMessage());
        }

        if (errors.isEmpty()) {
            return ResponseEntity.ok(Map.of("success", true, "message", "All data synchronized"));
        } else if (weatherOk || wavesOk) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Partial sync completed",
                    "warnings", errors
            ));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "errors", errors));
        }
    }
}
