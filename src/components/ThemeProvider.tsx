import { useEffect } from 'react';
import { useThemeStore } from '@/lib/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
  }, [theme]);

  // Set initial theme on mount (prevents flash)
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = useThemeStore.getState().theme;
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
  }, []);

  return <>{children}</>;
}