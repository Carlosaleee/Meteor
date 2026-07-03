import { X, Thermometer, Droplets, Wind, Eye, Cloud, Sun, MapPin, Activity, Compass, AlertTriangle } from 'lucide-react';
import type { StateWeather } from '../hooks/useNationalWeather';
import { weatherCodeToDescription, getWindDirectionLabel } from '../hooks/useNationalWeather';
import { brazilStates } from '../data/brazilStates';

interface StatePanelProps {
  state: { id: string; name: string };
  onClose: () => void;
  weather?: StateWeather;
  dark: boolean;
}

function getWeatherEmoji(code: number | null): string {
  if (code == null) return '🌡️';
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌦️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function getUVLevel(uv: number | null): { label: string; color: string } {
  if (uv == null) return { label: '--', color: 'text-gray-400' };
  if (uv <= 2) return { label: 'Baixo', color: 'text-green-500' };
  if (uv <= 5) return { label: 'Moderado', color: 'text-amber-500' };
  if (uv <= 7) return { label: 'Alto', color: 'text-orange-500' };
  if (uv <= 10) return { label: 'Muito Alto', color: 'text-red-500' };
  return { label: 'Extremo', color: 'text-purple-500' };
}

export function StatePanel({ state, onClose, weather, dark }: StatePanelProps) {
  const stateInfo = brazilStates.find(s => s.code === state.id);

  const panelBg = dark
    ? 'bg-gradient-to-br from-[#1E2A44] to-[#2B3A55] border-gray-700/50'
    : 'bg-white border-gray-200 shadow-xl';
  const headerBg = dark
    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-gray-700/30'
    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-gray-200/50';
  const cellBg = dark
    ? 'bg-gray-800/40 border-gray-700/30'
    : 'bg-gray-50 border-gray-200/60';
  const textPrimary = dark ? 'text-white' : 'text-gray-900';
  const textSecondary = dark ? 'text-gray-400' : 'text-gray-500';

  const temp = weather?.temperature;
  const humidity = weather?.humidity;
  const windSpeed = weather?.windSpeed;
  const windDir = weather?.windDirection != null ? getWindDirectionLabel(weather.windDirection) : '--';
  const description = weather?.weatherCode != null ? weatherCodeToDescription(weather.weatherCode) : 'Sem dados';
  const emoji = getWeatherEmoji(weather?.weatherCode ?? null);
  const uvLevel = getUVLevel(weather?.uvIndex ?? null);
  const pressure = weather?.pressure;

  return (
    <div className="w-80 shrink-0 animate-slideIn">
      <div className={`${panelBg} rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-300`}>
        {/* Header */}
        <div className={`${headerBg} p-4 border-b transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`${textPrimary} font-bold`}>{state.name}</h3>
                <p className="text-amber-600 dark:text-amber-300/80 text-xs">
                  {stateInfo?.capital} — Detalhes meteorológicos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-gray-700/50 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weather Details */}
        <div className="p-4 space-y-3">
          {/* Loading state */}
          {weather?.loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          )}

          {/* Error state */}
          {weather?.error && (
            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm">{weather.error}</p>
            </div>
          )}

          {/* Weather data */}
          {!weather?.loading && !weather?.error && (
            <>
              {/* Condition */}
              <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className={`w-4 h-4 ${textSecondary}`} />
                    <span className={`text-xs ${textSecondary}`}>Condição</span>
                  </div>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <p className={`${textPrimary} font-semibold text-sm mt-1`}>{description}</p>
              </div>

              {/* Temperature */}
              <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      <span className={`text-xs ${textSecondary}`}>Temperatura</span>
                    </div>
                    <p className={`${textPrimary} font-bold text-2xl`}>
                      {temp != null ? `${Math.round(temp)}°C` : '--'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${textSecondary}`}>Máx/Mín</p>
                    <p className={`${textPrimary} font-semibold text-sm`}>
                      {weather?.temperatureMax != null ? `${Math.round(weather.temperatureMax)}°` : '--'} / {weather?.temperatureMin != null ? `${Math.round(weather.temperatureMin)}°` : '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className={`text-xs ${textSecondary}`}>Umidade</span>
                  </div>
                  <p className={`${textPrimary} font-bold text-lg`}>
                    {humidity != null ? `${humidity}%` : '--'}
                  </p>
                </div>
                <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className={`text-xs ${textSecondary}`}>UV</span>
                  </div>
                  <p className={`${textPrimary} font-bold text-lg`}>
                    {weather?.uvIndex != null ? weather.uvIndex.toFixed(1) : '--'}
                  </p>
                  <p className={`text-xs ${uvLevel.color} mt-0.5`}>{uvLevel.label}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span className={`text-xs ${textSecondary}`}>Vento</span>
                  </div>
                  <p className={`${textPrimary} font-bold text-sm`}>
                    {windSpeed != null ? `${Math.round(windSpeed)} km/h` : '--'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Compass className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${textSecondary}`}>{windDir}</span>
                  </div>
                </div>
                <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span className={`text-xs ${textSecondary}`}>Pressão</span>
                  </div>
                  <p className={`${textPrimary} font-semibold text-sm`}>
                    {pressure != null ? `${Math.round(pressure)} hPa` : '--'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className={`${cellBg} rounded-xl p-3 border transition-colors duration-300`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Eye className="w-3 h-3 text-green-400" />
                    <span className={`text-xs ${textSecondary}`}>Nebulosidade</span>
                  </div>
                  <p className={`${textPrimary} font-semibold text-sm`}>
                    {weather?.cloudCover != null ? `${weather.cloudCover}%` : '--'}
                  </p>
                </div>
              </div>

              {/* Alerts based on weather */}
              {weather?.weatherCode != null && weather.weatherCode >= 95 && (
                <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">Alerta de Tempestade</span>
                  </div>
                  <p className="text-red-300/80 text-xs mt-1">Condições adversas detectadas na região</p>
                </div>
              )}
              {weather?.temperature != null && weather.temperature >= 35 && (
                <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-xs font-medium">Alerta de Calor</span>
                  </div>
                  <p className="text-orange-300/80 text-xs mt-1">Temperatura elevada, hidrate-se</p>
                </div>
              )}
              {weather?.weatherCode != null && weather.weatherCode >= 50 && weather.weatherCode < 95 && (
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-xs font-medium">Precipitação</span>
                  </div>
                  <p className="text-blue-300/80 text-xs mt-1">Chuva prevista na região</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
