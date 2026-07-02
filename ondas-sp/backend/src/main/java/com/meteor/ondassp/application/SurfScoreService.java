package com.meteor.ondassp.application;

import com.meteor.ondassp.domain.surf.SurfScore;
import com.meteor.ondassp.domain.surf.SurfSummary;
import com.meteor.ondassp.domain.wave.WaveData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class SurfScoreService {

    private static final Logger log = LoggerFactory.getLogger(SurfScoreService.class);

    private static final LocalTime DAYLIGHT_START = LocalTime.of(6, 0);
    private static final LocalTime DAYLIGHT_END = LocalTime.of(18, 0);

    private final WeatherService weatherService;
    private final MarineService marineService;

    public SurfScoreService(WeatherService weatherService, MarineService marineService) {
        this.weatherService = weatherService;
        this.marineService = marineService;
    }

    /**
     * Filters waves to only daylight hours (6am-6pm) and returns them sorted
     * by composite surf quality (best conditions first).
     */
    private List<WaveData> getDaylightWaves(List<WaveData> allWaves) {
        return allWaves.stream()
                .filter(w -> w.getForecastTime() != null
                        && !w.getForecastTime().isBefore(DAYLIGHT_START)
                        && !w.getForecastTime().isAfter(DAYLIGHT_END))
                .sorted(Comparator.comparing((WaveData w) -> {
                    BigDecimal waveH = w.getWaveHeight() != null ? w.getWaveHeight() : BigDecimal.ZERO;
                    BigDecimal swellH = w.getSwellHeight() != null ? w.getSwellHeight() : BigDecimal.ZERO;
                    BigDecimal period = w.getWavePeriod() != null ? w.getWavePeriod() : BigDecimal.ZERO;
                    return waveH.add(swellH).add(period.divide(BigDecimal.TEN, 2, RoundingMode.HALF_UP));
                }).reversed())
                .toList();
    }

    /**
     * Finds the best time to surf during daylight hours using composite scoring.
     */
    private LocalTime findBestSurfTime(List<WaveData> waves) {
        List<WaveData> daylight = getDaylightWaves(waves);
        if (daylight.isEmpty()) {
            return LocalTime.NOON;
        }
        return daylight.get(0).getForecastTime();
    }

    public SurfScore calculateScore(LocalDate date) {
        log.info("Calculating surf score for {}", date);

        var weather = weatherService.getCurrentWeather();
        List<WaveData> waves = marineService.getHourlyWaves(date);

        if (waves.isEmpty()) {
            return new SurfScore(date, LocalTime.NOON, BigDecimal.ZERO, "Sem dados", "Dados de ondas indisponíveis");
        }

        List<WaveData> daylightWaves = getDaylightWaves(waves);
        WaveData bestWave = daylightWaves.isEmpty() ? waves.get(0) : daylightWaves.get(0);
        LocalTime bestTime = findBestSurfTime(waves);

        BigDecimal waveScore = calculateWaveScore(bestWave);
        BigDecimal weatherScore = weather.map(w -> calculateWeatherScore(w.getWindSpeedMax(), w.getPrecipitationSum()))
                .orElse(BigDecimal.valueOf(5));
        BigDecimal swellScore = calculateSwellScore(bestWave);

        BigDecimal totalScore = waveScore
                .add(weatherScore)
                .add(swellScore)
                .divide(BigDecimal.valueOf(3), 1, RoundingMode.HALF_UP);

        String level = getLevel(totalScore);
        String recommendation = getRecommendation(totalScore, bestWave);

        return new SurfScore(date, bestTime, totalScore, level, recommendation);
    }

    public SurfSummary generateSummary(LocalDate date) {
        log.info("Generating surf summary for {}", date);

        var weather = weatherService.getCurrentWeather();
        List<WaveData> waves = marineService.getHourlyWaves(date);

        String weatherSummary = weather.map(w -> {
            StringBuilder sb = new StringBuilder();
            if (w.getTemperatureMean() != null) {
                sb.append("Temperatura média de ").append(w.getTemperatureMean()).append("°C");
            }
            if (w.getWindSpeedMax() != null) {
                sb.append(", vento de até ").append(w.getWindSpeedMax()).append(" km/h");
            }
            if (w.getPrecipitationSum() != null && w.getPrecipitationSum().compareTo(BigDecimal.ZERO) > 0) {
                sb.append(", possibilidade de chuva com ").append(w.getPrecipitationSum()).append(" mm");
            } else {
                sb.append(", sem chuva prevista");
            }
            return sb.toString();
        }).orElse("Dados meteorológicos indisponíveis");

        String waveSummary;
        String bestTime;
        if (!waves.isEmpty()) {
            List<WaveData> daylightWaves = getDaylightWaves(waves);
            WaveData maxWave = daylightWaves.isEmpty() ? waves.get(0) : daylightWaves.get(0);

            StringBuilder wsb = new StringBuilder();
            if (maxWave.getWaveHeight() != null) {
                wsb.append("Ondas de até ").append(maxWave.getWaveHeight()).append("m");
            }
            if (maxWave.getWavePeriod() != null) {
                wsb.append(" com período de ").append(maxWave.getWavePeriod()).append("s");
            }
            if (maxWave.getSwellHeight() != null) {
                wsb.append(". Swell de ").append(maxWave.getSwellHeight()).append("m");
            }
            waveSummary = wsb.toString();
            LocalTime best = findBestSurfTime(waves);
            bestTime = best != null ? best.toString() + "h" : "Não definido";
        } else {
            waveSummary = "Dados de ondas indisponíveis";
            bestTime = "Não disponível";
        }

        SurfScore score = calculateScore(date);
        String fullSummary = String.format(
                "Resumo para %s: %s. %s. Score de surf: %s/10 (%s). %s",
                date.toString(),
                weatherSummary,
                waveSummary,
                score.score(),
                score.level(),
                score.recommendation()
        );

        return new SurfSummary(date, weatherSummary, waveSummary, fullSummary, bestTime);
    }

    private BigDecimal calculateWaveScore(WaveData wave) {
        BigDecimal score = BigDecimal.valueOf(5);

        if (wave.getWaveHeight() != null) {
            double h = wave.getWaveHeight().doubleValue();
            if (h >= 1.0 && h <= 2.5) {
                score = BigDecimal.valueOf(9);
            } else if (h >= 0.5 && h < 1.0) {
                score = BigDecimal.valueOf(7);
            } else if (h > 2.5 && h <= 3.5) {
                score = BigDecimal.valueOf(6);
            } else if (h > 3.5) {
                score = BigDecimal.valueOf(4);
            } else {
                score = BigDecimal.valueOf(3);
            }
        }

        return score;
    }

    private BigDecimal calculateWeatherScore(BigDecimal windSpeed, BigDecimal precipitation) {
        BigDecimal score = BigDecimal.valueOf(7);

        if (windSpeed != null) {
            double w = windSpeed.doubleValue();
            if (w < 15) {
                score = score.add(BigDecimal.valueOf(2));
            } else if (w < 25) {
                score = score.add(BigDecimal.ONE);
            } else if (w > 40) {
                score = score.subtract(BigDecimal.valueOf(2));
            } else {
                score = score.subtract(BigDecimal.ONE);
            }
        }

        if (precipitation != null && precipitation.compareTo(BigDecimal.valueOf(5)) > 0) {
            score = score.subtract(BigDecimal.ONE);
        }

        return score.max(BigDecimal.ZERO).min(BigDecimal.TEN);
    }

    private BigDecimal calculateSwellScore(WaveData wave) {
        BigDecimal score = BigDecimal.valueOf(5);

        if (wave.getSwellHeight() != null && wave.getSwellPeriod() != null) {
            double sh = wave.getSwellHeight().doubleValue();
            double sp = wave.getSwellPeriod().doubleValue();

            if (sh >= 1.0 && sh <= 2.0 && sp >= 8 && sp <= 14) {
                score = BigDecimal.valueOf(9);
            } else if (sh >= 0.5 && sp >= 6) {
                score = BigDecimal.valueOf(7);
            } else if (sh > 2.5) {
                score = BigDecimal.valueOf(5);
            }
        }

        return score;
    }

    private String getLevel(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(8)) >= 0) return "Excelente";
        if (score.compareTo(BigDecimal.valueOf(6)) >= 0) return "Bom";
        if (score.compareTo(BigDecimal.valueOf(4)) >= 0) return "Regular";
        return "Ruim";
    }

    private String getRecommendation(BigDecimal score, WaveData wave) {
        if (score.compareTo(BigDecimal.valueOf(8)) >= 0) {
            return "Condições ideais para surfar! Aproveite as ondas.";
        }
        if (score.compareTo(BigDecimal.valueOf(6)) >= 0) {
            return "Boas condições para surfar. Vale a pena ir à praia.";
        }
        if (score.compareTo(BigDecimal.valueOf(4)) >= 0) {
            return "Condições razoáveis. Surfadores iniciantes podem aproveitar.";
        }
        return "Condições desfavoráveis para surfar hoje.";
    }
}
