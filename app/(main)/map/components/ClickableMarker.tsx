'use client';

import { useRouter } from 'next/navigation';
import { BaseMarker } from '@/map/index';
import { usePanelLoaderStore } from '../stores/usePanelStore';
import type { CommunityForMap } from '../../comunidad/types';

interface ClickableMarkerProps {
  community: CommunityForMap;
}

export default function ClickableMarker({ community }: ClickableMarkerProps) {
  const router = useRouter();
  const { setLoading } = usePanelLoaderStore();

  const handleClick = () => {
    setLoading(true); // ← Instantáneo
    router.push(`/comunidad/ver/${community.id}`, { scroll: false });
  };

  const handleMouseEnter = () => {
    router.prefetch(`/comunidad/ver/${community.id}`);
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
