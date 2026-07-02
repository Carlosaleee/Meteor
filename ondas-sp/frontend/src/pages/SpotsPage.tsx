import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Waves, Navigation, Filter, Search, X, Compass, Clock, ExternalLink, Leaf } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { ForecastTable } from '../components/ForecastTable';
import { useSpots } from '../hooks/useSpots';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import { useWaves } from '../hooks/useWaves';
import { SurfPopup } from '../components/SurfPopup';
import type { Spot } from '../types';

const MAP_CENTER: [number, number] = [-24.85, -47.72];
const MAP_ZOOM = 10;

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; border: string; emoji: string; gradient: string }> = {
  'Iniciante': { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', emoji: '🟢', gradient: 'from-emerald-400 to-teal-500' },
  'Intermediário': { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', emoji: '🟡', gradient: 'from-amber-400 to-orange-500' },
  'Avançado': { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', emoji: '🔴', gradient: 'from-rose-400 to-red-500' },
};

const REGION_COLORS: Record<string, string> = {
  'Ilha Comprida': 'bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300',
  'Ilha Comprida Norte': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  'Ilha Comprida Sul': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  'Jureia': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
};

function createSpotIcon(difficulty: string): L.DivIcon {
  const color = difficulty === 'Iniciante' ? '#10b981' : difficulty === 'Intermediário' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:36px;height:36px;background:linear-gradient(135deg,${color},${color}dd);border:3px solid white;border-radius:50%;box-shadow:0 4px 12px ${color}66,0 2px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -40],
  });
}

function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: 'user-marker',
    html: `<div style="width:22px;height:22px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 4px 12px rgba(59,130,246,0.4);"></div>`,
    iconSize: [22, 22], iconAnchor: [11, 11],
  });
}

function FlyToSpot({ spot }: { spot: Spot }) {
  const map = useMap();
  useEffect(() => { map.flyTo([spot.latitude, spot.longitude], 14, { duration: 1.5 }); }, [map, spot]);
  return null;
}

function FlyToUser({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.flyTo(position, 14, { duration: 1.5 }); }, [map, position]);
  return null;
}

