import { createTheme, Theme } from '@mui/material/styles';

// --- BASE THEME OPTIONS ---
const sharedComponents = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none' as const, 
          borderRadius: 8 
        },
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
    // Fundo muito mais claro para melhor contraste
    background: { default: '#F0F6FA', paper: '#FFFFFF' },
    // Textos com melhor contraste
    text: { primary: '#1A1A1A', secondary: '#546E7A' },
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
// Cores ajustadas para melhor contraste com o novo fundo claro
export const lightSentimentColors = {
  13: '#F57C00', // Laranja amarelado (era #E65100 - muito próximo do vermelho)
  14: '#1565C0', // Azul mais escuro (era #1976D2) 
  15: '#2E7D32', // Verde mais escuro (era #388E3C)
  16: '#C62828', // Vermelho mais escuro (era #D32F2F)
  17: '#6A1B9A', // Roxo mais escuro (era #7B1FA2)
  18: '#424242', // Cinza mais escuro (era #616161)
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

export const defaultLightTheme = createTheme({ ...lightBaseOptions, palette: { ...lightBaseOptions.palette, primary: { main: '#1565C0' } } });
export const defaultDarkTheme = createTheme({ ...darkBaseOptions, palette: { ...darkBaseOptions.palette, primary: { main: '#90caf9' } } });

