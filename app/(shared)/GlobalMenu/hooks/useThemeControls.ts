// Hook for theme controls in the GlobalMenu

import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { ThemeMode } from '../constants/menuConstants';
import { getThemeToggleLabel } from '../utils/menuUtils';

interface UseThemeControlsReturn {
  theme: string | undefined;
  resolvedTheme: ThemeMode;
  toggleTheme: () => void;
  syncWithSystem: () => void;
  isSystemSync: boolean;
  themeLabel: string;
}

export const useThemeControls = (): UseThemeControlsReturn => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback((): void => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const syncWithSystem = useCallback((): void => {
    setTheme('system');
  }, [setTheme]);

  const isSystemSync = theme === 'system';
  const themeLabel = getThemeToggleLabel(resolvedTheme as ThemeMode);

  return {
    theme,
    resolvedTheme: resolvedTheme as ThemeMode,
    toggleTheme,
    syncWithSystem,
    isSystemSync,
    themeLabel,
  };
};
