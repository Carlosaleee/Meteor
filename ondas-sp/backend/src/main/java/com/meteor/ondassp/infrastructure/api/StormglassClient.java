package com.meteor.ondassp.infrastructure.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class StormglassClient {

    private static final Logger log = LoggerFactory.getLogger(StormglassClient.class);

    private static final BigDecimal LATITUDE = new BigDecimal("-24.81");
    private static final BigDecimal LONGITUDE = new BigDecimal("-47.88");

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public StormglassClient(ObjectMapper objectMapper) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = objectMapper;
    }

    public List<WaveForecast> getWaveForecast(LocalDate date) {
        String url = String.format(
                "https://marine-api.open-meteo.com/v1/marine?latitude=%s&longitude=%s&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction,wind_wave_height,wind_wave_period&timezone=America/Sao_Paulo&start_date=%s&end_date=%s",
                LATITUDE, LONGITUDE, date, date.plusDays(6)
        );

        log.info("Fetching wave forecast from Open-Meteo Marine for date={}", date);

        try {
            String response = restTemplate.getForObject(url, String.class);
            Map<String, Object> json = objectMapper.readValue(response, Map.class);
            Map<String, Object> hourly = (Map<String, Object>) json.get("hourly");

            List<String> times = (List<String>) hourly.get("time");
            List<Double> waveHeight = toDoubleList(hourly.get("wave_height"));
            List<Double> wavePeriod = toDoubleList(hourly.get("wave_period"));
            List<Double> waveDirection = toDoubleList(hourly.get("wave_direction"));
            List<Double> swellHeight = toDoubleList(hourly.get("swell_wave_height"));
            List<Double> swellPeriod = toDoubleList(hourly.get("swell_wave_period"));
            List<Double> swellDirection = toDoubleList(hourly.get("swell_wave_direction"));
            List<Double> windWaveHeight = toDoubleList(hourly.get("wind_wave_height"));
            List<Double> windWavePeriod = toDoubleList(hourly.get("wind_wave_period"));

            List<WaveForecast> forecasts = new ArrayList<>();
            for (int i = 0; i < times.size(); i++) {
                LocalTime time = LocalTime.parse(times.get(i).substring(11, 16));
                LocalDate forecastDate = LocalDate.parse(times.get(i).substring(0, 10));
                forecasts.add(new WaveForecast(
                        forecastDate,
                        time,
                        getOrEmpty(waveHeight, i),
                        getOrEmpty(wavePeriod, i),
                        getOrEmpty(waveDirection, i),
                        getOrEmpty(swellHeight, i),
                        getOrEmpty(swellPeriod, i),
                        getOrEmpty(swellDirection, i),
                        getOrEmpty(windWaveHeight, i),
                        getOrEmpty(windWavePeriod, i)
                ));
            }

            log.info("Successfully fetched {} wave forecasts", forecasts.size());
            return forecasts;
        } catch (Exception e) {
            log.error("Error fetching wave data from Open-Meteo Marine", e);
            return List.of();
        }
    }

    private List<Double> toDoubleList(Object obj) {
        if (obj instanceof List<?> list) {
            List<Double> result = new ArrayList<>();
            for (Object item : list) {
                result.add(item instanceof Number n ? n.doubleValue() : null);
            }
            return result;
        }
        return List.of();
    }

    private BigDecimal getOrEmpty(List<Double> list, int index) {
        if (index < list.size() && list.get(index) != null) {
            return BigDecimal.valueOf(list.get(index));
        }
        return null;
    }

    public record WaveForecast(
            LocalDate forecastDate,
            LocalTime forecastTime,
            BigDecimal waveHeight,
            BigDecimal wavePeriod,
            BigDecimal waveDirection,
            BigDecimal swellHeight,
            BigDecimal swellPeriod,
            BigDecimal swellDirection,
            BigDecimal windWaveHeight,
            BigDecimal windWavePeriod
    ) {}
}
