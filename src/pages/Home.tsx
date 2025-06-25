import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAdmin = () => {
    navigate('/admin');
  };

  const handleStart = () => {
    navigate('/intro');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        {/* Logo do projeto */}
        <Box
          component="img"
          src={logo}
          alt="Logo do projeto"
          sx={{
            width: { xs: 280, sm: 350, md: 400 },
            height: 'auto',
            marginBottom: 3,
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
          }}
        />
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
          Encontre o filme perfeito para seu momento
        </Typography>
        {/* <Typography variant="h5" color="text.secondary" paragraph sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
          Responda algumas perguntas e descubra filmes que combinam com seu estado emocional
        </Typography> */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Vamos começar
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleAdmin}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Área Admin
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 