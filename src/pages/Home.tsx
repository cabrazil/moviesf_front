import React from 'react';
import { Box, Button, Typography, Container, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useThemeManager } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleThemeMode } = useThemeManager();

  const handleStart = () => {
    navigate('/intro');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          pt: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 0.5, color: 'text.primary' }}>
          Bem-vindo(a) ao
        </Typography>
        <Box
          component="img"
          src={logo}
          alt="Logo do projeto"
          sx={{
            width: { xs: 200, sm: 250, md: 300 },
            height: 'auto',
            marginBottom: 0, // Adjusted marginBottom
            filter: mode === 'dark' ? 'invert(1) drop-shadow(0px 4px 8px rgba(255,255,255,0.2))' : 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
          }}
        />

        <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, mt: 1, mb: 1 }}> {/* Adjusted mt and mb */}
          Encontre o filme perfeito para seu momento
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mt: 1, mb: 1 }}>
          O cinema vai além de espelhar seu estado de espírito: ele pode te ajudar a processar uma emoção, transformar seu humor, manter uma boa energia ou explorar novas sensações.
        </Typography>

        <Box sx={{ mt: 0 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{ 
              px: 5, 
              py: 1.5,
              fontSize: '1.2rem',
              borderRadius: 2,
            }}
          >
            Vamos começar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 