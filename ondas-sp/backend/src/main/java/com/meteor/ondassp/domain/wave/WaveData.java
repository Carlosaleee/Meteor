package com.meteor.ondassp.domain.wave;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "wave_data")
public class WaveData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate forecastDate;

    @Column(nullable = false)
    private LocalTime forecastTime;

    @Column(nullable = false)
    private Instant fetchedAt;

    private BigDecimal waveHeight;

    private BigDecimal wavePeriod;

    private BigDecimal waveDirection;

    private BigDecimal swellHeight;

    private BigDecimal swellPeriod;

    private BigDecimal swellDirection;

    private BigDecimal windWaveHeight;

    private BigDecimal windWavePeriod;

    protected WaveData() {}

    public WaveData(LocalDate forecastDate, LocalTime forecastTime, Instant fetchedAt) {
        this.forecastDate = forecastDate;
        this.forecastTime = forecastTime;
        this.fetchedAt = fetchedAt;
    }

    public Long getId() { return id; }

    public LocalDate getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }

    public LocalTime getForecastTime() { return forecastTime; }
    public void setForecastTime(LocalTime forecastTime) { this.forecastTime = forecastTime; }

    public Instant getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(Instant fetchedAt) { this.fetchedAt = fetchedAt; }

    public BigDecimal getWaveHeight() { return waveHeight; }
    public void setWaveHeight(BigDecimal waveHeight) { this.waveHeight = waveHeight; }

    public BigDecimal getWavePeriod() { return wavePeriod; }
    public void setWavePeriod(BigDecimal wavePeriod) { this.wavePeriod = wavePeriod; }

    public BigDecimal getWaveDirection() { return waveDirection; }
    public void setWaveDirection(BigDecimal waveDirection) { this.waveDirection = waveDirection; }

    public BigDecimal getSwellHeight() { return swellHeight; }
    public void setSwellHeight(BigDecimal swellHeight) { this.swellHeight = swellHeight; }

    public BigDecimal getSwellPeriod() { return swellPeriod; }
    public void setSwellPeriod(BigDecimal swellPeriod) { this.swellPeriod = swellPeriod; }

    public BigDecimal getSwellDirection() { return swellDirection; }
    public void setSwellDirection(BigDecimal swellDirection) { this.swellDirection = swellDirection; }

    public BigDecimal getWindWaveHeight() { return windWaveHeight; }
    public void setWindWaveHeight(BigDecimal windWaveHeight) { this.windWaveHeight = windWaveHeight; }

    public BigDecimal getWindWavePeriod() { return windWavePeriod; }
    public void setWindWavePeriod(BigDecimal windWavePeriod) { this.windWavePeriod = windWavePeriod; }
}
