import type {
  CourtId,
  Coordinates,
  CommunityForMap,
} from '@/app/types/communityTypes';
export interface CommunitieLocation extends CourtId, Coordinates {}

export interface MapProps {
  /** Array de ubicaciones de canchas para renderizar marcadores */
  locations?: CommunitieLocation[];
  communities?: CommunityForMap[];
  /** Habilita popups al hacer click en marcadores */
  enablePopups?: boolean;
  /** Función para obtener datos del popup cuando se hace click */
  onMarkerClick?: (id: string) => Promise<unknown>;
  children?: React.ReactNode;
  center?: Coordinates;
  zoom?: number;
}
