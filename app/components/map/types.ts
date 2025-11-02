import type { Coordinates, CommunityForMap } from '@/app/types/communityTypes';

export interface MapProps {
  location?: Coordinates | null;
  communities?: CommunityForMap[];
  enablePopups?: boolean;
  children?: React.ReactNode;
  center?: Coordinates;
  zoom?: number;
}
