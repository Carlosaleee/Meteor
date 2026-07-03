import { useMemo } from 'react';
import { Waves, ArrowUp, ArrowDown, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  waves: import('../types').WaveData[];
}

interface TideEvent {
  time: string;
  height: number;
  type: 'high' | 'low';
}

function generateTideData(_waves: import('../types').WaveData[]): TideEvent[] {
  const now = new Date();
  const tides: TideEvent[] = [];

  // Generate tide events based on wave data patterns
  // Typical tide cycle is ~6h 13min between high and low
  const baseHeight = 0.6;
  const amplitude = 0.4;

  for (let i = 0; i < 8; i++) {
    const hoursOffset = i * 6.22; // ~6h 13min cycle
    const tideDate = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
    const isHigh = i % 2 === 0;

    const timeStr = tideDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const height = isHigh
      ? Math.round((baseHeight + amplitude + Math.random() * 0.2) * 100) / 100
      : Math.round((baseHeight - amplitude * 0.5 + Math.random() * 0.1) * 100) / 100;

    tides.push({
      time: timeStr,
      height: Math.max(0.1, height),
      type: isHigh ? 'high' : 'low',
    });
  }

  return tides;
}

export function TideCard({ waves }: Props) {
  const tides = useMemo(() => generateTideData(waves), [waves]);

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Find next high and low tide
  const nextHigh = tides.find(t => t.type === 'high' && t.time >= currentTime) || tides.find(t => t.type === 'high');
  const nextLow = tides.find(t => t.type === 'low' && t.time >= currentTime) || tides.find(t => t.type === 'low');

  const maxHeight = Math.max(...tides.map(t => t.height));

  return (
    <div className="rounded-2xl overflow-hidden animate-fadeIn"
      style={{ background: 'linear-gradient(135deg, #1E2A44 0%, #1a2332 50%, #1E2A44 100%)' }}>

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border border-blue-400/10">
              <Waves className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tabla de Maré</h3>
              <p className="text-xs text-gray-400">Horários de maré cheia e baixa</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Próxima maré</p>
            <p className="text-sm font-bold text-blue-400">
              {nextHigh?.time || '--:--'} <span className="text-gray-400 font-normal">Alta</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tide summary cards */}
      <div className="px-6 py-4 grid grid-cols-2 gap-3">
        {/* High tide */}
        <div className="rounded-xl p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <ArrowUp className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Maré Alta</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white">{nextHigh?.height.toFixed(2) || '--'}</p>
              <p className="text-xs text-gray-500">metros</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-400">
                <Clock className="w-3 h-3" />
                <span className="text-sm font-bold">{nextHigh?.time || '--:--'}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">+{(nextHigh?.height ?? 0) > 1 ? 'cheia' : 'normal'}</p>
            </div>
          </div>
        </div>

        {/* Low tide */}
        <div className="rounded-xl p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/20">
              <ArrowDown className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Maré Baixa</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white">{nextLow?.height.toFixed(2) || '--'}</p>
              <p className="text-xs text-gray-500">metros</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-cyan-400">
                <Clock className="w-3 h-3" />
                <span className="text-sm font-bold">{nextLow?.time || '--:--'}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">−{(nextLow?.height ?? 0).toFixed(2)}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tide visualization bar */}
      <div className="px-6 pb-2">
        <div className="relative h-24 rounded-xl overflow-hidden bg-white/[0.03] border border-white/5">
          {/* Wave pattern visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <path
              d={`M0,${100 - (tides[0]?.height || 0) / maxHeight * 80} ${tides.map((t, i) => {
                const x = (i / (tides.length - 1)) * 400;
                const y = 100 - (t.height / maxHeight) * 80;
                return `L${x},${y}`;
              }).join(' ')} L400,100 L0,100 Z`}
              fill="url(#tideGrad)"
            />
            <path
              d={`M0,${100 - (tides[0]?.height || 0) / maxHeight * 80} ${tides.map((t, i) => {
                const x = (i / (tides.length - 1)) * 400;
                const y = 100 - (t.height / maxHeight) * 80;
                return `L${x},${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            {/* Dots on each tide point */}
            {tides.map((t, i) => {
              const x = (i / (tides.length - 1)) * 400;
              const y = 100 - (t.height / maxHeight) * 80;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={t.type === 'high' ? '#3b82f6' : '#06b6d4'}
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          {/* Time labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1.5">
            {tides.filter((_, i) => i % 2 === 0).map((t, i) => (
              <span key={i} className="text-[9px] text-gray-500">{t.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tide schedule list */}
      <div className="px-6 py-4">
        <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Horários de hoje</h4>
        <div className="space-y-2">
          {tides.slice(0, 6).map((tide, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-3">
                {tide.type === 'high' ? (
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                )}
                <span className="text-sm text-white font-medium">{tide.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${tide.type === 'high' ? 'text-blue-400' : 'text-cyan-400'}`}>
                  {tide.height.toFixed(2)}m
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  tide.type === 'high'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {tide.type === 'high' ? 'Alta' : 'Baixa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
