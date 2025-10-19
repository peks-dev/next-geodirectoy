'use client';

import { Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createLeafletIcon } from './iconUtils';
import MarkerIcon from './MarkerIcon';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import Button from '@/components/ui/Button';
import type { CommunitieLocation } from './types';

interface CommunitieMarkerProps {
  location: CommunitieLocation;
  enablePopup?: boolean;
  onMarkerClick?: (id: string) => Promise<unknown>;
}

/**
 * Componente individual de marcador de comunidad
 *
 * Renderiza un marcador con icono personalizado que se adapta al tema.
 * Incluye un popup con un botón para navegar a la página individual de la comunidad.
 */
export default function CommunitieMarker({
  location,
  enablePopup = false,
  onMarkerClick,
}: CommunitieMarkerProps) {
  const { isDark } = useAppTheme();
  const router = useRouter();

  // Crear icono con color dinámico basado en tema
  const icon = useMemo(() => {
    const colorClass = isDark ? 'text-white-primary' : 'text-dark-primary';
    return createLeafletIcon(<MarkerIcon />, colorClass);
  }, [isDark]);

  const handleClick = async () => {
    if (enablePopup && onMarkerClick) {
      await onMarkerClick(location.id);
    }
  };

  const handleNavigate = () => {
    router.push(`/comunidad/${location.id}`);
  };

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      {enablePopup && (
        <Popup>
          <div className="flex flex-col gap-2 p-2">
            <p className="text-foreground-primary text-sm font-medium">
              Ver detalles de la comunidad
            </p>
            <Button
              onClick={handleNavigate}
              variant="primary"
              className="w-full"
            >
              Ver comunidad
            </Button>
          </div>
        </Popup>
      )}
    </Marker>
  );
}
