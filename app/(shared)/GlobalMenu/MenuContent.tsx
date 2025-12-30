// MenuContent component for the GlobalMenu

'use client';

import { JSX } from 'react';
import { CornerIcon } from '@/app/components/ui/svgs';
import { MENU_CLASSES } from './constants/menuClasses';
import { MENU_CONSTANTS } from './constants/menuConstants';
import { useGlobalMenuGestures } from './hooks/useGlobalMenuGestures';
import {
  MenuHeader,
  MenuFooter,
  ThemeSection,
  NavigationSection,
} from './components/sections';

interface MenuContentProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
  themeLabel: string;
  isSystemSync: boolean;
  toggleTheme: () => void;
  syncWithSystem: () => void;
  navigateTo: (path: string) => void;
}

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

export const MenuContent = ({
  isMenuOpen,
  closeMenu,
  themeLabel,
  isSystemSync,
  toggleTheme,
  syncWithSystem,
  navigateTo,
}: MenuContentProps): JSX.Element => {
  const { panelRef } = useGlobalMenuGestures({
    closeMenu,
    dragThreshold: 100,
  });

  return (
    <div className={MENU_CLASSES.MENU_CONTAINER(isMenuOpen)}>
      <div className={MENU_CLASSES.OVERLAY} onClick={closeMenu}></div>
      <div ref={panelRef} className={MENU_CLASSES.WRAPPER_DRAGGABLE}>
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
};
