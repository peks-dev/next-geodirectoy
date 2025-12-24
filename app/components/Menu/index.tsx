'use client';

// React & Next.js imports
import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

// UI Components
import IconBox from '../ui/IconBox';
import { CornerIcon } from '../ui/svgs';

// Icons
import {
  ProfileIcon,
  MapIcon,
  ThemeIcon,
  GearIcon,
  ArrowUpIcon,
} from '../ui/svgs';

// Menu components
import OptionMenu from './OptionMenu';

// Hooks & Stores
import { useTheme } from 'next-themes';
import { useGlobalOverlayStore } from '@/lib/stores/useGlobalOverlayStore';
import { useUIStateStore } from '@/lib/stores/useUIStateStore';

// Constants & Types
type ThemeMode = 'light' | 'dark' | 'system';

// Constants
const MENU_CONSTANTS = {
  NAVIGATION: {
    MAP: '/',
    PROFILE: '/perfil',
  },
  THEME_LABELS: {
    DARK_TO_LIGHT: 'Cambiar a modo claro',
    LIGHT_TO_DARK: 'Cambiar a modo oscuro',
    SYNC_SYSTEM: 'Sincronizar con sistema',
    SYNCED_SYSTEM: '✓ Sincronizado con sistema',
  },
  SECTIONS: {
    THEME: 'tema',
    NAVIGATION: 'navegacion',
  },
  CORNER_POSITIONS: [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ] as const,
} as const;

const MENU_CLASSES = {
  CLOSE_ZONE: 'close-zone w-full grow',
  WRAPPER: 'menu-wrapper relative z-20 gap-md flex w-full max-w-250 flex-col',
  OVERLAY: 'fixed z-10 top-0 left-0 w-full h-full',
  HEADER: 'menu-header bg-dark-secondary border-accent-primary border-t-2',
  TITLE:
    'font-heading neon-effect text-light-secondary px-4 py-2 text-lg uppercase',
  CONTENT: 'menu-links transparent-container grow p-4',
  CONTENT_WRAPPER: 'gap-xl relative flex grow flex-col p-4',
  CORNER_ICON: 'text-light-primary',
  SECTION_NAV:
    'before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase',
  SECTION_LIST: 'gap-lg flex flex-col items-center',
  SECTION_TITLE: 'font-heading neon-effect text-light-secondary uppercase mb-5',
  FOOTER_DIVIDER: 'divider bg-border-secondary mx-auto mt-20 h-1 w-[90%]',
  FOOTER_NAV: 'my-5 flex items-center justify-around',
  FOOTER_BUTTON:
    'text-light-primary active:text-accent-primary hover-neon-text cursor-pointer text-xs active:scale-105',
  // New classes for tab-style menu
  OPEN_BUTTON_CONTAINER:
    'fixed z-40 bottom-0 left-0 w-full h-10 flex justify-center',
  OPEN_BUTTON:
    'bg-accent-primary w-full max-w-250 flex items-center justify-center cursor-pointer hover-neon transition-all duration-200',
  ARROW_ICON: (isOpen: boolean) =>
    `text-dark-primary  ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`,
  MENU_CONTAINER: (isOpen: boolean) =>
    `fixed inset-0 z-39 flex flex-col items-center transition-transform duration-200 ease-in-out justify-end pb-10 ${
      isOpen ? 'translate-y-0 ' : 'translate-y-[calc(100%-0px)] '
    }`,
} as const;

// Types
// Note: Interfaces are defined inline with component functions for simplicity

// Utility functions
const getThemeToggleLabel = (resolvedTheme: ThemeMode): string => {
  return resolvedTheme === 'dark'
    ? MENU_CONSTANTS.THEME_LABELS.DARK_TO_LIGHT
    : MENU_CONSTANTS.THEME_LABELS.LIGHT_TO_DARK;
};

const getSystemSyncLabel = (isSystemSync: boolean): string => {
  return isSystemSync
    ? MENU_CONSTANTS.THEME_LABELS.SYNCED_SYSTEM
    : MENU_CONSTANTS.THEME_LABELS.SYNC_SYSTEM;
};

const generateCornerIcons = (): JSX.Element[] => {
  return MENU_CONSTANTS.CORNER_POSITIONS.map((position) => (
    <CornerIcon
      key={position}
      position={position}
      size="small"
      className={MENU_CLASSES.CORNER_ICON}
    />
  ));
};

// Component functions
const MenuHeader = (): JSX.Element => (
  <header className={MENU_CLASSES.HEADER}>
    <span className={MENU_CLASSES.TITLE}>menu</span>
  </header>
);

