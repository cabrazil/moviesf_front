import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { MainSentiment, JourneyFlow, JourneyStepFlow, JourneyOptionFlow, MovieSuggestionFlow, Movie, getMainSentiments, getJourneyFlow } from '../services/api';

const MovieJourney: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [selectedMainSentiment, setSelectedMainSentiment] = useState<MainSentiment | null>(null);
  const [journeyFlow, setJourneyFlow] = useState<JourneyFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStepFlow | null>(null);
  const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestionFlow[]>([]);

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

  useEffect(() => {
    if (location.state?.selectedSentiment) {
      handleMainSentimentSelect(location.state.selectedSentiment);
    }
  }, [location.state]);

  const handleMainSentimentSelect = async (mainSentiment: MainSentiment) => {
    try {
      setLoading(true);
      const flow = await getJourneyFlow(mainSentiment.id);
      setSelectedMainSentiment(mainSentiment);
      setJourneyFlow(flow);
      const step2A = flow.steps.find((step) => step.stepId === '2A');
      setCurrentStep(step2A || null);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
      setError('Erro ao carregar o fluxo. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: JourneyOptionFlow) => {
    if (!journeyFlow || !currentStep || typeof currentStep.order !== 'number') return;

    // Buscar o próximo step pelo order sequencial
    const nextStep = journeyFlow.steps.find(
      (step: JourneyStepFlow) => typeof step.order === 'number' && step.order === currentStep.order + 1
    );
    if (nextStep) {
      setCurrentStep(nextStep);
    } else if (option.movieSuggestions) {
      setMovieSuggestions(option.movieSuggestions);
    }
  };

  const handleRestart = () => {
    setSelectedMainSentiment(null);
    setJourneyFlow(null);
    setCurrentStep(null);
    setMovieSuggestions([]);
    navigate('/');
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
            onClick={handleRestart}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (!selectedMainSentiment) {
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
                  onClick={() => handleMainSentimentSelect(sentiment)}
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
  }

  if (currentStep && (currentStep as JourneyStepFlow).question && (currentStep as JourneyStepFlow).options) {
    const step = currentStep as JourneyStepFlow;
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
            {step.question}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {step.options.map((option: JourneyOptionFlow) => (
              <Grid item xs={12} sm={6} key={option.id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleOptionSelect(option)}
                >
                  <Typography variant="h6">{option.text}</Typography>
                  {option.description && (
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleRestart}
            sx={{ mt: 4 }}
          >
            Voltar ao Início
          </Button>
        </Box>
      </Container>
    );
  }

  if (movieSuggestions.length > 0) {
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
            Filmes sugeridos para você
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {movieSuggestions.map((suggestion) => (
              <Grid item xs={12} sm={6} md={4} key={suggestion.movie.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{suggestion.movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {suggestion.movie.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {suggestion.reason}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleRestart}
            sx={{ mt: 4 }}
          >
            Voltar ao Início
          </Button>
        </Box>
      </Container>
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
          {currentStep?.question}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {currentStep?.options.map((option) => (
            <Grid item xs={12} sm={6} key={option.id}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleOptionSelect(option)}
              >
                <Typography variant="h6">{option.text}</Typography>
                {option.description && (
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          onClick={handleRestart}
          sx={{ mt: 4 }}
        >
          Voltar ao Início
        </Button>
      </Box>
    </Container>
  );
};

export default MovieJourney; 