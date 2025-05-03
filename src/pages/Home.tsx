import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAdmin = () => {
    navigate('/admin');
  };

  const handleStart = () => {
    navigate('/journey');
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
        <Typography variant="h2" component="h1" gutterBottom>
          Encontre o filme perfeito para seu momento
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Responda algumas perguntas e descubra filmes que combinam com seu estado emocional
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{ mt: 4 }}
        >
          Vamos começar
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleAdmin}
          sx={{ mt: 4, ml: 2 }}
        >
          Área Admin
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 