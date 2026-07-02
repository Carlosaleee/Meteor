import type { WeatherData, WaveData } from '../types';
import { Thermometer, Waves, Clock, Anchor, Wind, Sun, Droplets } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
  waves: WaveData[];
}

function getWindDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getUvLevel(uv: number | null): { text: string; color: string } {
  if (uv == null) return { text: '--', color: 'text-gray-500' };
  if (uv <= 2) return { text: 'Baixo', color: 'text-green-400' };
  if (uv <= 5) return { text: 'Moderado', color: 'text-yellow-400' };
  if (uv <= 7) return { text: 'Alto', color: 'text-orange-400' };
  return { text: 'Muito Alto', color: 'text-red-400' };
}

function getSwellDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export function KpiCards({ weather, waves }: Props) {
  const latestWave = waves.length > 0 ? waves[waves.length - 1] : null;
  const uv = getUvLevel(weather?.uvIndex ?? null);

  const kpis = [
    {
      icon: <Thermometer className="w-5 h-5 text-red-400" />,
      label: 'Temperatura Máx',
      value: weather?.temperatureMax != null ? `${weather.temperatureMax}°` : '--',
      color: 'from-red-500/20 to-orange-500/20',
    },
    {
      icon: <Thermometer className="w-5 h-5 text-blue-400" />,
      label: 'Temperatura Mín',
      value: weather?.temperatureMin != null ? `${weather.temperatureMin}°` : '--',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <Waves className="w-5 h-5 text-ocean-400" />,
      label: 'Altura Onda',
      value: latestWave?.waveHeight != null ? `${latestWave.waveHeight}m` : '--',
      color: 'from-ocean-500/20 to-cyan-500/20',
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      label: 'Período',
      value: latestWave?.wavePeriod != null ? `${latestWave.wavePeriod}s` : '--',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <Anchor className="w-5 h-5 text-indigo-400" />,
      label: 'Swell',
      value: latestWave?.swellHeight != null ? `${latestWave.swellHeight}m` : '--',
      sublabel: latestWave ? `${getSwellDirection(latestWave.swellDirection)} · ${latestWave.swellPeriod || '--'}s` : '',
      color: 'from-indigo-500/20 to-violet-500/20',
    },
    {
      icon: <Wind className="w-5 h-5 text-teal-400" />,
      label: 'Vento',
      value: weather?.windSpeedMax != null ? `${weather.windSpeedMax} km/h` : '--',
      sublabel: weather ? getWindDirection(weather.windDirection) : '',
      color: 'from-teal-500/20 to-green-500/20',
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-300" />,
      label: 'Umidade',
      value: weather?.humidity != null ? `${weather.humidity}%` : '--',
      color: 'from-blue-400/20 to-cyan-400/20',
    },
    {
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      label: 'UV',
      value: weather?.uvIndex != null ? `${weather.uvIndex}` : '--',
      sublabel: uv.text,
      color: 'from-yellow-500/20 to-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3" role="region" aria-label="Indicadores detalhados do clima e mar">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          role="status"
          aria-label={`${kpi.label}: ${kpi.value}${kpi.sublabel ? ', ' + kpi.sublabel : ''}`}
          className={`glass-card rounded-xl p-4 hover:scale-[1.03] transition-all duration-300 group bg-gradient-to-br ${kpi.color}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="group-hover:scale-110 transition-transform duration-300">{kpi.icon}</div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{kpi.label}</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-gray-800 dark:text-white">{kpi.value}</p>
          {kpi.sublabel && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{kpi.sublabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}
