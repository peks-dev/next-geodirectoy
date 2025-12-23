'use client';

import { useGlobalOverlayStore } from '@/lib/stores/useGlobalOverlayStore';

export function GlobalOverlay() {
  const { isActive } = useGlobalOverlayStore();

  if (!isActive) return null;

  return <div className="fixed inset-0 z-[35] bg-black/50" />;
}
