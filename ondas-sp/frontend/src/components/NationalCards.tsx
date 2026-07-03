import { useMemo } from 'react';
import {
  AlertTriangle, Satellite, Thermometer, Droplets, Wind,
  Activity, Cloud, Eye, Radio, Flame, BarChart3, MapPin
} from 'lucide-react';
import type { StateWeather } from '../hooks/useNationalWeather';

interface NationalCardsProps {
  activeLayers: string[];
  weatherMap: Record<string, StateWeather>;
  dark: boolean;
}

export function NationalCards({ activeLayers, weatherMap, dark }: NationalCardsProps) {
  const stats = useMemo(() => {
    const states = Object.values(weatherMap).filter(s => !s.loading && !s.error);
    const temps = states.filter(s => s.temperature != null).map(s => s.temperature!);
    const avgTemp = temps.length > 0 ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : null;
    const maxTemp = temps.length > 0 ? Math.max(...temps) : null;
    const maxTempState = states.find(s => s.temperature === maxTemp);
    const winds = states.filter(s => s.windSpeed != null).map(s => s.windSpeed!);
    const avgWind = winds.length > 0 ? Math.round(winds.reduce((a, b) => a + b, 0) / winds.length) : null;
    const maxWind = winds.length > 0 ? Math.max(...winds) : null;
    const humidities = states.filter(s => s.humidity != null).map(s => s.humidity!);
    const avgHumidity = humidities.length > 0 ? Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length) : null;
    const pressures = states.filter(s => s.pressure != null).map(s => s.pressure!);
    const avgPressure = pressures.length > 0 ? Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length) : null;
    const rainStates = states.filter(s => s.weatherCode != null && s.weatherCode >= 50).length;
    const stormStates = states.filter(s => s.weatherCode != null && s.weatherCode >= 95).length;
    const heatStates = states.filter(s => s.temperature != null && s.temperature >= 35).length;

    return {
      avgTemp, maxTemp, maxTempState: maxTempState?.stateCode || '--',
      avgWind, maxWind,
      avgHumidity,
      avgPressure,
      rainStates, stormStates, heatStates,
      totalStates: states.length,
    };
  }, [weatherMap]);

  const cards = [
    {
      id: 'alertas',
      title: 'Alertas INMET',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-500 dark:text-red-400',
      items: [
        { label: 'Tempestades', count: stats.stormStates, color: 'bg-red-500' },
        { label: 'Chuva', count: stats.rainStates, color: 'bg-amber-500' },
        { label: 'Calor extremo', count: stats.heatStates, color: 'bg-orange-500' },
      ],
    },
    {
      id: 'satelite',
      title: 'Satélite GOES-16',
      icon: Satellite,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-500 dark:text-blue-400',
      items: [
        { label: 'Estados monitorados', value: `${stats.totalStates}/27`, icon: Eye },
        { label: 'Fonte', value: 'GOES-16', icon: Satellite },
      ],
    },
    {
      id: 'temperatura',
      title: 'Temperatura Nacional',
      icon: Thermometer,
      color: 'from-red-500 to-orange-500',
      textColor: 'text-orange-500 dark:text-orange-400',
      items: [
        { label: 'Média Brasil', value: stats.avgTemp != null ? `${stats.avgTemp}°C` : '--', icon: Thermometer },
        { label: 'Máxima registrada', value: stats.maxTemp != null ? `${Math.round(stats.maxTemp)}°C em ${stats.maxTempState}` : '--', icon: Flame },
      ],
    },
    {
      id: 'chuva',
      title: 'Precipitação',
      icon: Droplets,
      color: 'from-cyan-500 to-cyan-600',
      textColor: 'text-cyan-500 dark:text-cyan-400',
      items: [
        { label: 'Estados com chuva', value: `${stats.rainStates}/27`, icon: Droplets },
        { label: 'Tempestades ativas', value: `${stats.stormStates}`, icon: Cloud },
      ],
    },
    {
      id: 'ventos',
      title: 'Ventos',
      icon: Wind,
      color: 'from-teal-500 to-teal-600',
      textColor: 'text-teal-500 dark:text-teal-400',
      items: [
        { label: 'Vento médio', value: stats.avgWind != null ? `${stats.avgWind} km/h` : '--', icon: Wind },
        { label: 'Rajadas máximas', value: stats.maxWind != null ? `${Math.round(stats.maxWind)} km/h` : '--', icon: Activity },
      ],
    },
    {
      id: 'umidade',
      title: 'Umidade do Ar',
      icon: Droplets,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-500 dark:text-indigo-400',
      items: [
        { label: 'Umidade média', value: stats.avgHumidity != null ? `${stats.avgHumidity}%` : '--', icon: Droplets },
        { label: 'Estadosmonitorados', value: `${stats.totalStates}`, icon: Eye },
      ],
    },
    {
      id: 'pressao',
      title: 'Pressão Atmosférica',
      icon: Activity,
      color: 'from-violet-500 to-violet-600',
      textColor: 'text-violet-500 dark:text-violet-400',
      items: [
        { label: 'Pressão média', value: stats.avgPressure != null ? `${stats.avgPressure} hPa` : '--', icon: Activity },
        { label: 'Tendência', value: 'Estável', icon: BarChart3 },
      ],
    },
    {
      id: 'frentes',
      title: 'Frentes Frias',
      icon: Cloud,
      color: 'from-sky-500 to-sky-600',
      textColor: 'text-sky-500 dark:text-sky-400',
      items: [
        { label: 'Tempestades', value: `${stats.stormStates} regiões`, icon: Cloud },
        { label: 'Chuva', value: `${stats.rainStates} estados`, icon: MapPin },
      ],
    },
    {
      id: 'radar',
      title: 'Fontes de Dados',
      icon: Radio,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-500 dark:text-green-400',
      items: [
        { label: 'Open-Meteo API', value: 'Ativo', icon: Activity },
        { label: 'Leaflet + OSM', value: 'Ativo', icon: MapPin },
      ],
    },
    {
      id: 'queimadas',
      title: 'Monitoramento',
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-orange-500 dark:text-orange-400',
      items: [
        { label: 'Calor extremo', value: `${stats.heatStates} estados`, icon: Flame },
        { label: 'Condições adversas', value: `${stats.stormStates}`, icon: AlertTriangle },
      ],
    },
    {
      id: 'descargas',
      title: 'Eventos Extremos',
      icon: Activity,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-500 dark:text-yellow-400',
      items: [
        { label: 'Tempestades', value: `${stats.stormStates}`, icon: Activity },
        { label: 'Estados afetados', value: `${stats.rainStates}`, icon: MapPin },
      ],
    },
    {
      id: 'numerica',
      title: 'Previsão Numérica',
      icon: Eye,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-500 dark:text-emerald-400',
      items: [
        { label: 'Open-Meteo GFS', value: 'Atualizado', icon: Eye },
        { label: 'Horizonte', value: '7 dias', icon: BarChart3 },
      ],
    },
  ];

  const cardBg = dark
    ? 'bg-gradient-to-br from-[#1E2A44] to-[#2B3A55] border-gray-700/50'
    : 'bg-white border-gray-200 shadow-md';
  const cellBg = dark
    ? 'bg-gray-800/30 border-gray-700/20'
    : 'bg-gray-50 border-gray-200/60';
  const textMuted = dark ? 'text-gray-500' : 'text-gray-400';
  const textPrimary = dark ? 'text-white' : 'text-gray-900';

  const visibleCards = cards.filter(card => {
    if (activeLayers.length === 0) return true;
    return activeLayers.includes(card.id) || activeLayers.includes('aviso');
  });

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {(visibleCards.length > 0 ? visibleCards : cards).map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`${cardBg} rounded-2xl border p-4 shadow-xl hover:scale-[1.01] transition-all duration-200 group`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h3 className={`${textPrimary} font-semibold text-sm`}>{card.title}</h3>
            </div>

            <div className="space-y-2.5">
              {card.items.map((item, i) => {
                const ItemIcon = 'icon' in item ? item.icon : undefined;
                return (
                  <div key={i} className={`flex items-center justify-between ${cellBg} rounded-lg px-3 py-2 border transition-colors duration-300`}>
                    <div className="flex items-center gap-2">
                      {ItemIcon && <ItemIcon className={`w-3.5 h-3.5 ${textMuted}`} />}
                      {'color' in item ? (
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      ) : null}
                      <span className={`${textMuted} text-xs`}>
                        {'label' in item ? item.label : ''}
                      </span>
                    </div>
                    <span className={`font-semibold text-sm ${card.textColor}`}>
                      {'count' in item ? item.count : 'value' in item ? item.value : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
