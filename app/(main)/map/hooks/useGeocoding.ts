'use client';

import { useState, useEffect } from 'react';
import { reverseGeocode } from '../services';
import type { LocationData } from '../services/reverseGeocode';
import type { Coordinates } from '@/comunidad/types';

/**
 * Hook para manejar geocodificación con estado React
 * Proporciona loading, error y datos de ubicación
 */
export function useGeocoding(coordinates: Coordinates | null) {
  const [address, setAddress] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coordinates) {
      setAddress(null);
      setError(null);
      return;
    }

    const fetchAddress = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await reverseGeocode(coordinates.lat, coordinates.lng);
        setAddress(result);
      } catch (err) {
        const error = err as Error;
        setError(error);
        setAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [coordinates]);

  return { address, isLoading, error };
}
