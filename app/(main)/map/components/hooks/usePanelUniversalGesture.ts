import { useRef, useEffect } from 'react';
import { usePanelSwipeGesture } from './usePanelSwipeGesture';
import { usePanelDesktopGesture } from './usePanelDesktopGesture';

interface UsePanelUniversalGestureProps {
  onClose: () => void;
  dragThreshold?: number;
}

export function usePanelUniversalGesture({
  onClose,
  dragThreshold = 150,
}: UsePanelUniversalGestureProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Hooks para mobile y desktop
  const { panelRef: swipeRef } = usePanelSwipeGesture({
    onClose,
    dragThreshold,
  });
  const { panelRef: desktopRef } = usePanelDesktopGesture({
    onClose,
    dragThreshold,
  });

  // Combinar referencias
  useEffect(() => {
    const ref = panelRef.current;
    if (ref) {
      swipeRef.current = ref;
      desktopRef.current = ref;
    }
  }, [swipeRef, desktopRef]);

  return { panelRef };
}
