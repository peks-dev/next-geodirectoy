// Hook para gestos de arrastre en GlobalMenu

import { useRef, useEffect } from 'react';

interface UseGlobalMenuGesturesProps {
  closeMenu: () => void;
  dragThreshold?: number;
  isMenuOpen: boolean;
  setDisableContainerAnimation: (disable: boolean) => void;
}

export function useGlobalMenuGestures({
  closeMenu,
  dragThreshold = 100,
  isMenuOpen,
  setDisableContainerAnimation,
}: UseGlobalMenuGesturesProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const isAnimating = useRef(false);
  const animationTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  // Limpiar estilos y estado cuando el menú se cierra externamente (no por gesto)
  useEffect(() => {
    if (!isMenuOpen) {
      const panel = panelRef.current;
      if (panel) {
        // Si estamos animando por gesto, no hacer nada - el timeout se encargará
        if (isAnimating.current) {
          return;
        }

        // Cancelar cualquier timeout pendiente
        if (animationTimeoutId.current) {
          clearTimeout(animationTimeoutId.current);
          animationTimeoutId.current = null;
        }

        // Limpiar estilos inline
        panel.style.transform = '';
        panel.style.opacity = '';
        panel.style.transition = '';
        panel.style.cursor = '';
        panel.classList.remove('menu-dragging');

        // Restablecer estado de arrastre
        if (isDraggingRef.current) {
          setDisableContainerAnimation(false);
          isDraggingRef.current = false;
        }
      }
    }
  }, [isMenuOpen, setDisableContainerAnimation]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating.current || !isMenuOpen) return;
      touchStartY.current = e.touches[0].clientY;
      panel.classList.add('menu-dragging');
      panel.style.transition = 'transform 0s';
      // Deshabilitar animación del contenedor durante el arrastre
      setDisableContainerAnimation(true);
      isDraggingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current || touchStartY.current === 0 || !isMenuOpen)
        return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;

      if (deltaY > 0) {
        e.preventDefault();
        panel.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current || touchStartY.current === 0 || !isMenuOpen)
        return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;

      if (deltaY > dragThreshold) {
        // Cerrar el menú - Framer Motion manejará la animación
        isAnimating.current = true;
        closeMenu();

        // Limpiar después de un breve retraso para asegurar que Framer Motion inicie
        if (animationTimeoutId.current) {
          clearTimeout(animationTimeoutId.current);
        }
        animationTimeoutId.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.style.transform = '';
            panelRef.current.style.opacity = '';
            panelRef.current.style.transition = '';
            panelRef.current.style.cursor = '';
            panelRef.current.classList.remove('menu-dragging');
          }
          isAnimating.current = false;
          setDisableContainerAnimation(false);
          isDraggingRef.current = false;
          animationTimeoutId.current = null;
        }, 50);
      } else {
        // Volver a posición inicial
        panel.style.transition = 'transform 0.2s ease-out';
        panel.style.transform = 'translateY(0)';

        if (animationTimeoutId.current) {
          clearTimeout(animationTimeoutId.current);
        }
        animationTimeoutId.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.style.transform = '';
            panelRef.current.style.transition = '';
            panelRef.current.classList.remove('menu-dragging');
          }
          setDisableContainerAnimation(false);
          isDraggingRef.current = false;
          animationTimeoutId.current = null;
        }, 200);
      }

      touchStartY.current = 0;
    };

    // Eventos desktop (mouse)
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (isAnimating.current || !isMenuOpen) return;
      touchStartY.current = e.clientY;
      panel.classList.add('menu-dragging');
      panel.style.transition = 'transform 0s';
      panel.style.cursor = 'grabbing';
      // Deshabilitar animación del contenedor durante el arrastre
      setDisableContainerAnimation(true);
      isDraggingRef.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isAnimating.current || touchStartY.current === 0 || !isMenuOpen)
        return;

      const deltaY = e.clientY - touchStartY.current;
      if (deltaY > 0) {
        e.preventDefault();
        panel.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isAnimating.current || touchStartY.current === 0 || !isMenuOpen)
        return;

      const deltaY = e.clientY - touchStartY.current;

      if (deltaY > dragThreshold) {
        // Cerrar el menú - Framer Motion manejará la animación
        isAnimating.current = true;
        panel.style.cursor = 'grab';
        closeMenu();

        // Limpiar después de un breve retraso para asegurar que Framer Motion inicie
        if (animationTimeoutId.current) {
          clearTimeout(animationTimeoutId.current);
        }
        animationTimeoutId.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.style.transform = '';
            panelRef.current.style.opacity = '';
            panelRef.current.style.transition = '';
            panelRef.current.style.cursor = '';
            panelRef.current.classList.remove('menu-dragging');
          }
          isAnimating.current = false;
          setDisableContainerAnimation(false);
          isDraggingRef.current = false;
          animationTimeoutId.current = null;
        }, 50);
      } else {
        // Volver a posición inicial
        panel.style.transition = 'transform 0.2s ease-out';
        panel.style.transform = 'translateY(0)';
        panel.style.cursor = 'grab';

        if (animationTimeoutId.current) {
          clearTimeout(animationTimeoutId.current);
        }
        animationTimeoutId.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.style.transform = '';
            panelRef.current.style.transition = '';
            panelRef.current.style.cursor = '';
            panelRef.current.classList.remove('menu-dragging');
          }
          setDisableContainerAnimation(false);
          isDraggingRef.current = false;
          animationTimeoutId.current = null;
        }, 200);
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

      if (animationTimeoutId.current) {
        clearTimeout(animationTimeoutId.current);
      }
    };
  }, [closeMenu, dragThreshold, isMenuOpen, setDisableContainerAnimation]);

  return { panelRef };
}
