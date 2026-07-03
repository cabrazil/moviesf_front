import React, { useState } from 'react';
import { Box, Button, Typography, Container, IconButton, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoBlog from '../assets/logo_header.png';
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
            src={logoBlog}
            alt="VibesFilm Logo"
            onClick={() => window.location.href = 'https://vibesfilm.com/'}
            sx={{
              height: { xs: 40, sm: 52 },
              width: 'auto',
              maxWidth: { xs: 220, sm: 340 },
              objectFit: 'contain',
              cursor: 'pointer'
            }}
          />

          {/* Desktop Navigation */}
          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2
          }}>
            <Button
              variant="contained"
              onClick={() => navigate('/blog')}
              sx={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: '500',
                px: 2,
                py: 0.75,
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/blog')}
              sx={{
                color: mode === 'dark' ? 'white' : '#1976d2',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(25,118,210,0.5)',
                textTransform: 'none',
                fontWeight: '600',
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.3,
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              Blog 🍿
            </Button>
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
            minHeight: { xs: 'calc(100vh - 70px)', sm: 'calc(100vh - 110px)' },
            textAlign: 'center',
            py: { xs: 2, sm: 4 },
            gap: { xs: 1.5, sm: 2.5 },
          }}
        >
          {/* Logo Central */}
          <Box
            component="img"
            src={logoBlog}
            alt="VibesFilm Logo"
            onError={(e) => {
              console.error('Erro ao carregar logo:', e);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            sx={{
              width: { xs: 200, sm: 260, md: 300 },
              height: 'auto',
              maxHeight: { xs: 90, sm: 120, md: 140 },
              filter: mode === 'dark'
                ? 'drop-shadow(0px 4px 12px rgba(255,255,255,0.15))'
                : 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))',
              maxWidth: '85%',
              objectFit: 'contain',
              mb: { xs: 0.5, sm: 1 }
            }}
          />

          {/* Subtítulo Kicker no estilo App Mobile */}
          <Typography
            variant="caption"
            sx={{
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              fontWeight: 700,
              color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
            }}
          >
            Cinema & Emoção
          </Typography>

          {/* Título Principal */}
          <Typography variant="h2" component="h1" sx={{
            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
            fontWeight: 800,
            lineHeight: 1.25,
            maxWidth: 650,
            px: { xs: 1, sm: 0 }
          }}>
            Encontre o filme certo para o seu momento.
          </Typography>

          {/* Descrição unificada */}
          <Typography variant="h6" color="text.secondary" paragraph sx={{
            maxWidth: 580,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            px: { xs: 1.5, sm: 0 },
            lineHeight: 1.5,
            m: 0
          }}>
            Deixe o cinema <span style={{ color: '#1976d2', fontWeight: 600 }}>acolher</span>,{' '}
            <span style={{ color: '#1976d2', fontWeight: 600 }}>transformar</span> ou{' '}
            <span style={{ color: '#1976d2', fontWeight: 600 }}>ampliar</span> o que você sente.{' '}
            <span style={{ color: '#1976d2', fontWeight: 600 }}>Em apenas 4 escolhas.</span>
          </Typography>

          {/* Slogan com aspas */}
          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            fontStyle: 'italic',
            opacity: 0.8,
            m: 0
          }}>
            "Cada emoção tem um filme."
          </Typography>

          {/* Container de Ações */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: { xs: 1, sm: 1.5 }
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStart}
              sx={{
                px: { xs: 4, sm: 5 },
                py: { xs: 1.4, sm: 1.6 },
                fontSize: { xs: '1.05rem', sm: '1.15rem' },
                fontWeight: 700,
                borderRadius: '50px', // Estilo Pill Button do App Mobile
                width: { xs: '90%', sm: 'auto' },
                maxWidth: { xs: '340px', sm: 'none' },
                backgroundColor: '#1976d2',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                }
              }}
            >
              Como você se sente agora?
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/blog')}
              sx={{
                display: { xs: 'inline-flex', sm: 'none' },
                mt: 1.5,
                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                textTransform: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: '#1976d2',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Prefere ler artigos? <span style={{ textDecoration: 'underline', marginLeft: 6, fontWeight: 600 }}>Acesse o Blog ➔</span>
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Home; 