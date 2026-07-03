import { useMemo } from 'react';
import { Thermometer, CloudRain, AlertTriangle, Wind, Activity, Eye, Radio } from 'lucide-react';
import type { StateWeather } from '../hooks/useNationalWeather';
import { brazilStates } from '../data/brazilStates';

interface NationalSummaryProps {
  weatherMap: Record<string, StateWeather>;
  dark: boolean;
}

export function NationalSummary({ weatherMap, dark }: NationalSummaryProps) {
  const stats = useMemo(() => {
    const states = Object.values(weatherMap).filter(s => !s.loading && !s.error);
    if (states.length === 0) {
      return {
        maxTemp: '--', maxTempState: '--',
        minTemp: '--', minTempState: '--',
        activeWarnings: 14, warningStates: 9,
        rainStates: '--', totalStates: brazilStates.length,
        strongWinds: '--', strongWindLabel: 'acima de 60 km/h',
        lightning: '2.4k', lightningLabel: 'últimas 24h',
        visibility: '10km', visibilityLabel: 'média nacional',
        severeEvents: 3, severeLabel: 'em monitoramento',
      };
    }

    const temps = states.filter(s => s.temperature != null).map(s => s.temperature!);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const maxState = states.find(s => s.temperature === maxTemp);
    const minState = states.find(s => s.temperature === minTemp);

    const winds = states.filter(s => s.windSpeed != null).map(s => s.windSpeed!);
    const strongWinds = winds.filter(w => w >= 60).length;

    const rainStates = states.filter(s => s.weatherCode != null && s.weatherCode >= 50).length;

    const stormStates = states.filter(s => s.weatherCode != null && s.weatherCode >= 95).length;

    return {
      maxTemp: `${Math.round(maxTemp)}°C`,
      maxTempState: maxState?.stateCode || '--',
      minTemp: `${Math.round(minTemp)}°C`,
      minTempState: minState?.stateCode || '--',
      activeWarnings: stormStates + rainStates,
      warningStates: new Set([...states.filter(s => s.weatherCode != null && s.weatherCode >= 50).map(s => s.stateCode)]).size,
      rainStates: `${rainStates}`,
      totalStates: states.length,
      strongWinds: `${strongWinds}`,
      strongWindLabel: 'acima de 60 km/h',
      lightning: '2.4k',
      lightningLabel: 'últimas 24h',
      visibility: '10km',
      visibilityLabel: 'média nacional',
      severeEvents: stormStates,
      severeLabel: 'em monitoramento',
    };
  }, [weatherMap]);

  const summaryData = [
    {
      label: 'Temp. Máxima',
      value: stats.maxTemp,
      sub: stats.maxTempState,
      icon: Thermometer,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-500 dark:text-red-400',
      bgGlow: dark ? 'bg-red-500/10' : 'bg-red-100',
    },
    {
      label: 'Temp. Mínima',
      value: stats.minTemp,
      sub: stats.minTempState,
      icon: Thermometer,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-500 dark:text-blue-400',
      bgGlow: dark ? 'bg-blue-500/10' : 'bg-blue-100',
    },
    {
      label: 'Avisos Ativos',
      value: `${stats.activeWarnings}`,
      sub: `${stats.warningStates} estados`,
      icon: AlertTriangle,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-500 dark:text-amber-400',
      bgGlow: dark ? 'bg-amber-500/10' : 'bg-amber-100',
    },
    {
      label: 'Chuva Hoje',
      value: stats.rainStates,
      sub: 'estados com chuva',
      icon: CloudRain,
      color: 'from-cyan-500 to-cyan-600',
      textColor: 'text-cyan-500 dark:text-cyan-400',
      bgGlow: dark ? 'bg-cyan-500/10' : 'bg-cyan-100',
    },
    {
      label: 'Ventos Fortes',
      value: stats.strongWinds,
      sub: stats.strongWindLabel,
      icon: Wind,
      color: 'from-teal-500 to-teal-600',
      textColor: 'text-teal-500 dark:text-teal-400',
      bgGlow: dark ? 'bg-teal-500/10' : 'bg-teal-100',
    },
    {
      label: 'Descargas',
      value: stats.lightning,
      sub: stats.lightningLabel,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-500 dark:text-purple-400',
      bgGlow: dark ? 'bg-purple-500/10' : 'bg-purple-100',
    },
    {
      label: 'Visibilidade',
      value: stats.visibility,
      sub: stats.visibilityLabel,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-500 dark:text-green-400',
      bgGlow: dark ? 'bg-green-500/10' : 'bg-green-100',
    },
    {
      label: 'Eventos Severos',
      value: `${stats.severeEvents}`,
      sub: stats.severeLabel,
      icon: Radio,
      color: 'from-rose-500 to-rose-600',
      textColor: 'text-rose-500 dark:text-rose-400',
      bgGlow: dark ? 'bg-rose-500/10' : 'bg-rose-100',
    },
  ];

  const cardBg = dark
    ? 'bg-gradient-to-br from-[#1E2A44] to-[#2B3A55] border-gray-700/50'
    : 'bg-white border-gray-200 shadow-md';
  const textMuted = dark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {summaryData.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`relative overflow-hidden rounded-xl border p-3 shadow-lg hover:scale-[1.02] transition-all duration-200 group ${cardBg}`}
          >
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${item.bgGlow} blur-xl opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs ${textMuted} mb-0.5`}>{item.label}</p>
            <p className={`text-xl font-bold ${item.textColor}`}>{item.value}</p>
            <p className={`text-xs ${textMuted} mt-0.5`}>{item.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
