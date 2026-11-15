import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from 'next-themes';

export type CustomTheme = 'terminal' | 'sketch';

const VALID_THEMES: CustomTheme[] = ['terminal', 'sketch'];

const isValidTheme = (theme: string | null): theme is CustomTheme => {
  return theme !== null && VALID_THEMES.includes(theme as CustomTheme);
};

interface CustomThemeContextType {
  customTheme: CustomTheme;
  setCustomTheme: (theme: CustomTheme) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTheme } = useTheme();
  const [customTheme, setCustomThemeState] = useState<CustomTheme>(() => {
    // Check URL parameter first
    const urlTheme = searchParams.get('theme');
    if (isValidTheme(urlTheme)) {
      return urlTheme;
    }
    // Check localStorage
    const savedTheme = localStorage.getItem('customTheme');
    if (isValidTheme(savedTheme)) {
      return savedTheme;
    }
    return 'sketch';
  });

  const setCustomTheme = (theme: CustomTheme) => {
    setCustomThemeState(theme);
    localStorage.setItem('customTheme', theme);
    if (theme === 'terminal') {
      setTheme('dark');
    }
    
    // Update URL parameter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('theme', theme);
    setSearchParams(newSearchParams, { replace: true });
  };

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    VALID_THEMES.forEach(theme => root.classList.remove(`theme-${theme}`));
    
    // Add current theme class
    root.classList.add(`theme-${customTheme}`);
  }, [customTheme]);

  useEffect(() => {
    if (customTheme === 'terminal' && localStorage.getItem('theme') === null) {
      setTheme('dark');
    }
  }, [customTheme, setTheme]);

  return (
    <CustomThemeContext.Provider value={{ customTheme, setCustomTheme }}>
      {children}
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};
