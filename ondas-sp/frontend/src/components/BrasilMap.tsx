import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { brazilStates } from '../data/brazilStates';
import type { StateWeather } from '../hooks/useNationalWeather';

interface BrasilMapProps {
  activeLayers: string[];
  onStateClick: (state: { id: string; name: string } | null) => void;
  selectedState?: string;
  dark: boolean;
  weatherMap: Record<string, StateWeather>;
}

const stateCentroids: Record<string, [number, number]> = Object.fromEntries(
  brazilStates.map(s => [s.code, [s.lat, s.lon]])
);

const stateNames: Record<string, string> = Object.fromEntries(
  brazilStates.map(s => [s.code, s.name])
);

// Temperature color scale
function tempToColor(temp: number): string {
  if (temp <= 10) return '#3b82f6'; // blue
  if (temp <= 18) return '#06b6d4'; // cyan
  if (temp <= 24) return '#22c55e'; // green
  if (temp <= 30) return '#eab308'; // yellow
  if (temp <= 35) return '#f97316'; // orange
  return '#ef4444'; // red
}

// Humidity color scale
function humidityToColor(hum: number): string {
  if (hum <= 30) return '#f97316'; // dry - orange
  if (hum <= 50) return '#eab308'; // moderate - yellow
  if (hum <= 70) return '#22c55e'; // normal - green
  if (hum <= 85) return '#06b6d4'; // humid - cyan
  return '#3b82f6'; // very humid - blue
}

// Wind speed color scale
function windToColor(speed: number): string {
  if (speed <= 10) return '#22c55e'; // calm - green
  if (speed <= 20) return '#eab308'; // light - yellow
  if (speed <= 40) return '#f97316'; // moderate - orange
  if (speed <= 60) return '#ef4444'; // strong - red
  return '#dc2626'; // very strong - dark red
}

// Weather code to rain intensity color
function weatherToRainColor(code: number | null): string {
  if (code == null || code < 50) return 'transparent';
  if (code <= 59) return '#93c5fd'; // light rain
  if (code <= 69) return '#3b82f6'; // rain
  if (code <= 82) return '#1d4ed8'; // heavy rain
  return '#1e3a8a'; // extreme
}

function MapUpdater({ selectedState }: { selectedState?: string }) {
  const map = useMap();
  useEffect(() => {
    if (selectedState) {
      const centroid = stateCentroids[selectedState];
      if (centroid) {
        map.flyTo(centroid, 5, { duration: 1.2 });
      }
    }
  }, [selectedState, map]);
  return null;
}

// RainViewer radar timestamps
function useRainViewer() {
  const [radarTimestamp, setRadarTimestamp] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (data?.radar?.past?.length > 0) {
          setRadarTimestamp(data.radar.past[data.radar.past.length - 1].time);
        }
      })
      .catch(() => {});
  }, []);
  return radarTimestamp;
}

