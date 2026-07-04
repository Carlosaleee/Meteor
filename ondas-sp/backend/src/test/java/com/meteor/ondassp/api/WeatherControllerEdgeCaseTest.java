package com.meteor.ondassp.api;

import com.meteor.ondassp.application.WeatherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WeatherController.class)
@ActiveProfiles("test")
class WeatherControllerEdgeCaseTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    @Test
    void shouldReturn400WhenDateParamIsMissing() throws Exception {
        mockMvc.perform(get("/api/weather/hourly"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenDateParamIsInvalid() throws Exception {
        mockMvc.perform(get("/api/weather/hourly").param("date", "not-a-date"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenDateParamHasWrongFormat() throws Exception {
        mockMvc.perform(get("/api/weather/hourly").param("date", "01-07-2025"))
                .andExpect(status().isBadRequest());
    }
}
