import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { WaveData } from '../types';

export function useWaves() {
  const [waves, setWaves] = useState<WaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    api.wavesCurrent()
      .then(setWaves)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { waves, loading, error, refetch: fetch };
}
