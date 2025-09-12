import React, { useState } from 'react';
import { Box, Button, Typography, Container, IconButton, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logo_white.png';
import logoHeader from '../assets/logo_header.png';
import { useThemeManager } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleThemeMode } = useThemeManager();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleStart = () => {
    try {
      navigate('/intro');
    } catch (error) {
      console.error('Erro ao navegar para /intro:', error);
    }
  };


  return (
    <div>
      {/* Header Responsivo */}
      <AppBar position="static" sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderBottom: mode === 'dark'
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(0,0,0,0.2)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 3 } }}>
          {/* Logo */}
          <Box
            component="img"
            src={logoHeader}
            alt="VibesFilm Logo"
            sx={{
              height: { xs: 36, sm: 48 },
              width: 'auto',
              maxWidth: { xs: 200, sm: 320 },
              objectFit: 'contain'
            }}
          />
          
          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Button
              color="inherit"
              onClick={() => navigate('/blog')}
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

          {/* Mobile Navigation */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' }, 
            alignItems: 'center', 
            gap: 1 
          }}>
            <IconButton
              sx={{
                color: mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }}
              onClick={toggleThemeMode}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <IconButton
              sx={{
                color: mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            color: mode === 'dark' ? 'white' : 'black',
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </IconButton>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/blog');
                setMobileMenuOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }}
            >
              <ListItemText primary="Blog" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/intro');
                setMobileMenuOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }}
            >
              <ListItemText primary="Começar Jornada" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 'calc(100vh - 80px)', sm: 'calc(100vh - 100px)' },
          textAlign: 'center',
          pt: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 2, md: 3 },
        }}
      >
        <Typography variant="h5" component="h2" sx={{ 
          mb: { xs: 0.5, sm: 0.5 }, 
          color: 'text.primary',
          fontSize: { xs: '1.2rem', sm: '1.25rem', md: '1.5rem' }
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
            width: { xs: 240, sm: 250, md: 300 },
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
          fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' }, 
          mt: { xs: 0.5, sm: 1 }, 
          mb: { xs: 0.5, sm: 1 },
          lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
        }}>
          Encontre o filme perfeito para sua vibe!
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph sx={{ 
          maxWidth: 600, 
          mt: { xs: 0.5, sm: 1 }, 
          mb: { xs: 1, sm: 1 },
          fontSize: { xs: '1rem', sm: '1rem' },
          px: { xs: 1, sm: 0 }
        }}>
          O cinema vai além de espelhar seu estado de espírito: ele pode te ajudar a processar uma emoção, transformar seu humor, manter uma boa energia ou explorar novas sensações.
        </Typography>

        <Box sx={{ mt: { xs: 1, sm: 2 }, px: { xs: 2, sm: 0 }, mb: { xs: 2, sm: 0 } }}>
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
    </div>
  );
};

export default Home; 