import { Layers } from 'lucide-react';
import type { ComponentType } from 'react';

interface Layer {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface LayerControlsProps {
  layers: Layer[];
  activeLayers: string[];
  onToggle: (id: string) => void;
  dark: boolean;
}

export function LayerControls({ layers, activeLayers, onToggle, dark }: LayerControlsProps) {
  const cardBg = dark
    ? 'bg-gradient-to-br from-[#1E2A44] to-[#2B3A55] border-gray-700/50'
    : 'bg-white border-gray-200 shadow-lg';
  const textPrimary = dark ? 'text-white' : 'text-gray-900';

  return (
    <div className="w-56 shrink-0">
      <div className={`${cardBg} rounded-2xl border p-4 shadow-xl transition-colors duration-300`}>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-amber-500" />
          <h3 className={`${textPrimary} font-semibold text-sm`}>Camadas</h3>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            {activeLayers.length}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {layers.map(layer => {
            const isActive = activeLayers.includes(layer.id);
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => onToggle(layer.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-300'
                    : dark
                      ? 'bg-gray-800/40 border border-transparent text-gray-400 hover:bg-gray-700/40 hover:text-gray-300'
                      : 'bg-gray-50 border border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{layer.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
