import { useMemo } from 'react';
import type { WeatherData, WaveData } from '../types';
import { Sun, CloudSun } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
  waves: WaveData[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

function getTodayStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getDayLabel(dateStr: string): string {
  const today = getTodayStr();
  if (dateStr === today) return 'Hoje';
  const date = new Date(dateStr + 'T12:00:00');
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  return days[date.getDay()];
}

function getDayNumber(dateStr: string): number {
  const date = new Date(dateStr + 'T12:00:00');
  return date.getDate();
}

export function DayForecastCards({ weather, waves, selectedDate, onSelectDate }: Props) {
  const dates = useMemo(() => {
    const today = getTodayStr();
    const uniqueDates = [...new Set(waves.map(w => w.forecastDate))].sort();
    return uniqueDates.filter(d => d >= today);
  }, [waves]);

  if (dates.length === 0) return null;

  return (
    <div className="mb-6 animate-fadeIn">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {dates.slice(0, 7).map((date) => {
          const isSelected = selectedDate === date;
          const isToday = date === getTodayStr();
          
          return (
            <button
              key={date}
              onClick={() => onSelectDate(isSelected ? null : date)}
              className={`flex-shrink-0 rounded-2xl p-4 min-w-[140px] transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-ocean-500 to-cyan-500 shadow-lg shadow-ocean-500/30 scale-[1.02]'
                  : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 hover:from-gray-600/80 hover:to-gray-700/80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-white">{getDayNumber(date)}</span>
                <span className="text-xs text-white/70 uppercase">{getDayLabel(date)}</span>
              </div>
              
              <div className="flex justify-center mb-3">
                {isToday ? (
                  <Sun className="w-8 h-8 text-yellow-300" />
                ) : (
                  <CloudSun className="w-8 h-8 text-white/80" />
                )}
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{weather?.temperatureMax ?? '--'}°</p>
                  <p className="text-[10px] text-white/60 uppercase">Máx</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-xl font-bold text-white/70">{weather?.temperatureMin ?? '--'}°</p>
                  <p className="text-[10px] text-white/60 uppercase">Mín</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
