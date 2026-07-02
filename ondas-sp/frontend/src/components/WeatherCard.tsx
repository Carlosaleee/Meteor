import type { WeatherData } from '../types';
import { Thermometer, Droplets, Wind, Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';

interface Props { data: WeatherData; }

function getWeatherIcon(code: string | null): { icon: React.ReactNode; color: string } {
  if (!code) return { icon: <Cloud className="w-10 h-10" />, color: 'text-gray-400' };
  const n = parseInt(code, 10);
  if (n >= 95) return { icon: <CloudLightning className="w-10 h-10" />, color: 'text-purple-500' };
  if (n >= 61) return { icon: <CloudRain className="w-10 h-10" />, color: 'text-blue-500' };
  if (n >= 51) return { icon: <CloudRain className="w-10 h-10" />, color: 'text-blue-400' };
  if (n >= 1) return { icon: <Cloud className="w-10 h-10" />, color: 'text-gray-400' };
  return { icon: <Sun className="w-10 h-10" />, color: 'text-yellow-500' };
}

function getWeatherDescription(code: string | null): string {
  if (!code) return 'Sem dados';
  const n = parseInt(code, 10);
  const map: Record<number, string> = {
    0: 'Céu limpo', 1: 'Principalmente limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Nevoeiro', 48: 'Nevoeiro com geada', 51: 'Chuvisco leve', 53: 'Chuvisco moderado',
    55: 'Chuvisco denso', 61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
    80: 'Pancadas de chuva', 95: 'Tempestade',
  };
  return map[n] || `Código ${code}`;
}

function getWindDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getUvLevel(uv: number | null): { text: string; color: string } {
  if (uv == null) return { text: '--', color: 'text-gray-500' };
  if (uv <= 2) return { text: 'Baixo', color: 'text-green-500' };
  if (uv <= 5) return { text: 'Moderado', color: 'text-yellow-500' };
  if (uv <= 7) return { text: 'Alto', color: 'text-orange-500' };
  return { text: 'Muito Alto', color: 'text-red-500' };
}

export function WeatherCard({ data }: Props) {
  const weather = getWeatherIcon(data.weatherCode);
  const uv = getUvLevel(data.uvIndex);

  return (
    <div className="glass-card-hover rounded-2xl p-6 group flex flex-col flex-1" role="region" aria-label="Previsão do tempo detalhada">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Previsão do Tempo</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(data.forecastDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`${weather.color} group-hover:scale-110 transition-transform duration-300`}>
          {weather.icon}
        </div>
        <div>
          <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {data.temperatureMean != null ? `${data.temperatureMean}°` : '--'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getWeatherDescription(data.weatherCode)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem icon={<Thermometer className="w-4 h-4 text-red-500" />} label="Máx" value={data.temperatureMax != null ? `${data.temperatureMax}°` : '--'} />
        <StatItem icon={<Thermometer className="w-4 h-4 text-blue-500" />} label="Mín" value={data.temperatureMin != null ? `${data.temperatureMin}°` : '--'} />
        <StatItem icon={<Droplets className="w-4 h-4 text-blue-400" />} label="Umidade" value={data.humidity != null ? `${data.humidity}%` : '--'} />
        <StatItem icon={<Wind className="w-4 h-4 text-teal-500" />} label={`Vento ${getWindDirection(data.windDirection)}`} value={data.windSpeedMax != null ? `${data.windSpeedMax} km/h` : '--'} />
        <StatItem icon={<Cloud className="w-4 h-4 text-gray-400" />} label="Nuvens" value={data.cloudCover != null ? `${data.cloudCover}%` : '--'} />
        <StatItem icon={<Sun className="w-4 h-4 text-yellow-500" />} label={`UV ${uv.text}`} value={data.uvIndex != null ? `${data.uvIndex}` : '--'} valueClass={uv.color} />
        <StatItem icon={<CloudRain className="w-4 h-4 text-blue-300" />} label="Precipitação" value={data.precipitationSum != null ? `${data.precipitationSum}mm` : '--'} />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700 transition-colors">
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className={`text-sm font-bold text-gray-800 dark:text-white ${valueClass || ''}`}>{value}</p>
      </div>
    </div>
  );
}
