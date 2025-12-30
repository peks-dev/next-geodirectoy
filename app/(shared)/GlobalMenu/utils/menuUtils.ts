// Utility functions for the GlobalMenu component

import { MENU_CONSTANTS } from '../constants/menuConstants';
import { ThemeMode } from '../constants/menuConstants';

export const getThemeToggleLabel = (resolvedTheme: ThemeMode): string => {
  return resolvedTheme === 'dark'
    ? MENU_CONSTANTS.THEME_LABELS.DARK_TO_LIGHT
    : MENU_CONSTANTS.THEME_LABELS.LIGHT_TO_DARK;
};

export const getSystemSyncLabel = (isSystemSync: boolean): string => {
  return isSystemSync
    ? MENU_CONSTANTS.THEME_LABELS.SYNCED_SYSTEM
    : MENU_CONSTANTS.THEME_LABELS.SYNC_SYSTEM;
};
