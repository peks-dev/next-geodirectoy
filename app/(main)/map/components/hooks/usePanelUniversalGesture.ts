import { useRef } from 'react';
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

  usePanelSwipeGesture({
    panelRef,
    onClose,
    dragThreshold,
  });

  usePanelDesktopGesture({
    panelRef,
    onClose,
    dragThreshold,
  });

  return { panelRef };
}
