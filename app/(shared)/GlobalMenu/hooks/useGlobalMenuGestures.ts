// Hook para gestos de arrastre en GlobalMenu

import { useRef, useEffect } from 'react';

interface UseGlobalMenuGesturesProps {
  closeMenu: () => void;
  dragThreshold?: number;
}

export function useGlobalMenuGestures({
  closeMenu,
  dragThreshold = 100,
}: UseGlobalMenuGesturesProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating.current) return;
      touchStartY.current = e.touches[0].clientY;
      panel.classList.add('menu-dragging');
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
        isAnimating.current = true;
        panel.style.transform = 'translateY(100%)';
        panel.style.opacity = '0';

        setTimeout(() => {
          closeMenu();
          isAnimating.current = false;
          panel.classList.remove('menu-dragging');
        }, 200);
      } else {
        panel.style.transform = 'translateY(0)';
        panel.classList.remove('menu-dragging');
      }

      touchStartY.current = 0;
    };

    // Eventos desktop (mouse)
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (isAnimating.current) return;
      touchStartY.current = e.clientY;
      panel.classList.add('menu-dragging');
      panel.style.transition = 'transform 0s';
      panel.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isAnimating.current || touchStartY.current === 0) return;

      const deltaY = e.clientY - touchStartY.current;
      if (deltaY > 0) {
        e.preventDefault();
        panel.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isAnimating.current || touchStartY.current === 0) return;

      const deltaY = e.clientY - touchStartY.current;
      panel.style.transition = 'transform 0.2s ease-out';
      panel.style.cursor = 'grab';

      if (deltaY > dragThreshold) {
        isAnimating.current = true;
        panel.style.transform = 'translateY(100%)';
        panel.style.opacity = '0';

        setTimeout(() => {
          closeMenu();
          isAnimating.current = false;
          panel.classList.remove('menu-dragging');
        }, 200);
      } else {
        panel.style.transform = 'translateY(0)';
        panel.classList.remove('menu-dragging');
      }

      touchStartY.current = 0;
    };

    // Añadir event listeners
    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd);
    panel.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
      panel.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [closeMenu, dragThreshold]);

  return { panelRef };
}
