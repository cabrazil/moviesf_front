import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightSentimentThemes, darkSentimentThemes, defaultLightTheme, defaultDarkTheme } from '../styles/themes';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  toggleThemeMode: () => void;
  selectSentimentTheme: (sentimentId: number) => void;
  resetToDefaultTheme: () => void;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeManager = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeManager must be used within a ThemeProviderWrapper');
  }
  return context;
};

export const ThemeProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode === 'light' ? 'light' : 'dark';
  });
  const [currentSentimentId, setCurrentSentimentId] = useState<number | null>(null);

  const themeManager = useMemo(() => ({
    toggleThemeMode: () => {
      setMode(prevMode => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode);
        return newMode;
      });
    },
    selectSentimentTheme: (sentimentId: number) => {
      setCurrentSentimentId(sentimentId);
    },
    resetToDefaultTheme: () => {
      setCurrentSentimentId(null);
    },
    mode,
  }), [mode]);

  const activeTheme = useMemo(() => {
    const isDark = mode === 'dark';
    if (currentSentimentId) {
      return isDark ? darkSentimentThemes[currentSentimentId] : lightSentimentThemes[currentSentimentId];
    }
    return isDark ? defaultDarkTheme : defaultLightTheme;
  }, [mode, currentSentimentId]);

  return (
    <ThemeContext.Provider value={themeManager}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};