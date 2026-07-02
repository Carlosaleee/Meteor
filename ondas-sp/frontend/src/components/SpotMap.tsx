import type { Spot } from '../types';
import { MapPin, Waves, Users, ArrowUpRight } from 'lucide-react';

interface Props {
  spots: Spot[];
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'iniciante':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    case 'intermediário':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    case 'avançado':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  }
}

export function SpotMap({ spots }: Props) {
  const mapCenter = { lat: -24.807, lng: -47.882 };
  const mapZoom = 10;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${mapZoom}&output=embed&hl=pt-BR`;

  return (
    <div className="glass-card-hover rounded-2xl overflow-hidden" role="region" aria-label="Mapa de picos de surf em Ilha Comprida">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
          <MapPin className="w-6 h-6 text-ocean-500" />
          Mapa — Ilha Comprida, SP
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Localizações dos principais picos de surf
        </p>
      </div>

      <div className="relative h-64 mx-6 rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50 shadow-inner">
        <iframe
          id="ilha-comprida-map"
          title="Mapa — Ilha Comprida, SP"
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[20%] dark:grayscale-[60%] transition-all duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-ocean-500" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Ilha Comprida</span>
        </div>
        <a
          href={`https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${mapZoom}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 py-1.5 shadow flex items-center gap-1 text-xs font-medium text-ocean-600 dark:text-ocean-400 hover:bg-white dark:hover:bg-gray-900 transition-colors"
        >
          Ver no Maps <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      <div className="p-6 pt-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4" /> Picos
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="group flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-ocean-50/80 dark:hover:bg-ocean-900/20 transition-colors duration-200 cursor-default backdrop-blur-sm"
            >
              <div className="p-1.5 rounded-lg bg-ocean-100 dark:bg-ocean-900/40 shrink-0 group-hover:scale-110 transition-transform duration-200">
                <MapPin className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{spot.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{spot.description}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getDifficultyColor(spot.difficulty)}`}>
                    {spot.difficulty}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {spot.waveType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
