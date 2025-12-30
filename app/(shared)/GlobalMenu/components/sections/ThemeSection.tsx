// Theme section component for the GlobalMenu

'use client';

import { JSX } from 'react';
import { ThemeIcon, GearIcon } from '@/app/components/ui/svgs';
import OptionMenu from '../OptionMenu';
import { MENU_CLASSES } from '../../constants/menuClasses';
import { MENU_CONSTANTS } from '../../constants/menuConstants';

interface ThemeSectionProps {
  themeLabel: string;
  toggleTheme: () => void;
  isSystemSync: boolean;
  syncWithSystem: () => void;
}

const getSystemSyncLabel = (isSystemSync: boolean): string => {
  return isSystemSync
    ? MENU_CONSTANTS.THEME_LABELS.SYNCED_SYSTEM
    : MENU_CONSTANTS.THEME_LABELS.SYNC_SYSTEM;
};

export const ThemeSection = ({
  themeLabel,
  toggleTheme,
  isSystemSync,
  syncWithSystem,
}: ThemeSectionProps): JSX.Element => (
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
