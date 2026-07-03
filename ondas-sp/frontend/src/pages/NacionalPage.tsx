import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cloud, Droplets, Eye, Thermometer, Wind, MapPin, AlertTriangle, Satellite, Activity, Sun, Moon, Search, X, RefreshCw, Clock } from 'lucide-react';
import { BrasilMap } from '../components/BrasilMap';
import { LayerControls } from '../components/LayerControls';
import { StatePanel } from '../components/StatePanel';
import { NationalSummary } from '../components/NationalSummary';
import { NationalCards } from '../components/NationalCards';
import { Footer } from '../components/Footer';
import { useNationalWeather } from '../hooks/useNationalWeather';
import { majorCities } from '../data/brazilStates';

const layers = [
  { id: 'aviso', label: 'Avisos', icon: AlertTriangle },
  { id: 'temperatura', label: 'Temperatura', icon: Thermometer },
  { id: 'chuva', label: 'Chuva', icon: Droplets },
  { id: 'satelite', label: 'Satélite', icon: Satellite },
  { id: 'radar', label: 'Radar', icon: Activity },
  { id: 'ventos', label: 'Ventos', icon: Wind },
  { id: 'umidade', label: 'Umidade', icon: Droplets },
  { id: 'pressao', label: 'Pressão', icon: Activity },
  { id: 'raios', label: 'Raios', icon: Activity },
  { id: 'queimadas', label: 'Queimadas', icon: Activity },
  { id: 'frentes', label: 'Frentes Frias', icon: Cloud },
  { id: 'numerica', label: 'Previsão Numérica', icon: Eye },
];

interface SelectedState {
  id: string;
  name: string;
}

