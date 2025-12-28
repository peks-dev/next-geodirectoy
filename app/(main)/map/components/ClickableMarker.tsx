'use client';

import { useCustomNavigation } from '@/lib/hooks/useNavigation';
import { BaseMarker } from '@/map/index';
import { usePanelLoaderStore } from '../stores/usePanelStore';
import type { CommunityForMap } from '../../comunidad/types';

interface ClickableMarkerProps {
  community: CommunityForMap;
}

export default function ClickableMarker({ community }: ClickableMarkerProps) {
  const { navigate } = useCustomNavigation();
  const { setLoading } = usePanelLoaderStore();

  const handleClick = () => {
    setLoading(true); // ← Instantáneo
    navigate(`/comunidad/ver/${community.id}`, { scroll: false });
  };

  const handleMouseEnter = () => {
    // Prefetch is handled by the custom navigate hook internally
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <BaseMarker
        position={community.location}
        iconColorClass="text-primary"
        onClick={handleClick}
      />
    </div>
  );
}
