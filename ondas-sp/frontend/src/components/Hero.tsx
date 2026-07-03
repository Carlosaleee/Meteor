import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { WeatherData, WaveData } from '../types';
import { Thermometer, Waves, Wind, Sun, Moon, Calendar, Map } from 'lucide-react';

interface Props {
  weather: WeatherData | null;
  waves: WaveData[];
  dark: boolean;
  onToggleDark: () => void;
}

function getWeatherEmoji(code: string | null): string {
  if (!code) return '🌤️';
  const n = parseInt(code, 10);
  if (n >= 95) return '⛈️';
  if (n >= 61) return '🌧️';
  if (n >= 51) return '🌦️';
  if (n >= 1) return '⛅';
  return '☀️';
}

function getWindDirection(deg: number | null): string {
  if (deg == null) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export function Hero({ weather, waves, dark, onToggleDark }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const latestWave = waves.length > 0 ? waves[waves.length - 1] : null;
  const temp = weather?.temperatureMean;
  const waveHeight = latestWave?.waveHeight;
  const windSpeed = weather?.windSpeedMax;
  const dateStr = time.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <header role="banner" aria-label="Cabeçalho principal com previsão do tempo" className="relative overflow-hidden bg-gradient-to-br from-ocean-800 via-ocean-600 to-cyan-500 text-white">
      {/* Animated ocean waves background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            className="fill-white/5"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            className="fill-white/10 animate-wave-slow"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            className="fill-white/5 animate-wave"
            d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,224C672,203,768,181,864,186.7C960,192,1056,224,1152,234.7C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              left: `${5 + i * 12}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Waves className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" style={{ animationDuration: '2s' }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ilha Comp Surf</h1>
              <p className="text-ocean-200 text-xs sm:text-sm">Ilha Comprida, SP — Previsão do Tempo e Ondas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/meteorologia"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all duration-200 backdrop-blur-sm text-sm font-medium border border-amber-400/30"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Meteorologia Nacional</span>
            </Link>
            <button
              onClick={onToggleDark}
              aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Hero KPIs — 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" role="region" aria-label="Indicadores principais do tempo">
          <HeroKpi
            icon={<Thermometer className="w-6 h-6" />}
            label="Temperatura"
            value={temp != null ? `${temp}°` : '--'}
            sublabel={weather ? getWeatherEmoji(weather.weatherCode) : ''}
          />
          <HeroKpi
            icon={<Waves className="w-6 h-6" />}
            label="Ondas"
            value={waveHeight != null ? `${waveHeight}m` : '--'}
            sublabel={latestWave ? `${latestWave.wavePeriod || '--'}s período` : ''}
          />
          <HeroKpi
            icon={<Wind className="w-6 h-6" />}
            label="Vento"
            value={windSpeed != null ? `${windSpeed}` : '--'}
            sublabel={windSpeed != null ? `km/h ${getWindDirection(weather?.windDirection ?? null)}` : ''}
          />
          <HeroKpi
            icon={<Calendar className="w-6 h-6" />}
            label="Data"
            value={dateStr}
            sublabel="Ilha Comprida, SP"
          />
        </div>
      </div>
    </header>
  );
}

function HeroKpi({ icon, label, value, sublabel }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300 bg-white/10">
      <div className="flex justify-center mb-2 text-white/80">{icon}</div>
      <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-extrabold text-white">{value}</p>
      {sublabel && <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">{sublabel}</p>}
    </div>
  );
}
