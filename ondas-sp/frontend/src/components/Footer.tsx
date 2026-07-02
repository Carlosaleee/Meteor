import { Waves, Github, MapPin, ExternalLink, Code2 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" aria-label="Rodapé do site" className="relative mt-12">
      {/* Separator */}
      <div className="neon-line" aria-hidden="true" />

      <div className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Header — Brand */}
          <div className="flex items-center gap-3 mb-8">
            <Waves className="w-6 h-6 text-ocean-400" aria-hidden="true" />
            <h2 className="text-xl font-extrabold tracking-tight">Ilha Comp Surf</h2>
          </div>

          {/* 4 Columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

            {/* Col 1 — Dados Oceânicos */}
            <div>
              <h3 className="text-[10px] font-bold text-ocean-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-ocean-400 rounded-full" aria-hidden="true" />
                Dados Oceânicos
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    Open-Meteo Marine API
                  </a>
                </li>
                <li className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                  Dados de swell, ondas e maré
                </li>
              </ul>
            </div>

            {/* Col 2 — Dados Meteorológicos */}
            <div>
              <h3 className="text-[10px] font-bold text-ocean-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-ocean-400 rounded-full" aria-hidden="true" />
                Dados Meteorológicos
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    Open-Meteo Weather API
                  </a>
                </li>
                <li className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                  Tempo, vento, temperatura e UV
                </li>
              </ul>
            </div>

            {/* Col 3 — Mapas */}
            <div>
              <h3 className="text-[10px] font-bold text-ocean-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-ocean-400 rounded-full" aria-hidden="true" />
                Mapas
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    Leaflet.js
                  </a>
                </li>
                <li>
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    OpenStreetMap
                  </a>
                </li>
                <li className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                  Marcadores, rotas e geolocalização
                </li>
              </ul>
            </div>

            {/* Col 4 — Projeto */}
            <div>
              <h3 className="text-[10px] font-bold text-ocean-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-ocean-400 rounded-full" aria-hidden="true" />
                Projeto
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com/Carlosaleee/Meteor" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                    Repositório GitHub
                  </a>
                </li>
                <li>
                  <span className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Code2 className="w-3 h-3" aria-hidden="true" />
                    Java 21 · Spring Boot 3 · React · PostgreSQL
                  </span>
                </li>
                <li>
                  <a href="https://github.com/Carlosaleee/Meteor" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-ocean-400 transition-colors flex items-center gap-2 group">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    Ilha Comprida, SP
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar — institutional */}
          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>
              &copy; {currentYear}{' '}
              <span className="font-semibold text-gray-500">Ilha Comp Surf</span>
              {' · '}
              <a href="https://github.com/Carlosaleee" target="_blank" rel="noopener noreferrer"
                className="text-ocean-500 hover:text-ocean-400 transition-colors">
                Carlos Alexandre
              </a>
            </p>
            <p className="flex items-center gap-1.5">
              Powered by Open-Meteo · Leaflet · OpenStreetMap
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
