import type { SurfSummary } from '../types';
import { Bot, Clock, Cloud, Waves, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props { data: SurfSummary; }

export function SurfSummaryCard({ data }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!data.fullSummary) return;
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < data.fullSummary.length) {
        setDisplayedText(data.fullSummary.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [data.fullSummary]);

  return (
    <div className="glass-card-hover rounded-2xl p-6 group md:col-span-2 border border-purple-100 dark:border-purple-900/30 bg-gradient-to-br from-white/70 to-purple-50/50 dark:from-gray-800/70 dark:to-gray-800/50" role="region" aria-label="Resumo da análise de surf">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="relative">
            <Bot className="w-6 h-6 text-purple-500" />
            <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          Resumo IA
        </h2>
        {isTyping && (
          <span className="text-xs text-purple-500 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </div>

      <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4 mb-4 min-h-[80px] backdrop-blur-sm">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayedText}
          {isTyping && <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
            <Cloud className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Clima</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{data.weatherSummary}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-xl bg-ocean-50/80 dark:bg-ocean-900/20 border border-ocean-100 dark:border-ocean-800/30 backdrop-blur-sm">
          <div className="p-2 rounded-lg bg-ocean-100 dark:bg-ocean-800/30">
            <Waves className="w-5 h-5 text-ocean-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Ondas</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{data.waveSummary}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30 backdrop-blur-sm">
        <Clock className="w-5 h-5 text-purple-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Melhor horário para surfar: <strong className="text-purple-600 dark:text-purple-400">{data.bestTimeToSurf}</strong>
        </span>
      </div>
    </div>
  );
}
