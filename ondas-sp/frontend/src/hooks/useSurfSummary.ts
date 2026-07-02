import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { SurfSummary } from '../types';

export function useSurfSummary() {
  const [summary, setSummary] = useState<SurfSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    api.surfSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, loading, error, refetch: fetch };
}
