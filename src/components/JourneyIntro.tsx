import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import { MainSentiment, getMainSentiments } from '../services/api';

const JourneyIntro: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);

  useEffect(() => {
    const loadMainSentiments = async () => {
      try {
        const data = await getMainSentiments();
        setMainSentiments(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar sentimentos:', error);
        setError('Erro ao carregar os sentimentos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadMainSentiments();
  }, []);

  const handleSentimentSelect = (sentiment: MainSentiment) => {
    navigate('/journey', { state: { selectedSentiment: sentiment } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
        <Typography variant="h4" gutterBottom>
          Como você está se sentindo principalmente neste momento?
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {mainSentiments.map((sentiment) => (
            <Grid item xs={12} sm={6} key={sentiment.id}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleSentimentSelect(sentiment)}
              >
                <Typography variant="h6">{sentiment.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {sentiment.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default JourneyIntro; 