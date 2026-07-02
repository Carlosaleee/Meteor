import type { WeatherData, WaveData, HealthStatus, SurfScore, SurfSummary, Spot } from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);
  if (response.status === 204) return null as T;
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

async function postJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, { method: 'POST' });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export const api = {
  health: () => fetchJson<HealthStatus>('/health'),
  sync: () => postJson<{ success: boolean; message?: string; error?: string }>('/sync'),
  weatherCurrent: () => fetchJson<WeatherData>('/weather/current'),
  weatherHourly: (date: string) => fetchJson<WeatherData[]>(`/weather/hourly?date=${date}`),
  wavesCurrent: () => fetchJson<WaveData[]>('/waves/current'),
  wavesHourly: (date: string) => fetchJson<WaveData[]>(`/waves/hourly?date=${date}`),
  surfScore: (date?: string) => fetchJson<SurfScore>(`/surf/score${date ? `?date=${date}` : ''}`),
  surfSummary: (date?: string) => fetchJson<SurfSummary>(`/surf/summary${date ? `?date=${date}` : ''}`),
  spots: () => fetchJson<Spot[]>('/spots'),
};
