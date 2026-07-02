import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { SurfScore } from '../types';

export function useSurfScore() {
  const [score, setScore] = useState<SurfScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    api.surfScore()
      .then(setScore)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { score, loading, error, refetch: fetch };
}
