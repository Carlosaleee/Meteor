package com.meteor.ondassp.api;

import com.meteor.ondassp.api.dto.SpotResponse;
import com.meteor.ondassp.domain.spot.Spot;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller exposing surf spot information for Ilha Comprida, SP.
 * Spots are static/curated data — no database persistence required.
 */
@RestController
@RequestMapping("/api/spots")
@Tag(name = "Spots", description = "Surf spots for Ilha Comprida/SP")
public class SpotController {

    private static final List<Spot> SPOTS = List.of(
            new Spot(
                    "ilha-comprida-centro",
                    "Ilha Comprida — Centro",
                    "Praia mais acessível com ondas regulares, ideal para iniciantes e intermediários.",
                    -24.8074,
                    -47.8824,
                    "Iniciante",
                    "Quebra de praia"
            ),
            new Spot(
                    "ilha-comprida-norte",
                    "Ilha Comprida — Ponta Norte",
                    "Ponta exposta a swells do sul com ondas mais organizadas e com bom período.",
                    -24.7200,
                    -47.9700,
                    "Intermediário",
                    "Quebra de ponta"
            ),
            new Spot(
                    "ilha-comprida-boqueirão",
                    "Ilha Comprida — Boqueirão Sul",
                    "Ondas com boa força vindas do canal, pico favorito dos locais.",
                    -24.9800,
                    -47.8200,
                    "Avançado",
                    "Quebra de canal"
            ),
            new Spot(
                    "iguape-praia-jurupari",
                    "Iguape — Praia do Jurupar",
                    "Praia virgem ao norte da ilha com ondas limpas em dias de swell sul.",
                    -24.7100,
                    -47.5500,
                    "Intermediário",
                    "Quebra de praia"
            )
    );

    @GetMapping
    @Operation(summary = "List all surf spots near Ilha Comprida/SP")
    public ResponseEntity<List<SpotResponse>> listSpots() {
        List<SpotResponse> response = SPOTS.stream()
                .map(s -> new SpotResponse(
                        s.id(), s.name(), s.description(),
                        s.latitude(), s.longitude(),
                        s.difficulty(), s.waveType()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }
}
