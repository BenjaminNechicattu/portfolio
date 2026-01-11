import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type CustomTheme = 'default' | 'nature' | 'space' | 'cyber' | 'terminal' | 'sketch';

interface CustomThemeContextType {
  customTheme: CustomTheme;
  setCustomTheme: (theme: CustomTheme) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customTheme, setCustomThemeState] = useState<CustomTheme>(() => {
    // Check URL parameter first
    const urlTheme = searchParams.get('theme') as CustomTheme;
    if (urlTheme === 'nature' || urlTheme === 'default' || urlTheme === 'space' || urlTheme === 'cyber' || urlTheme === 'terminal' || urlTheme === 'sketch') {
      return urlTheme;
    }
    // Check localStorage
    const savedTheme = localStorage.getItem('customTheme') as CustomTheme;
    if (savedTheme === 'nature' || savedTheme === 'default' || savedTheme === 'space' || savedTheme === 'cyber' || savedTheme === 'terminal' || savedTheme === 'sketch') {
      return savedTheme;
    }
    return 'default';
  });

  const setCustomTheme = (theme: CustomTheme) => {
    setCustomThemeState(theme);
    localStorage.setItem('customTheme', theme);
    
    // Update URL parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (theme === 'default') {
      newSearchParams.delete('theme');
    } else {
      newSearchParams.set('theme', theme);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-default', 'theme-nature', 'theme-space', 'theme-cyber', 'theme-terminal', 'theme-sketch');
    
    // Add current theme class
    root.classList.add(`theme-${customTheme}`);
  }, [customTheme]);

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
