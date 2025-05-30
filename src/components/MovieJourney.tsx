import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { MainSentiment, JourneyFlow, JourneyStepFlow, JourneyOptionFlow, MovieSuggestionFlow, getJourneyFlow } from '../services/api';

const MovieJourney: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMainSentiment, setSelectedMainSentiment] = useState<MainSentiment | null>(null);
  const [journeyFlow, setJourneyFlow] = useState<JourneyFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStepFlow | null>(null);
  const [movieSuggestions, setMovieSuggestions] = useState<MovieSuggestionFlow[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (location.state?.selectedSentiment) {
      handleMainSentimentSelect(location.state.selectedSentiment);
    } else {
      navigate('/');
    }
  }, [location.state]);

  const handleMainSentimentSelect = async (mainSentiment: MainSentiment) => {
    try {
      setLoading(true);
      const flow = await getJourneyFlow(mainSentiment.id);
      setSelectedMainSentiment(mainSentiment);
      setJourneyFlow(flow);
      
      // Encontrar o primeiro step do fluxo
      const firstStep = flow.steps.find(step => step.order === 1);
      setCurrentStep(firstStep || null);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
      setError('Erro ao carregar o fluxo. Por favor, tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: JourneyOptionFlow) => {
    console.log('Opção selecionada:', option);
    if (!journeyFlow || !currentStep) return;

    console.log('isEndState:', option.isEndState);
    console.log('movieSuggestions:', option.movieSuggestions);

    if (option.isEndState && option.movieSuggestions) {
      console.log('Navegando para sugestões com:', option.movieSuggestions);
      navigate('/sugestoes/minimal', { state: { movieSuggestions: option.movieSuggestions } });
      return;
    }

    // Buscar o próximo step pelo nextStepId
    const nextStep = journeyFlow.steps.find(
      (step: JourneyStepFlow) => step.stepId === option.nextStepId
    );

    if (nextStep) {
      setCurrentStep(nextStep);
      setSelectedOption(''); // Reset selected option for next step
    } else {
      console.error('Próximo step não encontrado:', option.nextStepId);
      setError('Erro ao avançar no fluxo. Por favor, tente novamente mais tarde.');
    }
  };

  const handleDropdownChange = (event: any) => {
    const optionId = event.target.value;
    setSelectedOption(optionId);
    const option = currentStep?.options.find(opt => opt.id === optionId);
    if (option) {
      handleOptionSelect(option);
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

  if (currentStep && (currentStep as JourneyStepFlow).question && (currentStep as JourneyStepFlow).options) {
    const step = currentStep as JourneyStepFlow;
    const hasManyOptions = step.options.length > 6;

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
          
          {hasManyOptions ? (
            <FormControl fullWidth sx={{ mt: 2, maxWidth: 400 }}>
              <InputLabel id="option-select-label">Selecione uma opção</InputLabel>
              <Select
                labelId="option-select-label"
                value={selectedOption}
                label="Selecione uma opção"
                onChange={handleDropdownChange}
                sx={{ 
                  bgcolor: 'background.paper',
                  '& .MuiSelect-select': {
                    py: 2
                  }
                }}
              >
                {step.options.map((option: JourneyOptionFlow) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
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
          )}

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
                <Paper 
                  sx={{ 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {suggestion.movie.thumbnail && (
                    <img 
                      src={suggestion.movie.thumbnail} 
                      alt={suggestion.movie.title}
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    />
                  )}
                  <Typography variant="h6" align="center">
                    {suggestion.movie.title}
                  </Typography>
                  {suggestion.movie.original_title && (
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary"
                      align="center"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {suggestion.movie.original_title}
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                  >
                    {suggestion.movie.description}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
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

  return null;
};

export default MovieJourney; 