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
  Alert,
  Fade
} from '@mui/material';
import { 
  MainSentiment, 
  EmotionalIntention, 
  PersonalizedJourneyFlow, 
  JourneyStepFlow, 
  JourneyOptionFlow, 
  getPersonalizedJourneyFlow 
} from '../services/api';

interface PersonalizedJourneyProps {
  selectedSentiment: MainSentiment;
  selectedIntention: EmotionalIntention;
  onBack: () => void;
  onRestart: () => void;
}

const PersonalizedJourney: React.FC<PersonalizedJourneyProps> = ({
  selectedSentiment,
  selectedIntention,
  onBack,
  onRestart
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journeyFlow, setJourneyFlow] = useState<PersonalizedJourneyFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStepFlow | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [stepHistory, setStepHistory] = useState<JourneyStepFlow[]>([]);

  useEffect(() => {
    const loadPersonalizedJourney = async () => {
      try {
        setLoading(true);
        const flow = await getPersonalizedJourneyFlow(selectedSentiment.id, selectedIntention.id);
        setJourneyFlow(flow);
        
        // Encontrar o primeiro step do fluxo personalizado
        const firstStep = flow.steps.find(step => step.order === 1) || flow.steps[0];
        setCurrentStep(firstStep || null);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar jornada personalizada:', error);
        setError('Erro ao carregar a jornada personalizada. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadPersonalizedJourney();
  }, [selectedSentiment.id, selectedIntention.id]);

  const handleOptionSelect = (option: JourneyOptionFlow) => {
    console.log('Opção selecionada:', option);
    if (!journeyFlow || !currentStep) return;

    // Adicionar step atual ao histórico
    setStepHistory(prev => [...prev, currentStep]);

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

  const getIntentionLabel = (type: string): string => {
    const labels = {
      'PROCESS': 'Processar',
      'TRANSFORM': 'Transformar',
      'MAINTAIN': 'Manter',
      'EXPLORE': 'Explorar'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getIntentionColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' => {
    const colors = {
      'PROCESS': 'primary' as const,
      'TRANSFORM': 'secondary' as const,
      'MAINTAIN': 'success' as const,
      'EXPLORE': 'warning' as const
    };
    return colors[type as keyof typeof colors] || 'primary';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando jornada personalizada...</p>
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
          {/* Cabeçalho com contexto */}
          <Fade in={true} timeout={500}>
            <Box sx={{ mb: 4, width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Chip 
                  label={selectedSentiment.name}
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={getIntentionLabel(selectedIntention.type)}
                  color={getIntentionColor(selectedIntention.type)}
                />
              </Box>
              
              <Typography variant="h4" gutterBottom>
                {step.customQuestion || step.question}
              </Typography>
              
              {step.contextualHint && (
                <Alert severity="info" sx={{ mt: 2, mb: 3, maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="body2">
                    💡 {step.contextualHint}
                  </Typography>
                </Alert>
              )}
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
            </Box>
          </Fade>

          {/* Botões de Navegação */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{ px: 4, py: 1.5 }}
            >
              {stepHistory.length > 0 ? 'Voltar' : 'Alterar Intenção'}
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

export default PersonalizedJourney; 