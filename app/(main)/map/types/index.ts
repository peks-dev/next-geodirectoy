import type { Coordinates, CommunityForMap } from '@/comunidad/types';
import type { ReactNode } from 'react';

/**
 * Props para el componente Map
 */
export interface MapProps {
  location?: Coordinates | null;
  communities?: CommunityForMap[];
  enablePopups?: boolean;
  children?: React.ReactNode;
  center?: Coordinates;
  zoom?: number;
}

export interface BaseMarkerProps {
  position: Coordinates;
  iconColorClass?: string;
  children?: React.ReactNode;
}

export interface BaseMapProps {
  center?: [number, number];
  zoom?: number;
  children?: ReactNode;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
  scrollWheelZoom?: boolean;
  zoomControl?: boolean;
}

export interface CommunityMarkerProps {
  data: CommunityForMap;
}
