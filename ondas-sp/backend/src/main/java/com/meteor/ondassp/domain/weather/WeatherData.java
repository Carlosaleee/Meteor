package com.meteor.ondassp.domain.weather;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate forecastDate;

    @Column(nullable = false)
    private Instant fetchedAt;

    private BigDecimal temperatureMax;

    private BigDecimal temperatureMin;

    private BigDecimal temperatureMean;

    private BigDecimal precipitationSum;

    private BigDecimal windSpeedMax;

    private BigDecimal windDirection;

    private BigDecimal cloudCover;

    private BigDecimal humidity;

    private BigDecimal uvIndex;

    @Column(columnDefinition = "TEXT")
    private String weatherCode;

    protected WeatherData() {}

    public WeatherData(LocalDate forecastDate, Instant fetchedAt) {
        this.forecastDate = forecastDate;
        this.fetchedAt = fetchedAt;
    }

    public Long getId() { return id; }

    public LocalDate getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }

    public Instant getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(Instant fetchedAt) { this.fetchedAt = fetchedAt; }

    public BigDecimal getTemperatureMax() { return temperatureMax; }
    public void setTemperatureMax(BigDecimal temperatureMax) { this.temperatureMax = temperatureMax; }

    public BigDecimal getTemperatureMin() { return temperatureMin; }
    public void setTemperatureMin(BigDecimal temperatureMin) { this.temperatureMin = temperatureMin; }

    public BigDecimal getTemperatureMean() { return temperatureMean; }
    public void setTemperatureMean(BigDecimal temperatureMean) { this.temperatureMean = temperatureMean; }

    public BigDecimal getPrecipitationSum() { return precipitationSum; }
    public void setPrecipitationSum(BigDecimal precipitationSum) { this.precipitationSum = precipitationSum; }

    public BigDecimal getWindSpeedMax() { return windSpeedMax; }
    public void setWindSpeedMax(BigDecimal windSpeedMax) { this.windSpeedMax = windSpeedMax; }

    public BigDecimal getWindDirection() { return windDirection; }
    public void setWindDirection(BigDecimal windDirection) { this.windDirection = windDirection; }

    public BigDecimal getCloudCover() { return cloudCover; }
    public void setCloudCover(BigDecimal cloudCover) { this.cloudCover = cloudCover; }

    public BigDecimal getHumidity() { return humidity; }
    public void setHumidity(BigDecimal humidity) { this.humidity = humidity; }

    public BigDecimal getUvIndex() { return uvIndex; }
    public void setUvIndex(BigDecimal uvIndex) { this.uvIndex = uvIndex; }

    public String getWeatherCode() { return weatherCode; }
    public void setWeatherCode(String weatherCode) { this.weatherCode = weatherCode; }
}
