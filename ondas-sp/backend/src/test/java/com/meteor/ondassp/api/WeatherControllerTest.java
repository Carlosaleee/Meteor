package com.meteor.ondassp.api;

import com.meteor.ondassp.application.WeatherService;
import com.meteor.ondassp.domain.weather.WeatherData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WeatherController.class)
@ActiveProfiles("test")
class WeatherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    @Test
    void shouldReturnCurrentWeather() throws Exception {
        WeatherData data = buildWeatherData(LocalDate.now());

        when(weatherService.getCurrentWeather()).thenReturn(Optional.of(data));

        mockMvc.perform(get("/api/weather/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.forecastDate").isNotEmpty())
                .andExpect(jsonPath("$.temperatureMean").value(26.0))
                .andExpect(jsonPath("$.windSpeedMax").value(15.0));
    }

    @Test
    void shouldReturn204WhenNoCurrentWeather() throws Exception {
        when(weatherService.getCurrentWeather()).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/weather/current"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnHourlyWeather() throws Exception {
        LocalDate date = LocalDate.of(2025, 7, 1);
        WeatherData data1 = buildWeatherData(date);
        WeatherData data2 = buildWeatherData(date);

        when(weatherService.getHourlyWeather(date)).thenReturn(List.of(data1, data2));

        mockMvc.perform(get("/api/weather/hourly").param("date", "2025-07-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturnEmptyListWhenNoHourlyWeather() throws Exception {
        when(weatherService.getHourlyWeather(any(LocalDate.class))).thenReturn(List.of());

        mockMvc.perform(get("/api/weather/hourly").param("date", "2025-01-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    private WeatherData buildWeatherData(LocalDate date) {
        WeatherData data = new WeatherData(date, Instant.now());
        data.setTemperatureMax(BigDecimal.valueOf(30.0));
        data.setTemperatureMin(BigDecimal.valueOf(22.0));
        data.setTemperatureMean(BigDecimal.valueOf(26.0));
        data.setPrecipitationSum(BigDecimal.ZERO);
        data.setWindSpeedMax(BigDecimal.valueOf(15.0));
        data.setWindDirection(BigDecimal.valueOf(180));
        data.setCloudCover(BigDecimal.valueOf(20));
        data.setHumidity(BigDecimal.valueOf(75));
        data.setUvIndex(BigDecimal.valueOf(6));
        data.setWeatherCode("2");
        return data;
    }
}
