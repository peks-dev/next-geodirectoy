import { useRef, useEffect } from 'react';

interface UsePanelDesktopGestureProps {
  onClose: () => void;
  dragThreshold?: number;
}

export function usePanelDesktopGesture({
  onClose,
  dragThreshold = 150,
}: UsePanelDesktopGestureProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startTransform = useRef('');

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Solo permitir arrastre con botón izquierdo
      if (e.button !== 0) return;

      isDragging.current = true;
      startY.current = e.clientY;
      startTransform.current = panel.style.transform;
      panel.style.transition = 'transform 0s';
      panel.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaY = e.clientY - startY.current;

      // Solo permitir arrastre hacia abajo
      if (deltaY > 0) {
        e.preventDefault();
        panel.style.transform = `translateY(${deltaY}px)`;

        // Añadir clase para feedback visual
        panel.classList.add('panel-dragging');
        panel.classList.add('cursor-grabbing');
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaY = e.clientY - startY.current;
      panel.style.transition = 'transform 0.2s ease-out';
      panel.style.cursor = 'grab';
      panel.classList.remove('panel-dragging');
      panel.classList.remove('cursor-grabbing');

      if (deltaY > dragThreshold) {
        // Cerrar panel
        panel.style.transform = 'translateY(100%)';
        panel.style.opacity = '0';

        setTimeout(() => {
          onClose();
          isDragging.current = false;
        }, 200);
      } else {
        // Volver a posición original
        panel.style.transform = startTransform.current || 'translateY(0)';
        isDragging.current = false;
      }
    };

    // Prevenir selección de texto durante el arrastre
    const handleSelectStart = (e: Event) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    panel.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    panel.addEventListener('selectstart', handleSelectStart);

    return () => {
      panel.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      panel.removeEventListener('selectstart', handleSelectStart);
    };
  }, [onClose, dragThreshold]);

  return { panelRef };
}
