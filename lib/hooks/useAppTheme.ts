'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useAppTheme() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted
    ? theme === 'system'
      ? resolvedTheme
      : theme
    : 'light';
  const isDark = currentTheme === 'dark';

  return { mounted, isDark, currentTheme };
}
