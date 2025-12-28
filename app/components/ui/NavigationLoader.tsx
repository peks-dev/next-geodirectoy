'use client';

import { createPortal } from 'react-dom';
import { useNavigationLoaderStore } from '@/lib/stores/useNavigationStore';

export function NavigationLoader() {
  const { isNavigating } = useNavigationLoaderStore();

  if (!isNavigating) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-100">
      {/* Aquí va tu diseño personalizado con Motion One */}
      {/* Ejemplo básico mientras diseñas: */}
      <div className="absolute top-0 right-0 left-0 h-2 animate-pulse bg-blue-600" />

      {/*
        Aquí puedes agregar:
        - Barra de progreso animada
        - Spinner
        - Overlay con blur
        - Lo que tu diseño necesite

        Recuerda usar Motion One para las animaciones:
        import { animate } from "motion";
      */}
    </div>,
    document.body
  );
}
