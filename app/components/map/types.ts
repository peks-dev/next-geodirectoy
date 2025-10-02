import type { CourtId, Coordinates } from '@/app/types/communityTypes';
export interface CommunitieLocation extends CourtId, Coordinates {}

export interface MapProps {
  /** Array de ubicaciones de canchas para renderizar marcadores */
  locations?: CommunitieLocation[];
  /** Habilita popups al hacer click en marcadores */
  enablePopups?: boolean;
  /** Función para obtener datos del popup cuando se hace click */
  onMarkerClick?: (id: string) => Promise<unknown>;
}
