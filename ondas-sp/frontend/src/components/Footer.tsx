import { Waves, Github, Heart, ExternalLink, Code2, MapPin, Eye, Keyboard, Monitor } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" aria-label="Rodapé do site" className="relative mt-12">
      {/* Neon separator */}
      <div className="neon-line" aria-hidden="true" />

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Top — App name */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Waves className="w-7 h-7 text-ocean-500 animate-bounce" style={{ animationDuration: '3s' }} aria-hidden="true" />
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Ilha Comp Surf</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Previsão do tempo e ondas em tempo real para Ilha Comprida, SP
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-2">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span>-24.81, -47.88 — Ilha Comprida, SP</span>
            </div>
          </div>

          {/* Middle — 3 columns */}
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {/* Col 1: Fontes de Dados */}
            <div className="text-center sm:text-left">
              <h3 className="text-xs font-bold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <span className="w-8 h-[2px] bg-ocean-500 dark:bg-ocean-400 rounded-full" aria-hidden="true" />
                Fontes de Dados
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open-Meteo API - abre em nova aba"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-ocean-500 dark:hover:text-ocean-400 transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start group"
                  >
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    Open-Meteo API
                  </a>
                </li>
                <li>
                  <a
                    href="https://open-meteo.com/en/docs/marine-weather-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open-Meteo Marine API - abre em nova aba"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-ocean-500 dark:hover:text-ocean-400 transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start group"
                  >
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    Open-Meteo Marine
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2: Projeto */}
            <div className="text-center sm:text-left">
              <h3 className="text-xs font-bold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <span className="w-8 h-[2px] bg-ocean-500 dark:bg-ocean-400 rounded-full" aria-hidden="true" />
                Projeto
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/Carlosaleee/Meteor"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Repositório GitHub do projeto - abre em nova aba"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-ocean-500 dark:hover:text-ocean-400 transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start group"
                  >
                    <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                    Repositório GitHub
                  </a>
                </li>
                <li>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Stack: Java 21, Spring Boot 3, React, PostgreSQL
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 3: Desenvolvedor */}
            <div className="text-center sm:text-left">
              <h3 className="text-xs font-bold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <span className="w-8 h-[2px] bg-ocean-500 dark:bg-ocean-400 rounded-full" aria-hidden="true" />
                Desenvolvedor
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-ocean-500/20" aria-hidden="true">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Carlos Alexandre</p>
                    <p className="text-[10px] text-ocean-500 dark:text-ocean-400 font-semibold">Fullstack Developer</p>
                  </div>
                </div>
                <a
                  href="https://github.com/Carlosaleee"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Perfil GitHub de Carlos Alexandre - abre em nova aba"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-ocean-500 dark:hover:text-ocean-400 transition-all duration-200 group"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  @Carlosaleee
                </a>
              </div>
            </div>
          </div>

          {/* Accessibility info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 py-3 px-4 rounded-xl bg-ocean-50/50 dark:bg-ocean-900/10 border border-ocean-100 dark:border-ocean-800/20">
            <span className="text-[11px] font-semibold text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">Acessibilidade:</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Keyboard className="w-3.5 h-3.5 text-ocean-400" aria-hidden="true" />
              <span>Navegação por teclado</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Eye className="w-3.5 h-3.5 text-ocean-400" aria-hidden="true" />
              <span>Alto contraste</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Monitor className="w-3.5 h-3.5 text-ocean-400" aria-hidden="true" />
              <span>Responsivo</span>
            </div>
          </div>

          {/* Bottom — Credits */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              &copy; {currentYear}{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-300">Ilha Comp Surf</span>
              {' '}— Desenvolvido por{' '}
              <a
                href="https://github.com/Carlosaleee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Carlos Alexandre"
                className="text-ocean-500 dark:text-ocean-400 hover:underline focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded"
              >
                Carlos Alexandre
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              Feito com <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" aria-hidden="true" /> para Ilha Comprida, SP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
