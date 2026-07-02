package com.meteor.ondassp.infrastructure.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class OpenMeteoClient {

    private static final Logger log = LoggerFactory.getLogger(OpenMeteoClient.class);

    private static final BigDecimal LATITUDE = new BigDecimal("-24.81");
    private static final BigDecimal LONGITUDE = new BigDecimal("-47.88");

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.external-apis.open-meteo.base-url}")
    private String baseUrl;

    public OpenMeteoClient(ObjectMapper objectMapper) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = objectMapper;
    }

    public List<DailyForecast> getDailyForecast(LocalDate date) {
        String url = String.format(
                "%s/v1/forecast?latitude=%s&longitude=%s&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,cloud_cover_mean,relative_humidity_2m_mean,uv_index_max,weather_code&timezone=America/Sao_Paulo&forecast_days=7",
                baseUrl, LATITUDE, LONGITUDE
        );

        log.info("Fetching weather forecast from Open-Meteo for date={}", date);

        try {
            String response = restTemplate.getForObject(url, String.class);
            Map<String, Object> json = objectMapper.readValue(response, Map.class);
            Map<String, Object> daily = (Map<String, Object>) json.get("daily");

            List<String> dates = (List<String>) daily.get("time");
            List<Double> maxTemp = toDoubleList(daily.get("temperature_2m_max"));
            List<Double> minTemp = toDoubleList(daily.get("temperature_2m_min"));
            List<Double> meanTemp = toDoubleList(daily.get("temperature_2m_mean"));
            List<Double> precip = toDoubleList(daily.get("precipitation_sum"));
            List<Double> windSpeed = toDoubleList(daily.get("wind_speed_10m_max"));
            List<Double> windDir = toDoubleList(daily.get("wind_direction_10m_dominant"));
            List<Double> cloudCover = toDoubleList(daily.get("cloud_cover_mean"));
            List<Double> humidity = toDoubleList(daily.get("relative_humidity_2m_mean"));
            List<Double> uvIndex = toDoubleList(daily.get("uv_index_max"));
            List<Double> weatherCodes = toDoubleList(daily.get("weather_code"));

            List<DailyForecast> forecasts = new ArrayList<>();
            for (int i = 0; i < dates.size(); i++) {
                forecasts.add(new DailyForecast(
                        dates.get(i),
                        getOrEmpty(maxTemp, i),
                        getOrEmpty(minTemp, i),
                        getOrEmpty(meanTemp, i),
                        getOrEmpty(precip, i),
                        getOrEmpty(windSpeed, i),
                        getOrEmpty(windDir, i),
                        getOrEmpty(cloudCover, i),
                        getOrEmpty(humidity, i),
                        getOrEmpty(uvIndex, i),
                        getOrEmptyDouble(weatherCodes, i)
                ));
            }

            log.info("Successfully fetched {} daily forecasts", forecasts.size());
            return forecasts;
        } catch (Exception e) {
            log.error("Error fetching Open-Meteo data", e);
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

    private Double getOrEmptyDouble(List<Double> list, int index) {
        if (index < list.size()) {
            return list.get(index);
        }
        return null;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record DailyForecast(
            String date,
            BigDecimal temperatureMax,
            BigDecimal temperatureMin,
            BigDecimal temperatureMean,
            BigDecimal precipitationSum,
            BigDecimal windSpeedMax,
            BigDecimal windDirection,
            BigDecimal cloudCover,
            BigDecimal humidity,
            BigDecimal uvIndex,
            Double weatherCode
    ) {}
}
