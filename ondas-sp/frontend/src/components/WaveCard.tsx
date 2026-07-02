import type { WaveData } from '../types';
import { Waves, ArrowUp, Anchor, Clock } from 'lucide-react';

interface Props { data: WaveData[]; }

function getWaveQuality(height: number | null): { text: string; color: string; bg: string } {
  if (height == null) return { text: 'Sem dados', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
  if (height < 0.5) return { text: 'Flat', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' };
  if (height < 1.0) return { text: 'Pequena', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' };
  if (height < 1.5) return { text: 'Boa', color: 'text-ocean-500', bg: 'bg-ocean-50 dark:bg-ocean-900/30' };
  if (height < 2.0) return { text: 'Média', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' };
  if (height < 3.0) return { text: 'Boa!', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
  return { text: 'Grande', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' };
}

function getSwellDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export function WaveCard({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Waves className="w-6 h-6 text-ocean-500" /> Ondas
        </h2>
        <div className="text-center py-8">
          <Waves className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-400 dark:text-gray-500">Sem dados de ondas disponíveis</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Clique em sincronizar para buscar dados</p>
        </div>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const quality = getWaveQuality(latest.waveHeight);
  const hoursWithWaves = data.filter(d => d.waveHeight != null && d.waveHeight > 0.5).length;

  return (
    <div className="glass-card-hover rounded-2xl p-6 group bg-gradient-to-br from-white/70 to-ocean-50/50 dark:from-gray-800/70 dark:to-gray-800/50 flex flex-col flex-1" role="region" aria-label="Previsão de ondas">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Waves className="w-6 h-6 text-ocean-500 group-hover:animate-bounce" /> Ondas
        </h2>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${quality.bg} ${quality.color}`}>
          {quality.text}
        </span>
      </div>

      <div className="text-center mb-6 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Waves className="w-40 h-40 text-ocean-500" />
        </div>
        <div className="relative">
          <p className="text-6xl font-extrabold text-ocean-600 dark:text-ocean-400 group-hover:scale-105 transition-transform duration-300">
            {latest.waveHeight != null ? `${latest.waveHeight}` : '--'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">metros</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
          <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Período
          </p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {latest.wavePeriod != null ? `${latest.wavePeriod}s` : '--'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/50">
          <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
            <ArrowUp className="w-3 h-3" /> Direção
          </p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {latest.waveDirection != null ? `${latest.waveDirection}°` : '--'}
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-ocean-50/80 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Anchor className="w-4 h-4 text-ocean-500" />
          <span className="text-xs font-semibold text-ocean-700 dark:text-ocean-300">Swell</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">Altura</p>
            <p className="font-bold text-gray-800 dark:text-white">
              {latest.swellHeight != null ? `${latest.swellHeight}m` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Período</p>
            <p className="font-bold text-gray-800 dark:text-white">
              {latest.swellPeriod != null ? `${latest.swellPeriod}s` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Direção</p>
            <p className="font-bold text-gray-800 dark:text-white">
              {getSwellDirection(latest.swellDirection)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>{data.length} registros hoje</span>
        <span>{hoursWithWaves}h com ondas</span>
      </div>
    </div>
  );
}
