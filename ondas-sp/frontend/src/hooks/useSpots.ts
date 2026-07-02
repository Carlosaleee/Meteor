import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Spot } from '../types';

/**
 * Hook to fetch surf spots from the backend.
 * Spots are static data so we only fetch once on mount.
 */
export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    api.spots()
      .then((data) => setSpots(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { spots, loading, error, refetch: fetch };
}
