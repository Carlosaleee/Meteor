import { useState, useEffect, useCallback } from 'react';
import { brazilStates } from '../data/brazilStates';

export interface StateWeather {
  stateCode: string;
  temperature: number | null;
  temperatureMax: number | null;
  temperatureMin: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  weatherCode: number | null;
  cloudCover: number | null;
  pressure: number | null;
  uvIndex: number | null;
  visibility: number | null;
  loading: boolean;
  error: string | null;
}

function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'Céu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 49) return 'Nevoeiro';
  if (code <= 59) return 'Chuva leve';
  if (code <= 69) return 'Chuva';
  if (code <= 79) return 'Neve';
  if (code <= 82) return 'Chuva torrencial';
  if (code <= 86) return 'Neve forte';
  if (code <= 99) return 'Tempestade';
  return 'Desconhecido';
}

function getWindDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export { weatherCodeToDescription, getWindDirectionLabel };

export function useNationalWeather() {
  const [weatherMap, setWeatherMap] = useState<Record<string, StateWeather>>({});
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    setLoading(true);

    const results: Record<string, StateWeather> = {};

    // Initialize all states as loading
    brazilStates.forEach(state => {
      results[state.code] = {
        stateCode: state.code,
        temperature: null,
        temperatureMax: null,
        temperatureMin: null,
        humidity: null,
        windSpeed: null,
        windDirection: null,
        weatherCode: null,
        cloudCover: null,
        pressure: null,
        uvIndex: null,
        visibility: null,
        loading: true,
        error: null,
      };
    });
    setWeatherMap({ ...results });

    // Fetch in batches of 5 to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < brazilStates.length; i += batchSize) {
      const batch = brazilStates.slice(i, i + batchSize);
      const promises = batch.map(async (state) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover,pressure_msl,uv_index&daily=temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo&forecast_days=1`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          const current = data.current;
          const daily = data.daily;

          results[state.code] = {
            stateCode: state.code,
            temperature: current?.temperature_2m ?? null,
            temperatureMax: daily?.temperature_2m_max?.[0] ?? null,
            temperatureMin: daily?.temperature_2m_min?.[0] ?? null,
            humidity: current?.relative_humidity_2m ?? null,
            windSpeed: current?.wind_speed_10m ?? null,
            windDirection: current?.wind_direction_10m ?? null,
            weatherCode: current?.weather_code ?? null,
            cloudCover: current?.cloud_cover ?? null,
            pressure: current?.pressure_msl ?? null,
            uvIndex: current?.uv_index ?? null,
            visibility: 10,
            loading: false,
            error: null,
          };
        } catch (err) {
          results[state.code] = {
            ...results[state.code],
            loading: false,
            error: 'Erro ao carregar dados',
          };
        }
      });

      await Promise.all(promises);
      setWeatherMap({ ...results });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weatherMap, loading, refetch: fetchWeather };
}
