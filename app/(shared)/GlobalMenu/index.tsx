// GlobalMenu component - Main entry point

'use client';

import { JSX } from 'react';
import { createPortal } from 'react-dom';

// Hooks
import { useGlobalMenu } from './hooks/useGlobalMenu';

// Components
import { MenuOpenButton } from './components';
import { MenuContent } from './MenuContent';

/**
 * Global menu component that provides navigation and theme controls.
 * Renders as a slide-up overlay menu with theme settings and navigation options.
 */
export default function GlobalMenu(): JSX.Element {
  const {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    mounted,
    themeLabel,
    isSystemSync,
    toggleTheme,
    syncWithSystem,
    navigateTo,
  } = useGlobalMenu();

  // Don't render until mounted
  if (!mounted) return <></>;

  return createPortal(
    <>
      <MenuOpenButton isOpen={isMenuOpen} onClick={toggleMenu} />
      <MenuContent
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        themeLabel={themeLabel}
        isSystemSync={isSystemSync}
        toggleTheme={toggleTheme}
        syncWithSystem={syncWithSystem}
        navigateTo={navigateTo}
      />
    </>,
    document.body
  );
}
