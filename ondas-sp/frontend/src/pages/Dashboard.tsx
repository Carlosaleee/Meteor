import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { WeatherCard } from '../components/WeatherCard';
import { WaveCard } from '../components/WaveCard';
import { SurfSummaryCard } from '../components/SurfSummaryCard';
import { ForecastTable } from '../components/ForecastTable';
import { WaveChart } from '../components/WaveChart';
import { SpotMap } from '../components/SpotMap';
import { KpiCards } from '../components/KpiCards';
import { AlertsPanel } from '../components/AlertsPanel';
import { Footer } from '../components/Footer';
import { WindDetailCard } from '../components/WindDetailCard';
import { useWeather } from '../hooks/useWeather';
import { useWaves } from '../hooks/useWaves';
import { useSurfSummary } from '../hooks/useSurfSummary';
import { useSpots } from '../hooks/useSpots';
import { Waves, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { weather, loading: wL, error: wE } = useWeather();
  const { waves, loading: wvL, error: wvE } = useWaves();
  const { summary, loading: smL } = useSurfSummary();
  const { spots } = useSpots();
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

  const loading = wL || wvL || smL;
  const hasError = wE || wvE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Hero
        weather={weather}
        waves={waves}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" role="main" aria-label="Conteúdo principal">
        {/* Error banner */}
        {hasError && (
          <div className="mb-6 p-4 glass-card rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Dados ainda não disponíveis. Aguarde a atualização automática.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spot Map — right below Hero */}
        {!loading && spots.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <SpotMap spots={spots} />
          </div>
        )}

        {/* KPI Cards */}
        {!loading && (
          <div className="mb-6 animate-fadeIn">
            <KpiCards weather={weather} waves={waves} />
          </div>
        )}

        {/* Alerts Panel */}
        {!loading && summary && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <AlertsPanel summary={summary} />
          </div>
        )}

        {/* Main cards — 3 columns equal, responsive stacked */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {weather ? (
              <div className="animate-scaleIn flex"><WeatherCard data={weather} /></div>
            ) : (
              <EmptyCard title="Previsão do Tempo" icon="🌤️" />
            )}
            <div className="animate-scaleIn flex" style={{ animationDelay: '0.05s' }}><WaveCard data={waves} /></div>
            <div className="animate-scaleIn flex" style={{ animationDelay: '0.1s' }}>
              <WindDetailCard weather={weather} />
            </div>
          </div>
        )}

        {/* Surf Summary full width */}
        {!loading && summary && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
            <SurfSummaryCard data={summary} />
          </div>
        )}

        {/* Wave chart */}
        {!loading && waves.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <WaveChart data={waves} />
          </div>
        )}

        {/* Detailed Forecast Table */}
        {!loading && waves.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <ForecastTable weather={weather} waves={waves} />
          </div>
        )}

        {/* Empty state full */}
        {!loading && !weather && waves.length === 0 && !summary && (
          <div className="text-center py-20">
            <Waves className="w-20 h-20 text-ocean-300 dark:text-ocean-600 mx-auto mb-6 animate-bounce" style={{ animationDuration: '3s' }} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Bem-vindo ao Ilha Comp Surf</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Os dados de previsão de tempo e ondas em Ilha Comprida são carregados automaticamente.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function EmptyCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 flex-1">
      <div className="text-center py-4">
        <span className="text-4xl mb-3 block">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Sem dados disponíveis</p>
      </div>
    </div>
  );
}
