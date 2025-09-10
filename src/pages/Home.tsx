import React from 'react';
import { Box, Button, Typography, Container, IconButton, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logo_white.png';
import logoHeader from '../assets/logo_header.png';
import { useThemeManager } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleThemeMode } = useThemeManager();

  const handleStart = () => {
    try {
      navigate('/intro');
    } catch (error) {
      console.error('Erro ao navegar para /intro:', error);
    }
  };

  const handleFilmes = () => {
    try {
      navigate('/filme/a-caso-do-lago'); // Exemplo de filme sem caracteres especiais
    } catch (error) {
      console.error('Erro ao navegar para /filme:', error);
    }
  };

  return (
    <>
      {/* Menu Filmes - Oculto em mobile para evitar confusão */}
      <AppBar position="static" sx={{ 
        backgroundColor: 'transparent', 
        boxShadow: 'none', 
        borderBottom: mode === 'dark' 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(0,0,0,0.2)',
        display: { xs: 'none', sm: 'block' } // Oculto em mobile
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            component="img"
            src={logoHeader}
            alt="VibesFilm Logo"
            sx={{
              height: 48,
              width: 'auto',
              maxWidth: 320,
              objectFit: 'contain'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => window.open('https://blog.vibesfilm.com', '_blank')}
              sx={{ 
                color: 'text.primary',
                typography: 'h6',
                textTransform: 'none',
                fontWeight: 'normal'
              }}
            >
              Blog
            </Button>
            <IconButton 
              sx={{ 
                ml: 1, 
                color: mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }} 
              onClick={toggleThemeMode}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu simplificado para mobile - apenas toggle de tema */}
      <Box sx={{ 
        display: { xs: 'flex', sm: 'none' }, 
        justifyContent: 'flex-end', 
        p: 2,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1
      }}>
        <IconButton 
          onClick={toggleThemeMode} 
          sx={{ 
            color: mode === 'dark' ? 'white' : 'black',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }
          }}
        >
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '80vh', sm: '90vh' },
          textAlign: 'center',
          pt: { xs: 2, sm: 2, md: 3 },
          pb: { xs: 2, sm: 2, md: 3 },
        }}
      >
        <Typography variant="h5" component="h2" sx={{ 
          mb: 0.5, 
          color: 'text.primary',
          fontSize: { xs: '1.3rem', sm: '1.25rem', md: '1.5rem' }
        }}>
          Bem-vindo(a) ao
        </Typography>
        <Box
          component="img"
          src={mode === 'dark' ? logoWhite : logo}
          alt="Logo do projeto"
          onError={(e) => {
            console.error('Erro ao carregar logo:', e);
            // Fallback para texto se a imagem falhar
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          sx={{
            width: { xs: 280, sm: 250, md: 300 },
            height: 'auto',
            marginBottom: 0,
            filter: mode === 'dark' 
              ? 'drop-shadow(0px 4px 8px rgba(255,255,255,0.2))' 
              : 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />


        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' }, 
          mt: 1, 
          mb: 1,
          lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
        }}>
          Encontre o filme perfeito para sua vibe!
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph sx={{ 
          maxWidth: 600, 
          mt: 1, 
          mb: 1,
          fontSize: { xs: '1.1rem', sm: '1rem' },
          px: { xs: 1, sm: 0 }
        }}>
          O cinema vai além de espelhar seu estado de espírito: ele pode te ajudar a processar uma emoção, transformar seu humor, manter uma boa energia ou explorar novas sensações.
        </Typography>

        <Box sx={{ mt: 0, px: { xs: 2, sm: 0 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{ 
              px: { xs: 4, sm: 5 }, 
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Vamos começar
          </Button>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default Home; 