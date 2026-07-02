package com.meteor.ondassp.domain.wave;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WaveDataRepository extends JpaRepository<WaveData, Long> {

    List<WaveData> findByForecastDateOrderByForecastTimeAsc(LocalDate forecastDate);
}