export function BrasilMap({ activeLayers, onStateClick, selectedState, dark, weatherMap }: BrasilMapProps) {
  const [geoJson, setGeoJson] = useState<any>(null);
  const radarTimestamp = useRainViewer();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson')
      .then(res => res.json())
      .then(setGeoJson)
      .catch(() => setGeoJson(null));
  }, []);

  // Determine which choropleth layer is active
  const choroplethLayer = useMemo(() => {
    if (activeLayers.includes('temperatura')) return 'temperature';
    if (activeLayers.includes('umidade')) return 'humidity';
    if (activeLayers.includes('ventos')) return 'wind';
      if (activeLayers.includes('chuva')) return 'rain';
      if (activeLayers.includes('aviso')) return 'alert';
    return null;
  }, [activeLayers]);

  const getChoroplethColor = (stateCode: string): { fill: string; opacity: number } => {
    const w = weatherMap[stateCode];
    if (!w || w.loading) return { fill: dark ? '#374151' : '#d1d5db', opacity: 0.3 };
    if (w.error) return { fill: dark ? '#374151' : '#d1d5db', opacity: 0.3 };

    switch (choroplethLayer) {
      case 'temperature':
        return { fill: w.temperature != null ? tempToColor(w.temperature) : '#6b7280', opacity: 0.55 };
      case 'humidity':
        return { fill: w.humidity != null ? humidityToColor(w.humidity) : '#6b7280', opacity: 0.55 };
      case 'wind':
        return { fill: w.windSpeed != null ? windToColor(w.windSpeed) : '#6b7280', opacity: 0.55 };
      case 'rain':
        return { fill: w.weatherCode != null ? weatherToRainColor(w.weatherCode) : 'transparent', opacity: 0.6 };
      case 'alert':
        if (w.weatherCode != null && w.weatherCode >= 95) return { fill: '#ef4444', opacity: 0.55 };
        if (w.weatherCode != null && w.weatherCode >= 61) return { fill: '#f59e0b', opacity: 0.55 };
        if (w.temperature != null && w.temperature >= 35) return { fill: '#f97316', opacity: 0.55 };
        return { fill: dark ? '#10b981' : '#22c55e', opacity: 0.45 };
      default:
        return { fill: dark ? '#2B3A55' : '#dbeafe', opacity: 0.3 };
    }
  };

  const geoJsonStyle = useMemo(() => ({
    fillColor: dark ? '#2B3A55' : '#dbeafe',
    weight: 1,
    opacity: 0.8,
    color: dark ? '#4B5563' : '#93c5fd',
    fillOpacity: 0.3,
  }), [dark]);

  const onEachFeature = (feature: any, layer: any) => {
    const stateCode = feature.properties.sigla || feature.properties.UF || feature.properties.id;
    const stateName = feature.properties.name || stateNames[stateCode] || stateCode;
    const { fill, opacity } = getChoroplethColor(stateCode);

    layer.setStyle({ fillColor: fill, fillOpacity: opacity });

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, fillOpacity: 0.7, color: '#FFC72C' });
        e.target.bringToFront();
      },
      mouseout: (e: any) => {
        const { fill: f, opacity: o } = getChoroplethColor(stateCode);
        e.target.setStyle({ fillColor: f, fillOpacity: o, weight: 1, color: dark ? '#4B5563' : '#93c5fd' });
      },
      click: () => {
        onStateClick({ id: stateCode, name: stateName });
      },
    });
  };

  // Base tile layer - changes for satellite
  const showSatellite = activeLayers.includes('satelite');
  const showNumerica = activeLayers.includes('numerica');

  const baseTileUrl = showSatellite
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const layerIndicatorBg = dark ? 'bg-gray-900/90' : 'bg-white/90';
  const layerIndicatorBorder = dark ? 'border-gray-700/50' : 'border-gray-200';

  // Get active layer labels for indicators
  const activeLayerLabels: { label: string; color: string }[] = [];
  if (showSatellite) activeLayerLabels.push({ label: 'Satélite GOES-16', color: 'text-blue-500' });
  if (activeLayers.includes('radar')) activeLayerLabels.push({ label: 'Radar RainViewer', color: 'text-green-500' });
  if (activeLayers.includes('frentes')) activeLayerLabels.push({ label: 'Frentes Frias', color: 'text-purple-500' });
  if (activeLayers.includes('raios')) activeLayerLabels.push({ label: 'Descargas Elétricas', color: 'text-yellow-500' });
  if (activeLayers.includes('queimadas')) activeLayerLabels.push({ label: 'Foco de Queimadas', color: 'text-orange-500' });
  if (showNumerica) activeLayerLabels.push({ label: 'Previsão GFS', color: 'text-emerald-500' });
  if (choroplethLayer === 'temperature') activeLayerLabels.push({ label: 'Temperatura por Estado', color: 'text-red-400' });
  if (choroplethLayer === 'humidity') activeLayerLabels.push({ label: 'Umidade por Estado', color: 'text-cyan-400' });
  if (choroplethLayer === 'wind') activeLayerLabels.push({ label: 'Vento por Estado', color: 'text-teal-400' });

  if (choroplethLayer === 'rain') activeLayerLabels.push({ label: 'Precipitação por Estado', color: 'text-blue-400' });
  if (choroplethLayer === 'alert') activeLayerLabels.push({ label: 'Alertas por Estado', color: 'text-amber-400' });

  return (
    <div className="relative w-full h-[600px]">
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: dark ? '#0f172a' : '#e0f2fe' }}
      >
        {/* Base tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={baseTileUrl}
          key={showSatellite ? 'satellite' : dark ? 'dark' : 'light'}
        />

        {/* Radar overlay (RainViewer) */}
        {activeLayers.includes('radar') && radarTimestamp && (
          <TileLayer
            url={`https://tilecache.rainviewer.com/v2/radar/${radarTimestamp}/512/{z}/{x}/{y}/4/1_1.png`}
            opacity={0.6}
            zIndex={10}
          />
        )}

        {/* Numerical forecast overlay */}
        {showNumerica && (
          <TileLayer
            url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=b69250fc342e819e80d6c2ae7e5c8e8f"
            opacity={0.4}
            zIndex={10}
          />
        )}

        {/* Queimadas (fire spots) overlay */}
        {activeLayers.includes('queimadas') && (
          <TileLayer
            url="https://tile.openweathermap.org/map/smoke_new/{z}/{x}/{y}.png?appid=b69250fc342e819e80d6c2ae7e5c8e8f"
            opacity={0.5}
            zIndex={10}
          />
        )}

        {/* Lightning overlay */}
        {activeLayers.includes('raios') && (
          <TileLayer
            url="https://tile.openweathermap.org/map/newprecipitation/{z}/{x}/{y}.png?appid=b69250fc342e819e80d6c2ae7e5c8e8f"
            opacity={0.35}
            zIndex={10}
          />
        )}

        {/* Cold front lines overlay */}
        {activeLayers.includes('frentes') && (
          <TileLayer
            url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=b69250fc342e819e80d6c2ae7e5c8e8f"
            opacity={0.3}
            zIndex={10}
          />
        )}

        {/* State choropleth GeoJSON */}
        {geoJson && (
          <GeoJSON
            key={`${choroplethLayer}-${dark}`}
            data={geoJson}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        <MapUpdater selectedState={selectedState} />
      </MapContainer>

      {/* Active layer indicators */}
      {activeLayerLabels.length > 0 && (
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
          {activeLayerLabels.map((l, i) => (
            <div key={i} className={`${layerIndicatorBg} backdrop-blur-sm border ${layerIndicatorBorder} rounded-lg px-3 py-1.5 text-xs font-medium ${l.color}`}>
              Camada: {l.label}
            </div>
          ))}
        </div>
      )}

      {/* Choropleth legend */}
      {choroplethLayer && choroplethLayer !== 'rain' && choroplethLayer !== 'alert' && (
        <div className={`absolute bottom-4 right-4 ${layerIndicatorBg} backdrop-blur-sm border ${layerIndicatorBorder} rounded-xl p-3 z-[1000]`}>
          <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>
            {choroplethLayer === 'temperature' && 'Temperatura (°C)'}
            {choroplethLayer === 'humidity' && 'Umidade (%)'}
            {choroplethLayer === 'wind' && 'Vento (km/h)'}
          </p>
          <div className="flex gap-1">
            {choroplethLayer === 'temperature' && (
              <>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-blue-500" /><span className="text-[9px] text-gray-400">10</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-cyan-500" /><span className="text-[9px] text-gray-400">18</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-green-500" /><span className="text-[9px] text-gray-400">24</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-yellow-500" /><span className="text-[9px] text-gray-400">30</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-orange-500" /><span className="text-[9px] text-gray-400">35</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-red-500" /><span className="text-[9px] text-gray-400">+</span></div>
              </>
            )}
            {choroplethLayer === 'humidity' && (
              <>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-orange-500" /><span className="text-[9px] text-gray-400">30</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-yellow-500" /><span className="text-[9px] text-gray-400">50</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-green-500" /><span className="text-[9px] text-gray-400">70</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-cyan-500" /><span className="text-[9px] text-gray-400">85</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-blue-500" /><span className="text-[9px] text-gray-400">+</span></div>
              </>
            )}
            {choroplethLayer === 'wind' && (
              <>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-green-500" /><span className="text-[9px] text-gray-400">10</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-yellow-500" /><span className="text-[9px] text-gray-400">20</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-orange-500" /><span className="text-[9px] text-gray-400">40</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-red-500" /><span className="text-[9px] text-gray-400">60</span></div>
                <div className="flex flex-col items-center"><div className="w-6 h-3 rounded bg-red-700" /><span className="text-[9px] text-gray-400">+</span></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Alert legend */}
      {choroplethLayer === 'alert' && (
        <div className={`absolute bottom-4 right-4 ${layerIndicatorBg} backdrop-blur-sm border ${layerIndicatorBorder} rounded-xl p-3 z-[1000]`}>
          <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>Legenda de Alertas</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Tempestade</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Chuva</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Calor</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Normal</span></div>
          </div>
        </div>
      )}

      {/* Rain legend */}
      {choroplethLayer === 'rain' && (
        <div className={`absolute bottom-4 right-4 ${layerIndicatorBg} backdrop-blur-sm border ${layerIndicatorBorder} rounded-xl p-3 z-[1000]`}>
          <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>Precipitação</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-300" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Leve</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Moderada</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-700" /><span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Forte</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
