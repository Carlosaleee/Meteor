import { useMemo } from 'react';
import type { WeatherData } from '../types';
import { Wind, Navigation, Compass, Gauge, Waves, Anchor, ArrowUp } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
}

function getWindDir(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getBeaufort(speed: number | null): { scale: number; label: string; color: string } {
  if (speed == null) return { scale: 0, label: 'Sem dados', color: 'text-gray-400' };
  if (speed < 1) return { scale: 0, label: 'Calmo', color: 'text-gray-400' };
  if (speed < 6) return { scale: 1, label: 'Brisa leve', color: 'text-green-400' };
  if (speed < 12) return { scale: 2, label: 'Brisa suave', color: 'text-green-400' };
  if (speed < 20) return { scale: 3, label: 'Brisa moderada', color: 'text-yellow-400' };
  if (speed < 29) return { scale: 4, label: 'Brisa fresca', color: 'text-amber-400' };
  if (speed < 39) return { scale: 5, label: 'Vento moderado', color: 'text-orange-400' };
  if (speed < 50) return { scale: 6, label: 'Vento forte', color: 'text-red-400' };
  return { scale: 7, label: 'Vento muito forte', color: 'text-red-500' };
}

function getWindCondition(speed: number | null): { label: string; color: string; bg: string } {
  if (speed == null) return { label: 'Sem dados', color: 'text-gray-400', bg: 'bg-gray-500/10' };
  if (speed < 10) return { label: 'Favorável', color: 'text-green-400', bg: 'bg-green-500/10' };
  if (speed < 20) return { label: 'Bom', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (speed < 30) return { label: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
  return { label: 'Desfavorável', color: 'text-red-400', bg: 'bg-red-500/10' };
}

function getSports(speed: number | null): string[] {
  if (speed == null) return [];
  if (speed < 10) return ['Surf', 'SUP', 'Stand Up Paddle'];
  if (speed < 20) return ['Surf', 'Windsurf', 'Kitesurf'];
  if (speed < 30) return ['Windsurf', 'Kitesurf', 'Vela'];
  return ['Kitesurf', 'Vela'];
}

export function WindSessionCard({ weather }: Props) {
  const windSpeed = weather?.windSpeedMax ?? null;
  const windDir = weather?.windDirection ?? null;
  const beaufort = useMemo(() => getBeaufort(windSpeed), [windSpeed]);
  const condition = useMemo(() => getWindCondition(windSpeed), [windSpeed]);
  const sports = useMemo(() => getSports(windSpeed), [windSpeed]);

  const dirArrow = windDir != null ? windDir : 0;

  return (
    <div className="rounded-2xl overflow-hidden animate-fadeIn w-full"
      style={{ background: 'linear-gradient(135deg, #1E2A44 0%, #1a2332 50%, #1E2A44 100%)' }}>

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-400/20 to-green-500/20 border border-teal-400/10">
              <Wind className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Vento para Esportes</h3>
              <p className="text-xs text-gray-400">Condições atuais · Ilha Comprida, SP</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${condition.bg} ${condition.color}`}>
            {condition.label}
          </span>
        </div>
      </div>

      {/* Main wind display */}
      <div className="px-6 py-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Wind speed circle */}
          <div className="relative flex-shrink-0">
            <div className="w-40 h-40 rounded-full border-4 border-teal-500/20 flex items-center justify-center relative">
              {/* Animated ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(20,184,166,0.1)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="4"
                  strokeDasharray={`${(windSpeed ?? 0) / 60 * 289} 289`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-5xl font-extrabold text-white">{windSpeed ?? '--'}</span>
                <p className="text-sm text-gray-400 mt-1">km/h</p>
              </div>
            </div>
            {/* Direction indicator */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <div
                className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-teal-400 transition-transform duration-500"
                style={{ transform: `rotate(${dirArrow}deg)` }}
              />
            </div>
          </div>

          {/* Wind details */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Direction */}
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-teal-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Direção</span>
                </div>
                <p className="text-2xl font-bold text-white">{getWindDir(windDir)}</p>
                <p className="text-xs text-gray-500 mt-1">{windDir ?? '--'}°</p>
              </div>

              {/* Beaufort */}
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Beaufort</span>
                </div>
                <p className="text-2xl font-bold text-white">{beaufort.scale}</p>
                <p className={`text-xs mt-1 ${beaufort.color}`}>{beaufort.label}</p>
              </div>

              {/* Gust */}
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Rajada</span>
                </div>
                <p className="text-2xl font-bold text-white">{windSpeed ? Math.round(windSpeed * 1.3) : '--'}</p>
                <p className="text-xs text-gray-500 mt-1">km/h</p>
              </div>

              {/* Condition */}
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Condição</span>
                </div>
                <p className={`text-lg font-bold ${condition.color}`}>{condition.label}</p>
                <p className="text-xs text-gray-500 mt-1">para esportes</p>
              </div>
            </div>

            {/* Recommended sports */}
            {sports.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Anchor className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Esportes Recomendados</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sports.map((sport) => (
                    <span key={sport} className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-medium">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wind compass visualization */}
      <div className="px-6 pb-6">
        <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Compass circle */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  {/* Cardinal directions */}
                  <text x="50" y="12" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="bold">N</text>
                  <text x="90" y="54" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="bold">L</text>
                  <text x="50" y="96" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="bold">S</text>
                  <text x="10" y="54" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="bold">O</text>
                  {/* Wind direction arrow */}
                  <line
                    x1="50" y1="50"
                    x2={50 + 30 * Math.sin((dirArrow * Math.PI) / 180)}
                    y2={50 - 30 * Math.cos((dirArrow * Math.PI) / 180)}
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="4" fill="#14b8a6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Vento vindo de</p>
                <p className="text-xl font-bold text-white">{getWindDir(windDir)} ({dirArrow}°)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-500">Mar</span>
              </div>
              <p className="text-sm text-gray-300">
                {windSpeed && windSpeed < 15 ? 'Superfície calma' : 'Ondulações moderadas'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
