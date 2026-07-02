import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Spot } from '../types';
import { SurfPopup } from './SurfPopup';
import { MapPin, Search, Filter, Layers, X } from 'lucide-react';

interface Props {
  spots: Spot[];
  activeSpotId?: string | null;
  onSpotHover?: (spotId: string | null) => void;
  onSpotClick?: (spot: Spot) => void;
  userPosition?: [number, number] | null;
}

const MAP_CENTER: [number, number] = [-24.85, -47.72];
const MAP_ZOOM = 10;

const TILE_LAYERS = {
  streets: { name: 'Ruas', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
  satellite: { name: 'Satélite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },
  terrain: { name: 'Relevo', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap' },
};

const DIFFICULTY_FILTERS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'] as const;

function createSpotIcon(difficulty: string): L.DivIcon {
  const color = difficulty === 'Iniciante' ? '#10b981' : difficulty === 'Intermediário' ? '#f59e0b' : '#ef4444';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 36px; height: 36px;
      background: linear-gradient(135deg, ${color}, ${color}dd);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 12px ${color}66, 0 2px 4px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });
}

function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: 'user-marker',
    html: `<div style="
      width: 22px; height: 22px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.4);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function FlyToSpot({ spot }: { spot: Spot }) {
  const map = useMap();
  useEffect(() => { map.flyTo([spot.latitude, spot.longitude], 13, { duration: 1.5 }); }, [map, spot]);
  return null;
}

function FlyToUser({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.flyTo(position, 14, { duration: 1.5 }); }, [map, position]);
  return null;
}

function LayerControl({ activeLayer, onLayerChange }: { activeLayer: string; onLayerChange: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute top-2 right-2 z-[1000]">
      <button onClick={() => setOpen(!open)} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Camadas do mapa">
        <Layers className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      {open && (
        <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[140px]">
          {Object.entries(TILE_LAYERS).map(([key, layer]) => (
            <button key={key} onClick={() => { onLayerChange(key); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                activeLayer === key ? 'bg-ocean-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>{layer.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SpotMap({ spots, activeSpotId, onSpotHover, onSpotClick, userPosition }: Props) {
  const markerRefs = useRef<Map<string, L.Marker>>(new Map);
  const [activeLayer, setActiveLayer] = useState('streets');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('Todos');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'Todos' || spot.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [spots, searchTerm, difficultyFilter]);

  useEffect(() => {
    if (activeSpotId) {
      const marker = markerRefs.current.get(activeSpotId);
      if (marker) marker.openPopup();
    }
  }, [activeSpotId]);

  const activeTile = TILE_LAYERS[activeLayer as keyof typeof TILE_LAYERS];

  return (
    <div className="glass-card-hover rounded-2xl overflow-hidden" role="region" aria-label="Mapa de picos de surf em Ilha Comprida">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
          <MapPin className="w-6 h-6 text-ocean-500" />
          Mapa — Ilha Comprida, SP
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Clique nos marcadores para ver detalhes dos picos</p>
      </div>

      <div className="mx-6 mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar pico..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-400" />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
              difficultyFilter !== 'Todos' ? 'bg-ocean-500 text-white border-ocean-500' : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}>
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{difficultyFilter}</span>
          </button>
          {filterOpen && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[1000] min-w-[130px]">
              {DIFFICULTY_FILTERS.map((f) => (
                <button key={f} onClick={() => { setDifficultyFilter(f); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    difficultyFilter === f ? 'bg-ocean-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>{f}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-6 mb-6 rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50 shadow-inner relative" style={{ height: '420px' }}>
        <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} zoomControl={true}>
          <TileLayer key={activeLayer} attribution={activeTile.attribution} url={activeTile.url} />
          <LayerControl activeLayer={activeLayer} onLayerChange={setActiveLayer} />

          {filteredSpots.map((spot) => (
            <Marker key={spot.id} position={[spot.latitude, spot.longitude]} icon={createSpotIcon(spot.difficulty)}
              eventHandlers={{ mouseover: () => onSpotHover?.(spot.id), mouseout: () => onSpotHover?.(null), click: () => onSpotClick?.(spot) }}
              ref={(ref) => { if (ref) markerRefs.current.set(spot.id, ref); }}>
              <Popup><SurfPopup spot={spot} onRoute={() => {}} hasUserPosition={!!userPosition} /></Popup>
            </Marker>
          ))}

          {userPosition && (
            <Marker position={userPosition} icon={createUserIcon()}>
              <Popup><div className="text-xs font-medium text-gray-700">Sua localização</div></Popup>
            </Marker>
          )}

          {activeSpotId && (() => { const spot = spots.find(s => s.id === activeSpotId); return spot ? <FlyToSpot spot={spot} /> : null; })()}
          {userPosition && <FlyToUser position={userPosition} />}
        </MapContainer>
      </div>

      <div className="px-6 pb-4 flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Iniciante</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Intermediário</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Avançado</span>
        {userPosition && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Você</span>}
      </div>
    </div>
  );
}