export function SpotsPage() {
  const { spots } = useSpots();
  const { position: userPosition, loading: geoLoading, requestLocation } = useGeolocation();
  const { weather, loading: wL } = useWeather();
  const { waves, loading: wvL } = useWaves();
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('Todos');
  const [regionFilter, setRegionFilter] = useState('Todas');
  const [filterOpen, setFilterOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loading = wL || wvL;

  const regions = useMemo(() => {
    const r = new Set(spots.map(s => s.region));
    return ['Todas', ...Array.from(r)];
  }, [spots]);

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'Todos' || spot.difficulty === difficultyFilter;
      const matchesRegion = regionFilter === 'Todas' || spot.region === regionFilter;
      return matchesSearch && matchesDifficulty && matchesRegion;
    });
  }, [spots, searchTerm, difficultyFilter, regionFilter]);

  const handleSpotClick = (spot: Spot) => { setActiveSpotId(spot.id); };

  const getDirectionsUrl = (spot: Spot) => {
    if (userPosition) return `https://www.google.com/maps/dir/${userPosition[0]},${userPosition[1]}/${spot.latitude},${spot.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
  };

  const stats = useMemo(() => ({
    iniciante: spots.filter(s => s.difficulty === 'Iniciante').length,
    intermediario: spots.filter(s => s.difficulty === 'Intermediário').length,
    avancado: spots.filter(s => s.difficulty === 'Avançado').length,
    total: spots.length,
  }), [spots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Hero
        weather={weather}
        waves={waves}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" role="main" aria-label="Picos de Surf">
        {/* Back button + Stats */}
        <div className="mb-6 flex flex-wrap items-center gap-3 animate-fadeIn">
          <Link to="/"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-ocean-500" />
            <span className="font-semibold">{stats.total}</span> spots mapeados
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
          <div className="glass-card rounded-xl p-4 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Waves className="w-6 h-6 mx-auto mb-2 text-ocean-500" />
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.total}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total de Picos</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <span className="text-2xl mb-2 block">🟢</span>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.iniciante}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Iniciante</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <span className="text-2xl mb-2 block">🟡</span>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.intermediario}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intermediário</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <span className="text-2xl mb-2 block">🔴</span>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.avancado}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avançado</p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card-hover rounded-2xl overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
                <MapPin className="w-6 h-6 text-ocean-500" />
                Mapa dos Picos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clique nos marcadores para ver detalhes</p>
            </div>
            <div className="mx-6 mb-6 rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50 shadow-inner" style={{ height: '500px' }}>
              <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredSpots.map((spot) => (
                  <Marker key={spot.id} position={[spot.latitude, spot.longitude]} icon={createSpotIcon(spot.difficulty)}
                    eventHandlers={{ mouseover: () => setActiveSpotId(spot.id), click: () => handleSpotClick(spot) }}>
                    <Popup><SurfPopup spot={spot} onRoute={() => {}} hasUserPosition={!!userPosition} /></Popup>
                  </Marker>
                ))}
                {userPosition && <Marker position={userPosition} icon={createUserIcon()}>
                  <Popup><div className="text-xs font-medium text-gray-700">Sua localização</div></Popup>
                </Marker>}
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
        </div>

        {/* Geolocation button */}
        <div className="mb-6 flex items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          <button onClick={requestLocation} disabled={geoLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-400 text-white transition-colors shadow-lg shadow-ocean-500/25">
            <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
            {geoLoading ? 'Obtendo localização...' : 'Minha localização'}
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar pico..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 backdrop-blur-sm" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setFilterOpen(!filterOpen); setRegionOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-colors ${
                difficultyFilter !== 'Todos' ? 'bg-ocean-500 text-white border-ocean-500' : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } backdrop-blur-sm`}>
              <Filter className="w-4 h-4" />{difficultyFilter}
            </button>
            {filterOpen && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[1000] min-w-[150px]">
                {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map((f) => (
                  <button key={f} onClick={() => { setDifficultyFilter(f); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${difficultyFilter === f ? 'bg-ocean-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{f}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setRegionOpen(!regionOpen); setFilterOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-colors ${
                regionFilter !== 'Todas' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } backdrop-blur-sm`}>
              <Leaf className="w-4 h-4" />{regionFilter}
            </button>
            {regionOpen && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[1000] min-w-[170px]">
                {regions.map((r) => (
                  <button key={r} onClick={() => { setRegionFilter(r); setRegionOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${regionFilter === r ? 'bg-purple-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{r}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spot Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {filteredSpots.map((spot, index) => {
            const config = DIFFICULTY_CONFIG[spot.difficulty] || DIFFICULTY_CONFIG['Iniciante'];
            const regionColor = REGION_COLORS[spot.region] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
            return (
              <div key={spot.id}
                className={`group glass-card-hover rounded-2xl overflow-hidden border ${config.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-scaleIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setActiveSpotId(spot.id)}>
                <div className={`relative h-24 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <svg className="absolute bottom-0 w-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                      <path d="M0,40 Q100,10 200,35 T400,30 L400,60 L0,60 Z" fill="white" />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                      {config.emoji} {spot.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <MapPin className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white leading-tight">{spot.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${regionColor} shrink-0 ml-2`}>{spot.region}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{spot.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Waves className="w-3 h-3" /> {spot.waveType}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {spot.bestSeason}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ocean-50/80 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/30 mb-3">
                    <p className="text-[11px] text-ocean-700 dark:text-ocean-300 flex items-start gap-1.5">
                      <Compass className="w-3 h-3 mt-0.5 shrink-0" />{spot.tip}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={getDirectionsUrl(spot)} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-ocean-500 hover:bg-ocean-600 text-white transition-colors shadow-sm">
                      <Navigation className="w-3.5 h-3.5" />Como chegar
                    </a>
                    <a href={`https://maps.google.com/maps?q=${spot.latitude},${spot.longitude}&z=14`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-16 mb-10">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Nenhum pico encontrado</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tente ajustar os filtros de busca.</p>
          </div>
        )}

        {/* Hourly Forecast */}
        {!loading && waves.length > 0 && (
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <ForecastTable weather={weather} waves={waves} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
