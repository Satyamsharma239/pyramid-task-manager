'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';
export type ThemeColor = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextType {
  theme: Theme;
  color: ThemeColor;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [color, setColorState] = useState<ThemeColor>('black');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const storedColor = localStorage.getItem('color') as ThemeColor | null;
    
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (storedColor) {
      setColorState(storedColor);
      document.documentElement.setAttribute('data-color', storedColor);
    } else {
      document.documentElement.setAttribute('data-color', 'black');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem('color', newColor);
    document.documentElement.setAttribute('data-color', newColor);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, color, toggleTheme, setTheme, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
