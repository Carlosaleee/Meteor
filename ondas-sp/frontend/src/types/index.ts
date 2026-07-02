export interface WeatherData {
  id: number;
  forecastDate: string;
  fetchedAt: string;
  temperatureMax: number | null;
  temperatureMin: number | null;
  temperatureMean: number | null;
  precipitationSum: number | null;
  windSpeedMax: number | null;
  windDirection: number | null;
  cloudCover: number | null;
  humidity: number | null;
  uvIndex: number | null;
  weatherCode: string | null;
}

export interface WaveData {
  id: number;
  forecastDate: string;
  forecastTime: string;
  fetchedAt: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  swellDirection: number | null;
  windWaveHeight: number | null;
  windWavePeriod: number | null;
}

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
}

export interface SurfScore {
  date: string;
  bestTime: string;
  score: number;
  level: string;
  recommendation: string;
}

export interface SurfSummary {
  date: string;
  weatherSummary: string;
  waveSummary: string;
  fullSummary: string;
  bestTimeToSurf: string;
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  waveType: string;
}
