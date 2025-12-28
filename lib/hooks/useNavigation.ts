'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useNavigationLoaderStore } from '../stores/useNavigationStore';

export function useCustomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isNavigating, setIsNavigating } = useNavigationLoaderStore();

  // Detectar cuando la navegación se completó
  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

  const navigate = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      // Activar el loader
      setIsNavigating(true);

      // Ejecutar la navegación
      router.push(href, options);
    },
    [router, setIsNavigating]
  );

  return { navigate, isNavigating };
}
