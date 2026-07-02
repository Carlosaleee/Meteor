package com.meteor.ondassp.api;

import com.meteor.ondassp.application.MarineService;
import com.meteor.ondassp.domain.wave.WaveData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WaveController.class)
@ActiveProfiles("test")
class WaveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MarineService marineService;

    @Test
    void shouldReturnCurrentWaves() throws Exception {
        WaveData data = buildWaveData(LocalDate.now(), LocalTime.NOON);
        when(marineService.getCurrentWaves()).thenReturn(List.of(data));

        mockMvc.perform(get("/api/waves/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].waveHeight").value(1.5))
                .andExpect(jsonPath("$[0].wavePeriod").value(10.0));
    }

    @Test
    void shouldReturn204WhenNoCurrentWaves() throws Exception {
        when(marineService.getCurrentWaves()).thenReturn(List.of());

        mockMvc.perform(get("/api/waves/current"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnHourlyWaves() throws Exception {
        LocalDate date = LocalDate.of(2025, 7, 1);
        List<WaveData> waves = List.of(
                buildWaveData(date, LocalTime.of(6, 0)),
                buildWaveData(date, LocalTime.of(12, 0)),
                buildWaveData(date, LocalTime.of(18, 0))
        );
        when(marineService.getHourlyWaves(date)).thenReturn(waves);

        mockMvc.perform(get("/api/waves/hourly").param("date", "2025-07-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void shouldReturnEmptyListWhenNoHourlyWaves() throws Exception {
        when(marineService.getHourlyWaves(any(LocalDate.class))).thenReturn(List.of());

        mockMvc.perform(get("/api/waves/hourly").param("date", "2025-01-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    private WaveData buildWaveData(LocalDate date, LocalTime time) {
        WaveData data = new WaveData(date, time, Instant.now());
        data.setWaveHeight(BigDecimal.valueOf(1.5));
        data.setWavePeriod(BigDecimal.valueOf(10.0));
        data.setWaveDirection(BigDecimal.valueOf(180));
        data.setSwellHeight(BigDecimal.valueOf(1.2));
        data.setSwellPeriod(BigDecimal.valueOf(9.0));
        data.setSwellDirection(BigDecimal.valueOf(180));
        data.setWindWaveHeight(BigDecimal.valueOf(0.5));
        data.setWindWavePeriod(BigDecimal.valueOf(4.0));
        return data;
    }
}
