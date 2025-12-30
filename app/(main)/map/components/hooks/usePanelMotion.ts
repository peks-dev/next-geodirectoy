import { useState, useRef, useEffect } from 'react';

interface UsePanelMotionProps {
  onClose: () => void;
  dragThreshold?: number;
}

export function usePanelMotion({
  onClose,
  dragThreshold = 100,
}: UsePanelMotionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartY = useRef<number>(0);
  const isAnimating = useRef(false);

  // Animación de entrada
  useEffect(() => {
    if (panelRef.current) {
      // Forzar reflow para asegurar que la animación se aplique
      panelRef.current.getBoundingClientRect();
      setIsVisible(true);
    }
  }, []);

  // Gestos táctiles para cerrar
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
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current || touchStartY.current === 0) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;

      panel.style.transition = 'transform 0.2s ease-out';

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

  const getPanelStyle = () => {
    if (isVisible) {
      return {
        transform: 'translateY(0%)',
        opacity: 1,
        transition:
          'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out',
      };
    }
    return {
      transform: 'translateY(100%)',
      opacity: 0,
      transition:
        'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out',
    };
  };

  return { panelRef, getPanelStyle, isVisible };
}
