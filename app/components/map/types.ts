import type { Coordinates, CommunityForMap } from '@/comunidad/types';

export interface MapProps {
  location?: Coordinates | null;
  communities?: CommunityForMap[];
  enablePopups?: boolean;
  children?: React.ReactNode;
  center?: Coordinates;
  zoom?: number;
}
