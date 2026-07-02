import type { WaveData } from '../types';
import { Waves } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props { data: WaveData[]; }

export function WaveChart({ data }: Props) {
  if (data.length === 0) return null;

  const chartData = data
    .filter(d => d.waveHeight != null)
    .map(d => ({
      time: d.forecastTime ? d.forecastTime.slice(0, 5) : '--',
      'Altura da Onda': d.waveHeight,
      'Swell': d.swellHeight,
      'Período': d.wavePeriod,
    }));

  if (chartData.length === 0) return null;

  const maxWave = Math.max(...chartData.map(d => d['Altura da Onda'] || 0));
  const maxSwell = Math.max(...chartData.map(d => d['Swell'] || 0));
  const yMax = Math.ceil(Math.max(maxWave, maxSwell) * 1.2 * 10) / 10;

  return (
    <div className="glass-card-hover rounded-2xl p-6" role="img" aria-label="Gráfico de evolução das ondas">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
        <Waves className="w-6 h-6 text-ocean-500" /> Previsão Horária — Ondas
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Altura das Ondas (m)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="swellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, yMax]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px',
                  backdropFilter: 'blur(8px)',
                }}
                formatter={(value: number, name: string) => [`${value}m`, name]}
              />
              <Area type="monotone" dataKey="Swell" stroke="#8b5cf6" strokeWidth={2} fill="url(#swellGradient)" />
              <Area type="monotone" dataKey="Altura da Onda" stroke="#0ea5e9" strokeWidth={2} fill="url(#waveGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Período (s)</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '12px',
                  backdropFilter: 'blur(8px)',
                }}
                formatter={(value: number) => [`${value}s`, 'Período']}
              />
              <Bar dataKey="Período" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-ocean-500" />
          <span>Onda</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Swell</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span>Período</span>
        </div>
      </div>
    </div>
  );
}
