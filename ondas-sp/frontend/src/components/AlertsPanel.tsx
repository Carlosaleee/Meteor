import type { SurfScore, SurfSummary } from '../types';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Props {
  score?: SurfScore | null;
  summary: SurfSummary | null;
}

function getAlertLevel(score: number): { icon: React.ReactNode; color: string; bg: string; border: string; text: string } {
  if (score >= 8) return {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'Condições excelentes para surf!',
  };
  if (score >= 6) return {
    icon: <TrendingUp className="w-5 h-5 text-ocean-500" />,
    color: 'text-ocean-700 dark:text-ocean-300',
    bg: 'bg-ocean-50 dark:bg-ocean-900/20',
    border: 'border-ocean-200 dark:border-ocean-800',
    text: 'Boas condições para surf.',
  };
  if (score >= 4) return {
    icon: <Info className="w-5 h-5 text-yellow-500" />,
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'Condições regulares. Avalie antes de ir.',
  };
  return {
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'Condições desfavoráveis. Não recomendado.',
  };
}

function getAlertsFromWeather(summary: SurfSummary | null): string[] {
  if (!summary) return [];
  const alerts: string[] = [];
  const weather = summary.weatherSummary?.toLowerCase() || '';
  const waves = summary.waveSummary?.toLowerCase() || '';

  if (weather.includes('vento forte') || weather.includes('rajada')) {
    alerts.push('Vento forte pode afetar a qualidade das ondas');
  }
  if (weather.includes('chuva') || weather.includes('tempestade')) {
    alerts.push('Possibilidade de chuva durante o dia');
  }
  if (waves.includes('flat') || waves.includes('sem onda')) {
    alerts.push('Condições flat - sem ondas significativas');
  }
  if (waves.includes('grande') || waves.includes('forte')) {
    alerts.push('Ondas grandes - precaução para iniciantes');
  }

  return alerts;
}

export function AlertsPanel({ score, summary }: Props) {
  const alerts = getAlertsFromWeather(summary);
  const hasScore = score != null && score.score > 0;

  if (!hasScore && alerts.length === 0) return null;

  const scoreAlert = hasScore ? getAlertLevel(score!.score) : null;

  return (
    <div className="space-y-3">
      {/* Main alert based on score */}
      {hasScore && scoreAlert && (
        <div className={`glass-card rounded-xl p-4 border ${scoreAlert.bg} ${scoreAlert.border} flex items-center gap-3`}>
          {scoreAlert.icon}
          <div>
            <p className={`text-sm font-semibold ${scoreAlert.color}`}>{scoreAlert.text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Score: {score!.score}/10 — {score!.level}
            </p>
          </div>
        </div>
      )}

      {/* Weather/Wave alerts */}
      {alerts.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20" role="alert" aria-label="Alerta de condições">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Alertas</p>
          </div>
          <ul className="space-y-1">
            {alerts.map((alert, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Summary preview */}
      {summary && (
        <div className="glass-card rounded-xl p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Resumo IA</p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {summary.fullSummary}
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">
            Melhor horário: <strong>{summary.bestTimeToSurf}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
