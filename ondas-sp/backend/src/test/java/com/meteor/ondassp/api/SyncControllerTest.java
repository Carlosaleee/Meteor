package com.meteor.ondassp.api;

import com.meteor.ondassp.application.MarineService;
import com.meteor.ondassp.application.WeatherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SyncController.class)
@ActiveProfiles("test")
class SyncControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    @MockBean
    private MarineService marineService;

    @Test
    void shouldSyncAllSuccessfully() throws Exception {
        doNothing().when(weatherService).syncWeatherData();
        doNothing().when(marineService).syncWaveData();

        mockMvc.perform(post("/api/sync"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("All data synchronized"));
    }

    @Test
    void shouldReturnPartialSuccessWhenOnlyWeatherFails() throws Exception {
        doThrow(new RuntimeException("Weather API unavailable")).when(weatherService).syncWeatherData();
        doNothing().when(marineService).syncWaveData();

        mockMvc.perform(post("/api/sync"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Partial sync completed"));
    }

    @Test
    void shouldReturnPartialSuccessWhenOnlyWavesFail() throws Exception {
        doNothing().when(weatherService).syncWeatherData();
        doThrow(new RuntimeException("Marine API unavailable")).when(marineService).syncWaveData();

        mockMvc.perform(post("/api/sync"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Partial sync completed"));
    }

    @Test
    void shouldReturn500WhenBothSyncsFail() throws Exception {
        doThrow(new RuntimeException("Weather fail")).when(weatherService).syncWeatherData();
        doThrow(new RuntimeException("Wave fail")).when(marineService).syncWaveData();

        mockMvc.perform(post("/api/sync"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false));
    }
}
