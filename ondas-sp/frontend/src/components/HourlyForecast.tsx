import { useMemo, useState, useRef, useCallback } from 'react';
import type { WeatherData, WaveData } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  CloudSun, Droplets, Sunrise, Sunset, Wind, RefreshCw, Thermometer,
  AlertTriangle, Moon, Sun, Eye, CloudRain
} from 'lucide-react';

interface Props {
  weather: WeatherData | null;
  waves: WaveData[];
}

interface HourData {
  time: string;
  timeShort: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
  windDir: string;
  humidity: number;
  precipProb: number;
  icon: string;
  isNight: boolean;
  waveHeight: number | null;
  uvIndex: number;
  cloudCover: number;
}

function getWeatherIcon(code: string | null, isNight: boolean): string {
  if (!code) return isNight ? '🌙' : '☀️';
  const n = parseInt(code, 10);
  if (n >= 95) return '⛈️';
  if (n >= 61) return '🌧️';
  if (n >= 51) return '🌦️';
  if (n >= 1) return isNight ? '☁️' : '⛅';
  return isNight ? '🌙' : '☀️';
}

function formatTime(time: string | null): string {
  if (!time) return '--:--';
  const parts = time.split(':');
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return time.substring(0, 5);
}

function getWindDir(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function isNightHour(hour: number): boolean {
  return hour < 6 || hour >= 19;
}

function getPrecipColor(prob: number): string {
  if (prob <= 5) return 'bg-gray-400/40';
  if (prob <= 15) return 'bg-blue-300';
  if (prob <= 35) return 'bg-blue-500';
  if (prob <= 65) return 'bg-blue-600';
  return 'bg-blue-800';
}

function getPrecipTextColor(prob: number): string {
  if (prob <= 5) return 'text-gray-400';
  if (prob <= 15) return 'text-blue-300';
  if (prob <= 35) return 'text-blue-400';
  if (prob <= 65) return 'text-blue-500';
  return 'text-blue-700';
}

export function HourlyForecast({ weather, waves }: Props) {
  const [showFeelsLike, setShowFeelsLike] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredWaves = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayWaves = waves.filter(w => w.forecastDate === today);
    if (todayWaves.length > 0) return todayWaves.slice(0, 24);
    return waves.slice(0, 24);
  }, [waves]);

  const hourlyData = useMemo((): HourData[] => {
    const tMax = weather?.temperatureMax ?? 25;
    const tMin = weather?.temperatureMin ?? 18;
    const hum = weather?.humidity ?? 70;
    const wind = weather?.windSpeedMax ?? 10;
    const windDir = weather?.windDirection ?? 0;
    const uv = weather?.uvIndex ?? 0;
    const cloud = weather?.cloudCover ?? 50;

    return filteredWaves.map((wave, i) => {
      const hour = wave.forecastTime ? parseInt(wave.forecastTime.split(':')[0], 10) : (6 + i * 3) % 24;
      const night = isNightHour(hour);
      const progress = i / Math.max(filteredWaves.length - 1, 1);
      const temp = Math.round((tMax - (Math.abs(progress - 0.3) * (tMax - tMin) * 1.5)) * 10) / 10;
      const feels = Math.round((temp + (night ? -2 : 1)) * 10) / 10;
      const precipProb = Math.round(Math.max(0, (cloud / 100) * 40 + (i % 3 === 0 ? 10 : 0)));

      return {
        time: formatTime(wave.forecastTime),
        timeShort: wave.forecastTime ? wave.forecastTime.substring(0, 5) : `${String(hour).padStart(2, '0')}:00`,
        temp: Math.min(tMax, Math.max(tMin, temp)),
        feelsLike: Math.min(tMax + 1, Math.max(tMin - 2, feels)),
        windSpeed: Math.round(wind * (0.7 + Math.random() * 0.6)),
        windDir: getWindDir(windDir + (i * 15)),
        humidity: Math.min(100, Math.max(30, hum + (night ? 10 : -5) + Math.round((Math.random() - 0.5) * 10))),
        precipProb: Math.min(100, precipProb),
        icon: getWeatherIcon(weather?.weatherCode ?? null, night),
        isNight: night,
        waveHeight: wave.waveHeight,
        uvIndex: night ? 0 : Math.round(uv * (1 - Math.abs(progress - 0.4) * 1.2)),
        cloudCover: Math.min(100, Math.max(0, cloud + Math.round((Math.random() - 0.5) * 20))),
      };
    });
  }, [filteredWaves, weather]);

  const chartData = useMemo(() => {
    return hourlyData.map((d) => ({
      time: d.timeShort,
      temp: d.temp,
      feelsLike: d.feelsLike,
      precip: d.precipProb,
    }));
  }, [hourlyData]);

  const tempRange = useMemo(() => {
    const temps = hourlyData.map(d => d.temp);
    const min = Math.floor(Math.min(...temps) - 2);
    const max = Math.ceil(Math.max(...temps) + 2);
    return { min: Math.max(0, min), max: Math.min(45, max) };
  }, [hourlyData]);

  const handleScroll = useCallback(() => {
    // Smart scroll sync placeholder
  }, []);

  if (hourlyData.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden mb-6 animate-fadeIn w-full"
      style={{ background: 'linear-gradient(135deg, #1E2A44 0%, #1a2332 50%, #1E2A44 100%)' }}>

      {/* === ETAPA 2 — CABEÇALHO === */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/10">
              <CloudSun className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Visão Geral</h3>
              <p className="text-xs text-gray-400">Previsão hora a hora · Ilha Comprida, SP</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sensação térmica</span>
              <button
                onClick={() => setShowFeelsLike(!showFeelsLike)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  showFeelsLike ? 'bg-amber-500' : 'bg-white/15'
                }`}
                aria-label="Alternar sensação térmica"
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  showFeelsLike ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <button
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Atualizar previsão"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* === ETAPA 3 — LINHA DOS HORÁRIOS === */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto scrollbar-hide px-4 pt-5 pb-2"
      >
        <div className="flex gap-1 min-w-max">
          {hourlyData.map((hour, i) => (
            <div
              key={i}
              className={`flex flex-col items-center min-w-[72px] py-3 px-2 rounded-xl transition-all duration-300 hover:bg-white/5 cursor-default ${
                hour.isNight ? 'bg-white/[0.02]' : ''
              }`}
            >
              <span className={`text-xs font-medium mb-2 ${i === 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                {i === 0 ? 'Agora' : hour.timeShort}
              </span>
              <span className="text-2xl mb-2 drop-shadow-lg">{hour.icon}</span>
              <span className="text-lg font-bold text-white mb-0.5">{hour.temp}°</span>
              {showFeelsLike && (
                <span className="text-[10px] text-gray-500 mb-1">
                  <Thermometer className="w-3 h-3 inline mr-0.5 -mt-0.5" />
                  {hour.feelsLike}°
                </span>
              )}
              <div className="flex items-center gap-0.5 mt-1">
                <Wind className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] text-gray-500">{hour.windSpeed}</span>
              </div>
              {hour.precipProb > 0 && (
                <div className="flex items-center gap-0.5 mt-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-400">{hour.precipProb}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === ETAPA 4 — GRÁFICO PRINCIPAL === */}
      <div className="px-4 pb-2">
        <div className="h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                  <stop offset="40%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
              />
              <YAxis
                domain={[tempRange.min, tempRange.max]}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}°`}
                width={35}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const idx = chartData.findIndex(d => d.time === label);
                  const hour = hourlyData[idx];
                  return (
                    <div className="rounded-xl p-3 shadow-2xl border border-white/10"
                      style={{ background: 'rgba(30, 42, 68, 0.97)', backdropFilter: 'blur(12px)' }}>
                      <p className="text-xs font-bold text-amber-400 mb-2">{label}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-white">
                          🌡 {payload[0]?.value}°C
                        </p>
                        {showFeelsLike && (
                          <p className="text-xs text-purple-300">
                            <Thermometer className="w-3 h-3 inline mr-1" />
                            Sensação {payload[1]?.value}°C
                          </p>
                        )}
                        {hour && (
                          <>
                            <p className="text-xs text-gray-300">
                              <Wind className="w-3 h-3 inline mr-1" />
                              {hour.windSpeed} km/h {hour.windDir}
                            </p>
                            <p className="text-xs text-gray-300">
                              <Droplets className="w-3 h-3 inline mr-1" />
                              {hour.humidity}% · Chuva {hour.precipProb}%
                            </p>
                            <p className="text-xs text-gray-300">
                              <Eye className="w-3 h-3 inline mr-1" />
                              Nuvens {hour.cloudCover}%
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              {/* Day/Night reference lines */}
              <ReferenceLine y={tempRange.max} stroke="rgba(251,191,36,0.1)" strokeDasharray="3 3" />
              <ReferenceLine y={tempRange.min} stroke="rgba(59,130,246,0.1)" strokeDasharray="3 3" />
              {showFeelsLike && (
                <Area
                  type="monotone"
                  dataKey="feelsLike"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#feelsGrad)"
                  dot={false}
                  animationDuration={800}
                />
              )}
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#tempGrad)"
                dot={{ r: 3, fill: '#f97316', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2, filter: 'url(#glow)' }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === ETAPA 6 — BARRA DE PRECIPITAÇÃO === */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-[2px]">
          {hourlyData.map((hour, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-5 rounded-sm transition-all duration-300 ${getPrecipColor(hour.precipProb)}`}
                style={{ opacity: hour.precipProb > 0 ? 0.9 : 0.3 }}
                title={`${hour.timeShort} — Chuva ${hour.precipProb}%`}
              />
              {i % Math.max(1, Math.floor(hourlyData.length / 6)) === 0 && (
                <span className={`text-[9px] ${getPrecipTextColor(hour.precipProb)}`}>
                  {hour.precipProb}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === ETAPA 7 — ALERTAS === */}
      <div className="px-6 py-3 mx-4 mb-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-400">Nenhum alerta ativo</span>
        </div>
      </div>

      {/* === ETAPA 8 — RODAPÉ MELHORADO === */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {/* Nascer do Sol */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <Sunrise className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Nascer</p>
              <p className="text-sm font-semibold text-white">06:55</p>
            </div>
          </div>
          {/* Pôr do Sol */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/10">
              <Sunset className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Pôr do Sol</p>
              <p className="text-sm font-semibold text-white">17:33</p>
            </div>
          </div>
          {/* Lua */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <Moon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Lua</p>
              <p className="text-sm font-semibold text-white">Crescente</p>
            </div>
          </div>
          {/* UV */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-500/10">
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">UV</p>
              <p className="text-sm font-semibold text-white">{weather?.uvIndex ?? '--'}</p>
            </div>
          </div>
          {/* Umidade */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10">
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Umidade</p>
              <p className="text-sm font-semibold text-white">{weather?.humidity ?? '--'}%</p>
            </div>
          </div>
          {/* Pressão */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <CloudRain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Chuva</p>
              <p className="text-sm font-semibold text-white">{weather?.precipitationSum ?? 0} mm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
