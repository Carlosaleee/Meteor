package com.meteor.ondassp.api;

import com.meteor.ondassp.application.SurfScoreService;
import com.meteor.ondassp.domain.surf.SurfScore;
import com.meteor.ondassp.domain.surf.SurfSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SurfController.class)
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class SurfControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SurfScoreService surfScoreService;

    @Test
    void shouldReturnSurfScore() throws Exception {
        when(surfScoreService.calculateScore(any(LocalDate.class)))
                .thenReturn(new SurfScore(LocalDate.now(), LocalTime.NOON, BigDecimal.valueOf(7), "Bom", "Boas condições"));

        mockMvc.perform(get("/api/surf/score"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").isNotEmpty())
                .andExpect(jsonPath("$.score").value(7))
                .andExpect(jsonPath("$.level").value("Bom"))
                .andExpect(jsonPath("$.recommendation").value("Boas condições"));
    }

    @Test
    void shouldReturnSurfScoreForSpecificDate() throws Exception {
        LocalDate date = LocalDate.of(2025, 1, 15);
        when(surfScoreService.calculateScore(date))
                .thenReturn(new SurfScore(date, LocalTime.NOON, BigDecimal.valueOf(8), "Excelente", "Condições ideais"));

        mockMvc.perform(get("/api/surf/score").param("date", "2025-01-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2025-01-15"))
                .andExpect(jsonPath("$.score").value(8));
    }

    @Test
    void shouldReturnSurfSummary() throws Exception {
        when(surfScoreService.generateSummary(any(LocalDate.class)))
                .thenReturn(new SurfSummary(LocalDate.now(), "Clima ok", "Ondas boas", "Resumo completo", "14:00"));

        mockMvc.perform(get("/api/surf/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").isNotEmpty())
                .andExpect(jsonPath("$.weatherSummary").value("Clima ok"))
                .andExpect(jsonPath("$.waveSummary").value("Ondas boas"))
                .andExpect(jsonPath("$.fullSummary").value("Resumo completo"))
                .andExpect(jsonPath("$.bestTimeToSurf").value("14:00"));
    }
}
