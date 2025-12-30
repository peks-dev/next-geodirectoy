// Hook for keyboard events in the menu

import { useEffect } from 'react';

interface UseMenuKeyboardProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

export const useMenuKeyboard = ({
  isMenuOpen,
  closeMenu,
}: UseMenuKeyboardProps): void => {
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);
};
