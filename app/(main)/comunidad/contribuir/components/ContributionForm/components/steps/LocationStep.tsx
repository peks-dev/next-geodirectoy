'use client';

import { useState, useEffect } from 'react';
import { BaseDynamicMap, BaseDraggableMarker } from '@/app/(main)/map';
import { useGeocoding } from '@/app/(main)/map/hooks/useGeocoding';
import type { Coordinates } from '@/comunidad/types';
import { useContributionStore } from '@/contribuir/stores/useContributionStore';
import { useDebounce } from '@/lib/hooks/useDebounce';

const DEFAULT_LOCATION: Coordinates = {
  lat: 20.9674,
  lng: -89.5926,
};

export default function LocationStep() {
  const { location, city, state, country, updateFormField } =
    useContributionStore();

  const [currentPosition, setCurrentPosition] = useState<Coordinates>(
    location || DEFAULT_LOCATION
  );
  const debouncedPosition = useDebounce(currentPosition, 750);

  // Usar el hook de geocodificación
  const { address, isLoading } = useGeocoding(debouncedPosition);

  useEffect(() => {
    if (
      debouncedPosition &&
      (debouncedPosition.lat !== location?.lat ||
        debouncedPosition.lng !== location?.lng)
    ) {
      updateFormField('location', debouncedPosition);

      // Actualizar campos de dirección desde el hook
      if (address) {
        updateFormField('city', address.city);
        updateFormField('state', address.state);
        updateFormField('country', address.country);
      }
    }
  }, [debouncedPosition, location, address, updateFormField]);

  const handleMarkerDrag = (coords: Coordinates) => {
    setCurrentPosition(coords);
  };

  return (
    <div className="relative h-full w-full">
      <BaseDynamicMap
        center={[currentPosition.lat, currentPosition.lng]}
        zoom={11}
      >
        <BaseDraggableMarker
          initialPosition={currentPosition}
          onDragEnd={handleMarkerDrag}
        />
      </BaseDynamicMap>

      <div className="bg-background-primary-dark absolute bottom-4 left-1/2 z-[1000] w-11/12 -translate-x-1/2 rounded-lg p-3 text-center shadow-lg">
        <h3 className="text-text-primary font-semibold">Ubicación Detectada</h3>
        {isLoading ? (
          <p className="text-text-secondary">Buscando...</p>
        ) : city || state || country ? (
          <p className="text-text-primary">
            {/* Filtramos para no mostrar valores null o undefined */}
            {[city, state, country].filter(Boolean).join(', ')}
          </p>
        ) : (
          <p className="text-text-secondary">
            Mueve el marcador para encontrar la ubicación
          </p>
        )}
      </div>
    </div>
  );
}
