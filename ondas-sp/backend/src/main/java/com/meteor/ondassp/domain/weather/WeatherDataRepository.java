package com.meteor.ondassp.domain.weather;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {

    Optional<WeatherData> findTopByForecastDateOrderByFetchedAtDesc(LocalDate forecastDate);

    List<WeatherData> findByForecastDateOrderByFetchedAtAsc(LocalDate forecastDate);
}
