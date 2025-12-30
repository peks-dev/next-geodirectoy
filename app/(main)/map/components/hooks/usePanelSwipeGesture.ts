import { useRef, useEffect } from 'react';

interface UsePanelSwipeGestureProps {
  onClose: () => void;
  dragThreshold?: number;
}

export function usePanelSwipeGesture({
  onClose,
  dragThreshold = 100,
}: UsePanelSwipeGestureProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating.current) return;
      touchStartY.current = e.touches[0].clientY;
      panel.style.transition = 'transform 0s';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current || touchStartY.current === 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;

      if (deltaY > 0) {
        e.preventDefault();
        panel.style.transform = `translateY(${deltaY}px)`;

        // Añadir clase para feedback visual
        panel.classList.add('panel-dragging');
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current || touchStartY.current === 0) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;

      panel.style.transition = 'transform 0.2s ease-out';
      panel.classList.remove('panel-dragging');

      if (deltaY > dragThreshold) {
        // Cerrar panel
        isAnimating.current = true;
        panel.style.transform = 'translateY(100%)';
        panel.style.opacity = '0';

        setTimeout(() => {
          onClose();
          isAnimating.current = false;
        }, 200);
      } else {
        // Volver a posición original
        panel.style.transform = 'translateY(0)';
      }

      touchStartY.current = 0;
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd);

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClose, dragThreshold]);

  return { panelRef };
}
