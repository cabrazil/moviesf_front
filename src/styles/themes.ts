import { createTheme, Theme } from '@mui/material/styles';

// --- BASE THEME OPTIONS ---
const sharedComponents = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 },
      },
    },
    MuiPaper: { // Changed from MuiCard to MuiPaper
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Default subtle shadow for all cards
        },
      },
    },
  },
};

const lightBaseOptions = {
  ...sharedComponents,
  palette: {
    mode: 'light' as const,
    background: { default: '#A8C0D0', paper: '#FFFFFF' },
    text: { primary: '#212121', secondary: '#757575' },
  },
};

const darkBaseOptions = {
  ...sharedComponents,
  palette: {
    mode: 'dark' as const,
    background: { default: '#011627', paper: '#022c49' },
    text: { primary: '#FDFFFC', secondary: '#E0E0E0' },
  },
};

// --- SENTIMENT COLORS (adjusted for contrast in each mode) ---
export const lightSentimentColors = {
  13: '#FF8F00', 14: '#1976D2', 15: '#388E3C', 16: '#D32F2F', 17: '#7B1FA2', 18: '#616161',
};

export const darkSentimentColors = {
  13: '#FF9F1C', 14: '#4dabf5', 15: '#4CAF50', 16: '#F44336', 17: '#BA68C8', 18: '#9E9E9E',
};

// --- THEME CREATION ---
const createSentimentThemes = (baseOptions: any, sentimentColors: { [key: number]: string }) => {
  const themes: { [key: number]: Theme } = {};
  for (const key in sentimentColors) {
    const sentimentId = parseInt(key, 10);
    themes[sentimentId] = createTheme({
      ...baseOptions,
      palette: {
        ...baseOptions.palette,
        primary: { main: sentimentColors[sentimentId] }
      },
      components: {
        ...baseOptions.components, // Merge existing components
        MuiPaper: { // Changed from MuiCard to MuiPaper
          styleOverrides: {
            root: {
              ...(baseOptions.components?.MuiPaper?.styleOverrides?.root || {}), // Merge existing MuiPaper styles
              border: `2px solid ${sentimentColors[sentimentId]}`, // Dynamic border color
            },
          },
        },
      },
    });
  }
  return themes;
};

// --- EXPORTS ---
export const lightSentimentThemes = createSentimentThemes(lightBaseOptions, lightSentimentColors);
export const darkSentimentThemes = createSentimentThemes(darkBaseOptions, darkSentimentColors);

export const defaultLightTheme = createTheme({ ...lightBaseOptions, palette: { ...lightBaseOptions.palette, primary: { main: '#1976d2' } } });
export const defaultDarkTheme = createTheme({ ...darkBaseOptions, palette: { ...darkBaseOptions.palette, primary: { main: '#90caf9' } } });