const ThemeSection = ({
  themeLabel,
  toggleTheme,
  isSystemSync,
  syncWithSystem,
}: {
  themeLabel: string;
  toggleTheme: () => void;
  isSystemSync: boolean;
  syncWithSystem: () => void;
}): JSX.Element => (
  <nav
    className={`${MENU_CLASSES.SECTION_NAV} before:content-['${MENU_CONSTANTS.SECTIONS.THEME}']`}
  >
    <div className={MENU_CLASSES.SECTION_TITLE}>tema</div>
    <ul className={MENU_CLASSES.SECTION_LIST}>
      <OptionMenu
        icon={<ThemeIcon />}
        label={themeLabel}
        onClick={toggleTheme}
      />
      <OptionMenu
        icon={<GearIcon />}
        label={getSystemSyncLabel(isSystemSync)}
        onClick={syncWithSystem}
        disabled={isSystemSync}
      />
    </ul>
  </nav>
);

const NavigationSection = ({
  navigateTo,
}: {
  navigateTo: (path: string) => void;
}): JSX.Element => (
  <nav
    className={`${MENU_CLASSES.SECTION_NAV} before:content-['${MENU_CONSTANTS.SECTIONS.NAVIGATION}']`}
  >
    <div className={MENU_CLASSES.SECTION_TITLE}>navegacion</div>
    <ul className={MENU_CLASSES.SECTION_LIST}>
      <OptionMenu
        icon={<MapIcon />}
        label="Explorar mapa"
        onClick={() => navigateTo(MENU_CONSTANTS.NAVIGATION.MAP)}
      />
      <OptionMenu
        icon={<ProfileIcon />}
        label="Ver mi perfil"
        onClick={() => navigateTo(MENU_CONSTANTS.NAVIGATION.PROFILE)}
      />
    </ul>
  </nav>
);

const MenuFooter = (): JSX.Element => (
  <div>
    <div className={MENU_CLASSES.FOOTER_DIVIDER} />
    <nav className={MENU_CLASSES.FOOTER_NAV}>
      <li>
        <button className={MENU_CLASSES.FOOTER_BUTTON}>condiciones</button>
      </li>
      <li>
        <button className={MENU_CLASSES.FOOTER_BUTTON}>privacidad</button>
      </li>
    </nav>
  </div>
);

const MenuOpenButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}): JSX.Element => (
  <div className={MENU_CLASSES.OPEN_BUTTON_CONTAINER}>
    <button
      className={MENU_CLASSES.OPEN_BUTTON}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <IconBox
        icon={<ArrowUpIcon />}
        size="md"
        className={MENU_CLASSES.ARROW_ICON(isOpen)}
      />
    </button>
  </div>
);

/**
 * Global menu component that provides navigation and theme controls.
 * Renders as a slide-up overlay menu with theme settings and navigation options.
 */
export default function GlobalMenu(): JSX.Element {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggle: toggleOverlay, deactivate } = useGlobalOverlayStore();
  const { closeActivePanel, hasAnyPanelOpen } = useUIStateStore();

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Menu state handlers
  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false);
    deactivate();
  }, [deactivate]);

  const toggleMenu = useCallback((): void => {
    // Cerrar cualquier panel abierto antes de abrir el menú
    if (!isMenuOpen && hasAnyPanelOpen()) {
      closeActivePanel();
      router.back();
    }

    setIsMenuOpen((prev) => !prev);
    toggleOverlay();
  }, [toggleOverlay, isMenuOpen, closeActivePanel, hasAnyPanelOpen, router]);

  // Handle keyboard events for closing menu
  useEffect(() => {
    if (!mounted || !isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, mounted, closeMenu, deactivate]);

  // Theme and navigation handlers
  const toggleTheme = (): void => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const syncWithSystem = (): void => {
    setTheme('system');
  };

  const navigateTo = (path: string): void => {
    router.push(path);
    closeMenu();
  };

  // Don't render until mounted
  if (!mounted) return <></>;

  // Computed values
  const isSystemSync = theme === 'system';
  const themeLabel = getThemeToggleLabel(resolvedTheme as ThemeMode);

  const menuContent = (
    <div className={MENU_CLASSES.MENU_CONTAINER(isMenuOpen)}>
      <div className={MENU_CLASSES.OVERLAY} onClick={closeMenu}></div>
      <div className={MENU_CLASSES.WRAPPER}>
        <MenuHeader />

        <div className={MENU_CLASSES.CONTENT}>
          <div className={MENU_CLASSES.CONTENT_WRAPPER}>
            {generateCornerIcons()}

            <ThemeSection
              themeLabel={themeLabel}
              toggleTheme={toggleTheme}
              isSystemSync={isSystemSync}
              syncWithSystem={syncWithSystem}
            />

            <NavigationSection navigateTo={navigateTo} />
          </div>

          <MenuFooter />
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      <MenuOpenButton isOpen={isMenuOpen} onClick={toggleMenu} />
      {menuContent}
    </>,
    document.body
  );
}
