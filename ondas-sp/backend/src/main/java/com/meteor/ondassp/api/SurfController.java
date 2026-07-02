package com.meteor.ondassp.api;

import com.meteor.ondassp.api.dto.SurfScoreResponse;
import com.meteor.ondassp.api.dto.SurfSummaryResponse;
import com.meteor.ondassp.application.SurfScoreService;
import com.meteor.ondassp.domain.surf.SurfScore;
import com.meteor.ondassp.domain.surf.SurfSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/surf")
@Tag(name = "Surf", description = "Surf score and AI summary endpoints")
public class SurfController {

    private final SurfScoreService surfScoreService;

    public SurfController(SurfScoreService surfScoreService) {
        this.surfScoreService = surfScoreService;
    }

    @GetMapping("/score")
    @Operation(summary = "Calculate surf score for a specific date")
    public ResponseEntity<SurfScoreResponse> getScore(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        SurfScore score = surfScoreService.calculateScore(targetDate);
        return ResponseEntity.ok(toScoreResponse(score));
    }

    @GetMapping("/summary")
    @Operation(summary = "Generate AI-powered surf summary in natural language")
    public ResponseEntity<SurfSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        SurfSummary summary = surfScoreService.generateSummary(targetDate);
        return ResponseEntity.ok(toSummaryResponse(summary));
    }

    private SurfScoreResponse toScoreResponse(SurfScore s) {
        return new SurfScoreResponse(s.date(), s.bestTime(), s.score(), s.level(), s.recommendation());
    }

    private SurfSummaryResponse toSummaryResponse(SurfSummary s) {
        return new SurfSummaryResponse(s.date(), s.weatherSummary(), s.waveSummary(), s.fullSummary(), s.bestTimeToSurf());
    }
}
