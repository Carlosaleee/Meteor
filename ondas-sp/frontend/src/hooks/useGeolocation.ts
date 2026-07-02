import { useState, useCallback } from 'react';

interface GeolocationState {
  position: [number, number] | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: false,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocalização não suportada pelo navegador' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: [position.coords.latitude, position.coords.longitude],
          loading: false,
          error: null,
        });
      },
      (error) => {
        let msg = 'Erro ao obter localização';
        if (error.code === error.PERMISSION_DENIED) msg = 'Permissão de localização negada';
        else if (error.code === error.POSITION_UNAVAILABLE) msg = 'Localização indisponível';
        else if (error.code === error.TIMEOUT) msg = 'Tempo esgotado ao obter localização';
        setState({ position: null, loading: false, error: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestLocation };
}
