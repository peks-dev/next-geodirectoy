// MenuContent component for the GlobalMenu

'use client';

import { JSX } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CornerIcon } from '@/app/components/ui/svgs';
import { MENU_CLASSES } from './constants/menuClasses';
import { MENU_CONSTANTS } from './constants/menuConstants';
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
  // Base container classes without animation
  const containerClasses =
    'fixed inset-0 z-39 flex flex-col items-center justify-end pb-10';

  return (
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className={containerClasses}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={MENU_CLASSES.OVERLAY}
            onClick={closeMenu}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.05,
            }}
            className={MENU_CLASSES.WRAPPER_DRAGGABLE}
          >
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
