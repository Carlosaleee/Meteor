import type { SurfScore } from '../types';
import { Trophy, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props { data: SurfScore; }

function getScoreColor(score: number): string {
  if (score >= 8) return 'from-green-400 to-emerald-500';
  if (score >= 6) return 'from-ocean-400 to-cyan-500';
  if (score >= 4) return 'from-yellow-400 to-amber-500';
  return 'from-red-400 to-rose-500';
}

function getScoreTextColor(score: number): string {
  if (score >= 8) return 'text-green-500';
  if (score >= 6) return 'text-ocean-500';
  if (score >= 4) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  if (score >= 6) return 'bg-ocean-50 dark:bg-ocean-900/20 border-ocean-200 dark:border-ocean-800';
  if (score >= 4) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
}

function getScoreEmoji(score: number): string {
  if (score >= 9) return '🏆';
  if (score >= 7) return '🏄';
  if (score >= 5) return '👍';
  if (score >= 3) return '⚠️';
  return '❌';
}

export function SurfScoreCard({ data }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const target = data.score;
    const duration = 1000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [data.score]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (animatedScore / 10) * circumference;

  return (
    <div className={`glass-card-hover rounded-2xl p-6 group border ${getScoreBg(data.score)}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" /> Score de Surf
      </h2>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
              className="text-gray-100 dark:text-gray-700" />
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{ stroke: `url(#scoreGradient)` }} />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: getScoreColor(data.score).includes('green') ? '#4ade80' : getScoreColor(data.score).includes('ocean') ? '#0ea5e9' : getScoreColor(data.score).includes('yellow') ? '#facc15' : '#f87171' }} />
                <stop offset="100%" style={{ stopColor: getScoreColor(data.score).includes('green') ? '#10b981' : getScoreColor(data.score).includes('ocean') ? '#06b6d4' : getScoreColor(data.score).includes('yellow') ? '#f59e0b' : '#f43f5e' }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold ${getScoreTextColor(data.score)}`}>
              {animatedScore.toFixed(0)}
            </span>
            <span className="text-xs text-gray-500">/10</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-sm backdrop-blur-sm">
          <span className="text-xl">{getScoreEmoji(data.score)}</span>
          <span className="font-bold text-gray-800 dark:text-white">{data.level}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="p-2 rounded-lg bg-ocean-100 dark:bg-ocean-900/30">
            <Clock className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Melhor horário</p>
            <p className="font-bold text-gray-800 dark:text-white">{data.bestTime}h</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Recomendação</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{data.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
