import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { WeatherCard } from '../components/WeatherCard'
import { WaveCard } from '../components/WaveCard'
import { SurfSummaryCard } from '../components/SurfSummaryCard'
import { WaveChart } from '../components/WaveChart'
import { SpotMap } from '../components/SpotMap'
import { KpiCards } from '../components/KpiCards'
import { AlertsPanel } from '../components/AlertsPanel'
import { Footer } from '../components/Footer'
import { WindDetailCard } from '../components/WindDetailCard'
import { HourlyForecast } from '../components/HourlyForecast'
import { TideCard } from '../components/TideCard'
import { WindSessionCard } from '../components/WindSessionCard'
import { SpotCard } from '../components/SpotCard'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useWeather } from '../hooks/useWeather'
import { useWaves } from '../hooks/useWaves'
import { useSurfSummary } from '../hooks/useSurfSummary'
import { useSpots } from '../hooks/useSpots'
import { useGeolocation } from '../hooks/useGeolocation'
import { useDarkMode } from '../hooks/useDarkMode'
import { Waves, AlertCircle, MapPin, Crosshair, ChevronRight } from 'lucide-react'
import type { Spot } from '../types'

export function Dashboard() {
  const { weather, loading: wL, error: wE } = useWeather()
  const { waves, loading: wvL, error: wvE } = useWaves()
  const { summary, loading: smL } = useSurfSummary()
  const { spots } = useSpots()
  const { position: userPosition, loading: geoLoading, error: geoError, requestLocation } = useGeolocation()
  const { dark, toggle: toggleDark } = useDarkMode()

  const [activeSpotId, setActiveSpotId] = useState<string | null>(null)
  const spotCardsRef = useRef<HTMLDivElement>(null)

  const loading = wL || wvL || smL
  const hasError = wE || wvE

  const handleSpotHover = useCallback((spotId: string | null) => {
    setActiveSpotId(spotId)
  }, [])

  const handleSpotClick = useCallback((spot: Spot) => {
    setActiveSpotId(spot.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Hero
        weather={weather}
        waves={waves}
        dark={dark}
        onToggleDark={toggleDark}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" role="main" aria-label="Conteúdo principal">
        {!loading && (
          <div className="mb-6 animate-fadeIn">
            <KpiCards weather={weather} waves={waves} />
          </div>
        )}

        {!loading && waves.length > 0 && (
          <HourlyForecast
            weather={weather}
            waves={waves}
          />
        )}

        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {weather ? (
              <ErrorBoundary>
                <div className="animate-scaleIn flex"><WeatherCard data={weather} /></div>
              </ErrorBoundary>
            ) : (
              <EmptyCard title="Previsão do Tempo" icon="🌤️" />
            )}
            <ErrorBoundary>
              <div className="animate-scaleIn flex" style={{ animationDelay: '0.05s' }}><WaveCard data={waves} /></div>
            </ErrorBoundary>
            <ErrorBoundary>
              <div className="animate-scaleIn flex" style={{ animationDelay: '0.1s' }}>
                <WindDetailCard weather={weather} />
              </div>
            </ErrorBoundary>
          </div>
        )}

        {hasError && (
          <div className="mb-6 p-4 glass-card rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Dados ainda não disponíveis. Aguarde a atualização automática.
            </p>
          </div>
        )}

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

        {!loading && spots.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <ErrorBoundary>
              <SpotMap
                spots={spots}
                activeSpotId={activeSpotId}
                onSpotHover={handleSpotHover}
                onSpotClick={handleSpotClick}
                userPosition={userPosition}
              />
            </ErrorBoundary>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={requestLocation}
                disabled={geoLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-400 text-white transition-colors shadow-lg shadow-ocean-500/25"
              >
                <Crosshair className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
                {geoLoading ? 'Obtendo localização...' : 'Minha localização'}
              </button>
              {geoError && (
                <span className="text-xs text-red-500 dark:text-red-400">{geoError}</span>
              )}
            </div>
          </div>
        )}

        {!loading && spots.length > 0 && (
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ocean-500" />
                Picos de Surf
                <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">({spots.length} spots)</span>
              </h3>
              <Link to="/picos"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white transition-all duration-200 shadow-lg shadow-ocean-500/25 hover:shadow-ocean-500/40 hover:scale-[1.02]">
                Ver todos os picos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div ref={spotCardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {spots.slice(0, 8).map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isActive={activeSpotId === spot.id}
                  userPosition={userPosition}
                  onHover={handleSpotHover}
                  onClick={handleSpotClick}
                />
              ))}
            </div>

            {spots.length > 8 && (
              <div className="mt-4 text-center">
                <Link to="/picos"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-600 hover:to-cyan-600 text-white transition-all duration-300 shadow-lg shadow-ocean-500/25 hover:shadow-ocean-500/40 hover:scale-[1.02]">
                  <MapPin className="w-4 h-4" />
                  Ver todos os {spots.length} picos
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {!loading && summary && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <ErrorBoundary>
              <AlertsPanel summary={summary} />
            </ErrorBoundary>
          </div>
        )}

        {!loading && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.12s' }}>
            <ErrorBoundary>
              <WindSessionCard weather={weather} />
            </ErrorBoundary>
          </div>
        )}

        {!loading && waves.length > 0 && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.13s' }}>
            <ErrorBoundary>
              <TideCard waves={waves} />
            </ErrorBoundary>
          </div>
        )}

        {!loading && summary && (
          <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
            <ErrorBoundary>
              <SurfSummaryCard data={summary} />
            </ErrorBoundary>
          </div>
        )}

        {!loading && waves.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <ErrorBoundary>
              <WaveChart data={waves} />
            </ErrorBoundary>
          </div>
        )}

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
  )
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
  )
}