export function NacionalPage() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('nacional-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeLayers, setActiveLayers] = useState<string[]>(['aviso']);
  const [selectedState, setSelectedState] = useState<SelectedState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { weatherMap, loading, refetch } = useNationalWeather();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nacional-theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Scroll to map when a state is selected
  useEffect(() => {
    if (selectedState && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedState]);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const stateMatches = majorCities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.stateCode.toLowerCase().includes(q)
    );
    // Remove duplicates by stateCode
    const seen = new Set<string>();
    return stateMatches.filter(c => {
      if (seen.has(c.stateCode)) return false;
      seen.add(c.stateCode);
      return true;
    }).slice(0, 8);
  }, [searchQuery]);

  const handleSearchSelect = (stateCode: string) => {
    const state = majorCities.find(c => c.stateCode === stateCode);
    if (state) {
      setSelectedState({ id: stateCode, name: state.state });
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Calculate national stats from real data
  const nationalStats = useMemo(() => {
    const states = Object.values(weatherMap).filter(s => !s.loading && !s.error);
    if (states.length === 0) return null;

    const temps = states.filter(s => s.temperature != null).map(s => s.temperature!);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const maxState = states.find(s => s.temperature === maxTemp);
    const minState = states.find(s => s.temperature === minTemp);
    const humidities = states.filter(s => s.humidity != null).map(s => s.humidity!);
    const avgHumidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
    const winds = states.filter(s => s.windSpeed != null).map(s => s.windSpeed!);
    const maxWind = Math.max(...winds);
    const rainStates = states.filter(s => s.weatherCode != null && s.weatherCode >= 50).length;

    return {
      maxTemp: Math.round(maxTemp),
      maxTempState: maxState?.stateCode || '--',
      minTemp: Math.round(minTemp),
      minTempState: minState?.stateCode || '--',
      avgHumidity,
      maxWind: Math.round(maxWind),
      rainStates,
      totalStates: states.length,
    };
  }, [weatherMap]);

  const bgGradient = dark
    ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800'
    : 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50';
  const headerBg = dark
    ? 'bg-gradient-to-r from-[#1E2A44] to-[#2B3A55] border-b border-gray-700/50'
    : 'bg-gradient-to-r from-[#1a3a5c] to-[#2563eb] border-b border-blue-200/50';
  const cardBg = dark
    ? 'bg-gradient-to-br from-[#1E2A44] to-[#2B3A55] border-gray-700/50'
    : 'bg-white border-gray-200/80 shadow-lg';
  const inputBg = dark
    ? 'bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors duration-300`}>
      {/* Enhanced Header */}
      <header className={`${headerBg} transition-colors duration-300`}>
        <div className="max-w-[1800px] mx-auto px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex items-center gap-2 ${dark ? 'text-gray-400 hover:text-amber-400' : 'text-white/70 hover:text-white'} transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar ao Início</span>
              </Link>
              <div className={`h-6 w-px ${dark ? 'bg-gray-600' : 'bg-white/20'}`} />
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-white/60">{timeStr}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refetch}
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${loading ? 'animate-spin' : ''} ${dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Atualizar</span>
              </button>

              <button
                onClick={() => setDark(!dark)}
                aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                className={`p-2 rounded-lg transition-all duration-200 ${dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/15 hover:bg-white/25 text-white'}`}
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Main header content */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Meteorologia Nacional
                </h1>
                <p className="text-white/60 text-sm mt-0.5">
                  Monitoramento climático em tempo real — {dateStr}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar cidade ou estado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className={`w-full px-4 py-2.5 pl-10 pr-10 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${inputBg}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {searchFocused && searchResults.length > 0 && (
                <div className={`absolute top-full mt-2 w-full rounded-xl border shadow-2xl z-[1000] overflow-hidden ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {searchResults.map((result) => (
                    <button
                      key={result.stateCode}
                      onClick={() => handleSearchSelect(result.stateCode)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${dark ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`}
                    >
                      <MapPin className={`w-4 h-4 ${dark ? 'text-amber-400' : 'text-blue-500'} shrink-0`} />
                      <div>
                        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{result.name}</p>
                        <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{result.state} ({result.stateCode})</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats bar */}
          {nationalStats && (
            <div className="flex items-center gap-6 py-3 border-t border-white/10 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm shrink-0">
                <Thermometer className="w-4 h-4 text-red-400" />
                <span className="text-white/60">Máx:</span>
                <span className="text-white font-bold">{nationalStats.maxTemp}°C</span>
                <span className="text-white/40 text-xs">({nationalStats.maxTempState})</span>
              </div>
              <div className="flex items-center gap-2 text-sm shrink-0">
                <Thermometer className="w-4 h-4 text-blue-400" />
                <span className="text-white/60">Mín:</span>
                <span className="text-white font-bold">{nationalStats.minTemp}°C</span>
                <span className="text-white/40 text-xs">({nationalStats.minTempState})</span>
              </div>
              <div className="h-4 w-px bg-white/20 shrink-0" />
              <div className="flex items-center gap-2 text-sm shrink-0">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-white/60">Umidade média:</span>
                <span className="text-white font-bold">{nationalStats.avgHumidity}%</span>
              </div>
              <div className="h-4 w-px bg-white/20 shrink-0" />
              <div className="flex items-center gap-2 text-sm shrink-0">
                <Wind className="w-4 h-4 text-teal-400" />
                <span className="text-white/60">Vento máx:</span>
                <span className="text-white font-bold">{nationalStats.maxWind} km/h</span>
              </div>
              <div className="h-4 w-px bg-white/20 shrink-0" />
              <div className="flex items-center gap-2 text-sm shrink-0">
                <Cloud className="w-4 h-4 text-purple-400" />
                <span className="text-white/60">Chuva:</span>
                <span className="text-white font-bold">{nationalStats.rainStates}/{nationalStats.totalStates} estados</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* National Summary KPIs */}
        <NationalSummary weatherMap={weatherMap} dark={dark} />

        <div className="flex gap-6 mt-6">
          {/* Layer Controls */}
          <LayerControls
            layers={layers}
            activeLayers={activeLayers}
            onToggle={toggleLayer}
            dark={dark}
          />

          {/* Main Map Area */}
          <div className="flex-1 flex gap-6" ref={mapRef}>
            <div className="flex-1">
              <div className={`${cardBg} rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-300`}>
                <BrasilMap
                  activeLayers={activeLayers}
                  onStateClick={(state) => state && setSelectedState(state)}
                  selectedState={selectedState?.id}
                  dark={dark}
                  weatherMap={weatherMap}
                />
              </div>
            </div>

            {/* State Panel */}
            {selectedState && (
              <StatePanel
                state={selectedState}
                onClose={() => setSelectedState(null)}
                weather={weatherMap[selectedState.id]}
                dark={dark}
              />
            )}
          </div>
        </div>

        {/* Bottom Cards Grid */}
        <NationalCards activeLayers={activeLayers} weatherMap={weatherMap} dark={dark} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
