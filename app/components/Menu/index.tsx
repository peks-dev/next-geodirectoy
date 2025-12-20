'use client';

// React & Next.js imports
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

// UI Components
import Button from '../ui/Button';
import { CornerIcon } from '../ui/svgs';

// Icons
import { ProfileIcon, MapIcon, ThemeIcon, GearIcon } from '../ui/svgs';

// Menu components
import OptionMenu from './OptionMenu';

// Hooks & Stores
import { useTheme } from 'next-themes';
import { useGlobalMenuStore } from '@/lib/stores/useGlobalMenuStore';

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
  OVERLAY:
    'menu-overlay fixed inset-0 bottom-0 left-0 z-100 flex h-full w-full flex-col bg-black/50 items-center',
  CLOSE_ZONE: 'close-zone w-full grow',
  WRAPPER: 'menu-wrapper gap-md mt-auto flex w-full max-w-250 flex-col',
  HEADER: 'menu-header bg-dark-secondary border-accent-primary border-t-2',
  TITLE:
    'font-heading neon-effect text-light-secondary px-4 py-2 text-lg uppercase',
  CONTENT: 'menu-links transparent-container grow p-4',
  CONTENT_WRAPPER: 'gap-xl relative flex grow flex-col p-4',
  CORNER_ICON: 'text-light-primary',
  SECTION_NAV:
    'before:text-light-primary before:font-heading px-4 before:mb-10 before:block before:text-sm before:uppercase',
  SECTION_LIST: 'gap-lg flex flex-col items-center',
  FOOTER_DIVIDER: 'divider bg-border-secondary mx-auto mt-20 h-1 w-[90%]',
  FOOTER_NAV: 'my-5 flex items-center justify-around',
  FOOTER_BUTTON:
    'text-light-primary active:text-accent-primary hover-neon-text cursor-pointer text-xs active:scale-105',
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

const MenuFooter = ({ onClose }: { onClose: () => void }): JSX.Element => (
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
    <Button onClick={onClose}>cerrar</Button>
  </div>
);

/**
 * Global menu component that provides navigation and theme controls.
 * Renders as a slide-up overlay menu with theme settings and navigation options.
 */
export default function GlobalMenu(): JSX.Element | null {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isMenuOpen, closeMenu } = useGlobalMenuStore();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

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
    handleClose();
  };

  const handleClose = (): void => {
    closeMenu();
  };

  // Don't render until mounted or when menu is closed
  if (!mounted || !isMenuOpen) return null;

  // Computed values
  const isSystemSync = theme === 'system';
  const themeLabel = getThemeToggleLabel(resolvedTheme as ThemeMode);

  return (
    <div className={MENU_CLASSES.OVERLAY}>
      <div className={MENU_CLASSES.CLOSE_ZONE} onClick={handleClose} />
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

          <MenuFooter onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}
