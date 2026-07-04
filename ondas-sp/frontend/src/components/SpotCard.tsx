import { memo } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import type { Spot } from '../types'

interface SpotCardProps {
  spot: Spot
  isActive: boolean
  userPosition: [number, number] | null
  onHover: (spotId: string | null) => void
  onClick: (spot: Spot) => void
}

const difficultyConfig: Record<string, { gradient: string; emoji: string }> = {
  'Iniciante': { gradient: 'from-emerald-400 to-teal-500', emoji: '🟢' },
  'Intermediário': { gradient: 'from-amber-400 to-orange-500', emoji: '🟡' },
  'Avançado': { gradient: 'from-rose-400 to-red-500', emoji: '🔴' },
}

export const SpotCard = memo(function SpotCard({ spot, isActive, userPosition, onHover, onClick }: SpotCardProps) {
  const config = difficultyConfig[spot.difficulty] || difficultyConfig['Iniciante']

  const directionsUrl = userPosition
    ? `https://www.google.com/maps/dir/${userPosition[0]},${userPosition[1]}/${spot.latitude},${spot.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`

  return (
    <div
      data-spot-id={spot.id}
      onClick={() => onClick(spot)}
      onMouseEnter={() => onHover(spot.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isActive
          ? 'ring-2 ring-ocean-400 dark:ring-ocean-500 scale-[1.02] shadow-lg'
          : 'hover:scale-[1.02] hover:shadow-lg'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Pico ${spot.name} - ${spot.difficulty}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(spot)
        }
      }}
    >
      <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
        <div className="flex items-start gap-2.5">
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.gradient} shrink-0`}>
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{spot.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold">{config.emoji} {spot.difficulty}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{spot.waveType}</span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 bg-ocean-50 dark:bg-ocean-900/30 hover:bg-ocean-100 dark:hover:bg-ocean-900/50 px-2 py-1.5 rounded-lg transition-colors"
          >
            <Navigation className="w-3 h-3" />
            Como chegar
          </a>
        </div>
      </div>
    </div>
  )
})
