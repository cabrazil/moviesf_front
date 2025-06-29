import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Container, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Fade
} from '@mui/material';
import { 
  MainSentiment, 
  JourneyFlow, 
  JourneyStepFlow, 
  JourneyOptionFlow, 
  getJourneyFlow 
} from '../services/api';

interface MovieJourneyProps {
  selectedSentiment: MainSentiment;
  onBack: () => void;
  onRestart: () => void;
}

const MovieJourney: React.FC<MovieJourneyProps> = ({
  selectedSentiment,
  onBack,
  onRestart
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journeyFlow, setJourneyFlow] = useState<JourneyFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStepFlow | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [stepHistory, setStepHistory] = useState<JourneyStepFlow[]>([]);

  useEffect(() => {
    const loadJourneyFlow = async () => {
      try {
        setLoading(true);
        const flow = await getJourneyFlow(selectedSentiment.id);
        setJourneyFlow(flow);
        
        // Encontrar o primeiro step
        const firstStep = flow.steps.find(step => step.order === 1) || flow.steps[0];
        setCurrentStep(firstStep || null);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar jornada:', error);
        setError('Erro ao carregar a jornada. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadJourneyFlow();
  }, [selectedSentiment.id]);

  const handleOptionSelect = (option: JourneyOptionFlow) => {
    console.log('Opção selecionada:', option);
    if (!journeyFlow || !currentStep) return;

    // Adicionar step atual ao histórico
    setStepHistory(prev => [...prev, currentStep]);

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

  const handleGoBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setCurrentStep(previousStep);
      setStepHistory(prev => prev.slice(0, -1));
      setSelectedOption('');
    } else {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando jornada...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep && currentStep.question && currentStep.options) {
    const step = currentStep;
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
            py: 4
          }}
        >
          {/* Cabeçalho */}
          <Fade in={true} timeout={500}>
            <Box sx={{ mb: 4, width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Chip 
                  label={selectedSentiment.name}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="h4" gutterBottom>
                {step.question}
              </Typography>
            </Box>
          </Fade>
          
          {/* Opções */}
          <Fade in={true} timeout={800}>
            <Box sx={{ width: '100%', maxWidth: 800 }}>
              {hasManyOptions ? (
                <FormControl fullWidth sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
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
                <Grid container spacing={2}>
                  {step.options.map((option: JourneyOptionFlow) => (
                    <Grid item xs={12} sm={6} key={option.id}>
                      <Paper
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <Typography variant="h6">{option.text}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>

          {/* Botões de Navegação */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{ px: 4, py: 1.5 }}
            >
              {stepHistory.length > 0 ? 'Voltar' : 'Alterar Sentimento'}
            </Button>
            <Button
              variant="text"
              onClick={onRestart}
              sx={{ px: 4, py: 1.5 }}
            >
              Recomeçar
            </Button>
          </Box>

          {/* Indicador de Progresso */}
          {journeyFlow && (
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Passo {(stepHistory.length + 1)} de {journeyFlow.steps.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {Array.from({ length: journeyFlow.steps.length }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index <= stepHistory.length ? 'primary.main' : 'grey.300'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    );
  }

  return null;
};

export default MovieJourney; 