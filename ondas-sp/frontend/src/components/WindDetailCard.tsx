import type { WeatherData } from '../types';
import { Wind, Navigation, Compass, Sailboat, Wind as WindIcon } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
}

function getWindDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getWindLevel(speed: number | null): { label: string; color: string; bg: string; sports: string } {
  if (speed == null) return { label: 'Sem dados', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700', sports: '--' };
  if (speed < 5) return { label: 'Calmo', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', sports: 'Caiaque, Stand-up' };
  if (speed < 15) return { label: 'Leve', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', sports: 'Surf, Windsurf, SUP' };
  if (speed < 25) return { label: 'Moderado', color: 'text-ocean-500', bg: 'bg-ocean-50 dark:bg-ocean-900/30', sports: 'Windsurf, Kitesurf' };
  if (speed < 40) return { label: 'Forte', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', sports: 'Kitesurf (experiente)' };
  return { label: 'Muito Forte', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', sports: 'Não recomendado' };
}

function getBeaufortScale(speed: number | null): string {
  if (speed == null) return '--';
  if (speed < 1) return '0 - Calmo';
  if (speed < 6) return '1-2 - Brisa leve';
  if (speed < 12) return '3 - Brisa suave';
  if (speed < 20) return '4 - Brisa moderada';
  if (speed < 29) return '5 - Brisa fresca';
  if (speed < 39) return '6 - Brisa forte';
  if (speed < 50) return '7 - Vento forte';
  if (speed < 62) return '8-9 - Vendaval';
  return '10+ - Tempestade';
}

export function WindDetailCard({ weather }: Props) {
  const windSpeed = weather?.windSpeedMax ?? null;
  const windDir = weather?.windDirection ?? null;
  const level = getWindLevel(windSpeed);

  return (
    <div className="glass-card-hover rounded-2xl p-6 bg-gradient-to-br from-white/70 to-cyan-50/50 dark:from-gray-800/70 dark:to-cyan-900/20 group flex flex-col flex-1" role="region" aria-label="Vento para esportes aquáticos">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Wind className="w-5 h-5 text-cyan-500 group-hover:animate-bounce" /> Vento para Esportes
        </h2>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${level.bg} ${level.color}`}>
          {level.label}
        </span>
      </div>

      {/* Main wind display */}
      <div className="text-center mb-5 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Compass className="w-32 h-32 text-cyan-500" style={{ transform: `rotate(${windDir ?? 0}deg)` }} />
        </div>
        <div className="relative">
          <p className="text-5xl font-extrabold text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
            {windSpeed != null ? `${windSpeed}` : '--'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">km/h</p>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Navigation
            className="w-4 h-4 text-cyan-500"
            style={{ transform: `rotate(${windDir ?? 0}deg)` }}
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {getWindDirection(windDir)} ({windDir != null ? `${windDir}°` : '--'})
          </span>
        </div>
      </div>

      {/* Beaufort scale */}
      <div className="p-3 rounded-xl bg-cyan-50/80 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/30 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <WindIcon className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Escala Beaufort</span>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{getBeaufortScale(windSpeed)}</p>
      </div>

      {/* Sports recommendation */}
      <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sailboat className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Esportes Recomendados</span>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">{level.sports}</p>
      </div>

      {/* Wind details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Rajada</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {windSpeed != null ? `${Math.round(windSpeed * 1.3)} km/h` : '--'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Condição</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {windSpeed != null && windSpeed < 20 ? 'Favorável' : windSpeed != null ? 'Cuidado' : '--'}
          </p>
        </div>
      </div>
    </div>
  );
}
