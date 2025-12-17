'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { usePanelLoaderStore } from '@/app/(main)/map/stores/usePanelStore';
import type { CommunityFullResponse } from '@/comunidad/types';
import HeaderCommunity from '@/comunidad/components/HeaderCommunity';
import ContentCommunity from '@/comunidad/components/ContentCommunity';

interface PanelContentProps {
  community: CommunityFullResponse;
}

export default function PanelContent({ community }: PanelContentProps) {
  const router = useRouter();
  const { setLoading } = usePanelLoaderStore();

  // Ocultar loading cuando el modal se monta
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="grow" onClick={handleClose}></div>

      <div className="transparent-container relative mt-auto h-[94vh] w-[100vw] grow-0 overflow-hidden py-2 shadow-2xl">
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            aria-label="Cerrar"
            className="cursor-grab"
          >
            <div className="bg-accent-primary h-2 w-40 rounded-full"></div>
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          <div className="gap-lg flex h-full w-full flex-col p-4 lg:flex-row">
            <HeaderCommunity
              name={community.name}
              images={community.images}
              description={community.description}
            />
            <ContentCommunity community={community} />
          </div>
        </div>
      </div>
    </div>
  );
}
