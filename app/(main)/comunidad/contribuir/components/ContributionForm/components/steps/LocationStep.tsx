'use client';

import { useState, useEffect } from 'react';
import DynamicMap from '@/components/map/DynamicMap';
import DynamicDraggableMarker from '@/components/map/DynamicDraggableMarker';
import type { Coordinates } from '@/app/types/communityTypes';
import { useContributionStore } from '@/contribuir/stores/useContributionStore';
import { useDebounce } from '@/lib/hooks/useDebounce';
// 1. Importa tu función de geocodificación directamente
import { reverseGeocode } from '@/lib/geocoding/reverseGeocode';

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
  const [isLoading, setIsLoading] = useState(false);
  const debouncedPosition = useDebounce(currentPosition, 750);

  useEffect(() => {
    if (
      debouncedPosition &&
      (debouncedPosition.lat !== location?.lat ||
        debouncedPosition.lng !== location?.lng)
    ) {
      const fetchLocationData = async () => {
        setIsLoading(true);
        updateFormField('location', debouncedPosition);

        try {
          // 2. Llama a tu función directamente en lugar de usar fetch
          const data = await reverseGeocode(
            debouncedPosition.lat,
            debouncedPosition.lng
          );

          // Actualizamos el store con la respuesta
          updateFormField('city', data.city);
          updateFormField('state', data.state);
          updateFormField('country', data.country);
        } catch (error) {
          console.error('Error fetching geocode data:', error);
          updateFormField('city', null);
          updateFormField('state', null);
          updateFormField('country', null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocationData();
    }
  }, [debouncedPosition, location, updateFormField]);

  const handleMarkerDrag = (coords: Coordinates) => {
    setCurrentPosition(coords);
  };

  return (
    <div className="relative h-full w-full">
      <DynamicMap center={currentPosition} zoom={11}>
        <DynamicDraggableMarker
          initialPosition={currentPosition}
          onDragEnd={handleMarkerDrag}
        />
      </DynamicMap>

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
