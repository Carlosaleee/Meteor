import { useState, useMemo } from 'react';
import type { WeatherData, WaveData } from '../types';

import { Waves, Wind, Thermometer, Clock, Anchor, Navigation, Search, X } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
  waves: WaveData[];
}

function getWindDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getSwellDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getWaveColor(height: number | null): string {
  if (height == null) return 'bg-gray-100 dark:bg-gray-800';
  if (height < 0.5) return 'bg-blue-100 dark:bg-blue-900/30';
  if (height < 1.0) return 'bg-blue-200 dark:bg-blue-800/40';
  if (height < 1.5) return 'bg-cyan-200 dark:bg-cyan-800/40';
  if (height < 2.0) return 'bg-teal-200 dark:bg-teal-800/40';
  if (height < 2.5) return 'bg-green-200 dark:bg-green-800/40';
  return 'bg-yellow-200 dark:bg-yellow-800/40';
}

function getWaveBarWidth(height: number | null): string {
  if (height == null) return '0%';
  const pct = Math.min((height / 3) * 100, 100);
  return `${pct}%`;
}

function getWeatherEmoji(code: string | null): string {
  if (!code) return '🌤️';
  const n = parseInt(code, 10);
  if (n >= 95) return '⛈️';
  if (n >= 61) return '🌧️';
  if (n >= 51) return '🌦️';
  if (n >= 1) return '⛅';
  return '☀️';
}

function format_time(time: string | null): string {
  if (!time) return '--:--';
  return time.substring(0, 5);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function ForecastTable({ weather, waves }: Props) {
  const [search, setSearch] = useState('');

  const groupedByDate: Record<string, WaveData[]> = useMemo(() => {
    const grouped: Record<string, WaveData[]> = {};
    waves.forEach((w) => {
      const dateKey = w.forecastDate;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(w);
    });
    return grouped;
  }, [waves]);

  const dates = useMemo(() => Object.keys(groupedByDate).sort(), [groupedByDate]);

  const filteredDates = useMemo(() => {
    if (!search.trim()) return dates;
    const q = search.trim().toLowerCase();
    return dates.filter((date) => {
      const dayWaves = groupedByDate[date];
      return dayWaves.some((wave) => {
        const dateLabel = formatDate(date).toLowerCase();
        const timeLabel = format_time(wave.forecastTime).toLowerCase();
        return dateLabel.includes(q) || timeLabel.includes(q) || date.includes(q);
      });
    });
  }, [dates, search, groupedByDate]);

  const filteredWaves = useMemo(() => {
    if (!search.trim()) return waves;
    const q = search.trim().toLowerCase();
    return waves.filter((wave) => {
      const dateLabel = formatDate(wave.forecastDate).toLowerCase();
      const timeLabel = format_time(wave.forecastTime).toLowerCase();
      return dateLabel.includes(q) || timeLabel.includes(q) || wave.forecastDate.includes(q);
    });
  }, [waves, search]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden" role="region" aria-label="Tabela de previsão detalhada de ondas">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-600 to-cyan-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Previsão Detalhada</h3>
              <p className="text-xs text-white/70">Ilha Comprida, SP — {filteredWaves.length} registros</p>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Buscar por data ou hora..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white/15 text-white placeholder-white/50 text-sm rounded-lg border border-white/20 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 w-56 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table with fixed height and scrollbar — 3 visible rows */}
      <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Data/Hora
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Waves className="w-3 h-3" /> Onda
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Anchor className="w-3 h-3" /> Swell
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3" /> Vento
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Thermometer className="w-3 h-3" /> Temp
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tempo
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((date) => {
              const dayWaves = groupedByDate[date];
              const filteredDayWaves = search.trim()
                ? dayWaves.filter((wave) => {
                    const timeLabel = format_time(wave.forecastTime).toLowerCase();
                    return timeLabel.includes(search.trim().toLowerCase()) || date.includes(search.trim().toLowerCase());
                  })
                : dayWaves;

              return filteredDayWaves.map((wave, idx) => (
                <tr
                  key={`${date}-${idx}`}
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 transition-colors ${
                    idx === 0 ? 'bg-gray-50 dark:bg-gray-800/30' : ''
                  }`}
                >
                  {/* Date/Time */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {idx === 0 ? (
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white text-xs">
                          {formatDate(date)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                          {format_time(wave.forecastTime)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs ml-0.5">
                        {format_time(wave.forecastTime)}
                      </span>
                    )}
                  </td>

                  {/* Wave Height + Bar */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-bold text-sm ${getWaveColor(wave.waveHeight)} px-2 py-0.5 rounded`}>
                        {wave.waveHeight != null ? `${wave.waveHeight}m` : '--'}
                      </span>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: getWaveBarWidth(wave.waveHeight) }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {wave.wavePeriod != null ? `${wave.wavePeriod}s` : '--'}
                      </span>
                    </div>
                  </td>

                  {/* Swell */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        {wave.swellHeight != null ? `${wave.swellHeight}m` : '--'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                        <Navigation
                          className="w-3 h-3 inline-block"
                          style={{ transform: `rotate(${wave.swellDirection ?? 0}deg)` }}
                        />
                        {getSwellDirection(wave.swellDirection)}
                        <span>·</span>
                        {wave.swellPeriod != null ? `${wave.swellPeriod}s` : '--'}
                      </div>
                    </div>
                  </td>

                  {/* Wind */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        {weather?.windSpeedMax != null ? `${weather.windSpeedMax}` : '--'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                        <Navigation
                          className="w-3 h-3 inline-block"
                          style={{ transform: `rotate(${weather?.windDirection ?? 0}deg)` }}
                        />
                        {getWindDirection(weather?.windDirection ?? null)}
                        <span>km/h</span>
                      </div>
                    </div>
                  </td>

                  {/* Temperature */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      {weather?.temperatureMax != null ? `${weather.temperatureMax}°` : '--'}
                    </span>
                  </td>

                  {/* Weather Icon */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xl">{getWeatherEmoji(weather?.weatherCode ?? null)}</span>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="font-medium uppercase tracking-wider">Legenda Onda:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30" /> &lt;0.5m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800/40" /> 0.5-1.0m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-cyan-200 dark:bg-cyan-800/40" /> 1.0-1.5m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-teal-200 dark:bg-teal-800/40" /> 1.5-2.0m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-800/40" /> 2.0-2.5m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-200 dark:bg-yellow-800/40" /> &gt;2.5m
          </span>
        </div>
      </div>
    </div>
  );
}
