// Hook for menu navigation

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';
import { MENU_CONSTANTS } from '../constants/menuConstants';

interface UseMenuNavigationReturn {
  navigateTo: (path: string) => void;
  navigateToMap: () => void;
  navigateToProfile: () => void;
}

export const useMenuNavigation = (
  closeMenu: () => void
): UseMenuNavigationReturn => {
  const { navigate } = useCustomNavigation();
  const pathname = usePathname();

  const navigateTo = useCallback(
    (path: string): void => {
      // Verificar si ya estamos en la ruta destino
      if (pathname === path) {
        closeMenu();
        return;
      }

      navigate(path);
      closeMenu();
    },
    [pathname, navigate, closeMenu]
  );

  const navigateToMap = useCallback((): void => {
    navigateTo(MENU_CONSTANTS.NAVIGATION.MAP);
  }, [navigateTo]);

  const navigateToProfile = useCallback((): void => {
    navigateTo(MENU_CONSTANTS.NAVIGATION.PROFILE);
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToMap,
    navigateToProfile,
  };
};
