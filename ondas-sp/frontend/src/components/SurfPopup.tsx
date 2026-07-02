import type { Spot } from '../types';
import { MapPin, Waves, Navigation, Route, Clock, Compass } from 'lucide-react';

interface Props {
  spot: Spot;
  onRoute?: () => void;
  hasUserPosition?: boolean;
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'iniciante': return 'text-emerald-600 dark:text-emerald-400';
    case 'intermediário': return 'text-amber-600 dark:text-amber-400';
    case 'avançado': return 'text-rose-600 dark:text-rose-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
}

function getDifficultyBg(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'iniciante': return 'bg-emerald-100 dark:bg-emerald-900/40';
    case 'intermediário': return 'bg-amber-100 dark:bg-amber-900/40';
    case 'avançado': return 'bg-rose-100 dark:bg-rose-900/40';
    default: return 'bg-gray-100 dark:bg-gray-700';
  }
}

export function SurfPopup({ spot, onRoute, hasUserPosition }: Props) {
  return (
    <div className="min-w-[240px] max-w-[300px] font-sans">
      <div className="flex items-start gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${getDifficultyBg(spot.difficulty)} shrink-0`}>
          <MapPin className={`w-4 h-4 ${getDifficultyColor(spot.difficulty)}`} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{spot.name}</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{spot.waveType}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{spot.description}</p>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getDifficultyBg(spot.difficulty)} ${getDifficultyColor(spot.difficulty)}`}>
          {spot.difficulty}
        </span>
        {spot.bestSeason && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {spot.bestSeason}
          </span>
        )}
      </div>

      {spot.tip && (
        <div className="p-2 rounded-lg bg-ocean-50/80 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/30 mb-3">
          <p className="text-[11px] text-ocean-700 dark:text-ocean-300 flex items-start gap-1.5">
            <Compass className="w-3 h-3 mt-0.5 shrink-0" />
            {spot.tip}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {hasUserPosition && onRoute && (
          <button onClick={onRoute}
            className="flex items-center gap-1 text-[11px] font-medium text-white bg-ocean-500 hover:bg-ocean-600 px-2.5 py-1.5 rounded-lg transition-colors">
            <Route className="w-3 h-3" /> Ver rota
          </button>
        )}
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 transition-colors">
          <Navigation className="w-3 h-3" /> Como chegar
        </a>
        <a href={`https://maps.google.com/maps?q=${spot.latitude},${spot.longitude}&z=14`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <Waves className="w-3 h-3" /> Ver no Maps
        </a>
      </div>
    </div>
  );
}
