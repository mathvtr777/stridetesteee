import { useCallback, useEffect, useRef, useState } from 'react';
import { calculateDistance } from '@/lib/geoUtils';

interface GeoPoint {
  lat: number;
  lng: number;
  t: number;
  accuracy: number;
}

interface UseGeolocationOptions {
  onPoint?: (point: GeoPoint) => void;
  minDistance?: number;
  maxAccuracy?: number;
}

// Definindo um limite máximo de precisão para aceitar uma posição para exibição (1000 metros)
const MAX_DISPLAY_ACCURACY = 1000;

export function useGeolocation(options: UseGeolocationOptions = {}) {
  // minDistance: 5 meters, maxAccuracy: 50 meters (slightly relaxed for initial fix)
  const { onPoint, minDistance = 5, maxAccuracy = 50 } = options;

  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<GeoPoint | null>(null);
  const hasStableFixRef = useRef(false);

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported');
      return;
    }

    setIsTracking(true);
    setError(null);
    hasStableFixRef.current = false;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Debug: Log GPS data
        console.log('🛰️ GPS Update:', {
          lat: latitude,
          lng: longitude,
          accuracy: `${accuracy.toFixed(0)}m`,
          timestamp: new Date(position.timestamp).toLocaleTimeString()
        });

        // SEMPRE atualiza currentPosition com a última leitura, independentemente da precisão.
        // O LiveRun.tsx decidirá como usar essa posição com base na sua própria lógica de precisão.
        setCurrentPosition(position);

        // Atualiza a mensagem de erro com base na precisão para informar o usuário
        if (accuracy > MAX_DISPLAY_ACCURACY) {
          if (!hasStableFixRef.current) {
            setError(`Waiting for better GPS signal (Accuracy: ${accuracy.toFixed(0)}m)`);
          }
          // Se a precisão for muito ruim para exibição, não tentamos gravar o ponto.
          return;
        }

        // Se chegamos aqui, a precisão é aceitável para exibição (<= 1000m)
        hasStableFixRef.current = true;
        setError(null); // Limpa o erro se tivermos uma correção estável

        const newPoint: GeoPoint = {
          lat: latitude,
          lng: longitude,
          t: position.timestamp,
          accuracy,
        };

        // Filtro adicional para gravação da rota (deve ser altamente preciso, <= maxAccuracy)
        if (accuracy > maxAccuracy) { // maxAccuracy é 50m
          // Não chama onPoint se a precisão não for boa o suficiente para gravação
          return;
        }

        // Verifica a distância mínima do último ponto para gravação
        if (lastPointRef.current) {
          const distanceKm = calculateDistance(
            lastPointRef.current.lat,
            lastPointRef.current.lng,
            latitude,
            longitude
          );
          const distanceMeters = distanceKm * 1000;

          if (distanceMeters < minDistance) {
            return;
          }
        }

        // Registra e despacha o ponto para a rota
        lastPointRef.current = newPoint;
        onPoint?.(newPoint);
      },
      (err) => {
        // Códigos de erro de geolocalização: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        let errorMessage = 'GPS Error: Could not determine location.';
        if (err.code === 1) {
          errorMessage = 'GPS Permission Denied. Please enable location services for Stride.';
        } else if (err.code === 3) {
          errorMessage = 'GPS Timeout. Trying to reconnect...';
        } else if (err.code === 2) {
          errorMessage = 'GPS Unavailable. Check your device settings.';
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0, // Não aceitar posições em cache, sempre buscar nova posição
        timeout: 30000, // 30 segundos para dar tempo ao GPS de obter sinal preciso
      }
    );
  }, [onPoint, minDistance, maxAccuracy]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    lastPointRef.current = null;
    hasStableFixRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    currentPosition,
    error,
    isTracking,
    startTracking,
    stopTracking,
  };
}