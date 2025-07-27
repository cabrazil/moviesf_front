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
  EmotionalIntention, 
  PersonalizedJourneyFlow, 
  JourneyStepFlow, 
  JourneyOptionFlow, 
  getPersonalizedJourneyFlow 
} from '../services/api';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';

interface PersonalizedJourneyProps {
  selectedSentiment: MainSentiment;
  selectedIntention: EmotionalIntention;
  onBack: () => void;
  onRestart: () => void;
}

// Função para validar a integridade da jornada personalizada (atualizada para Intenções Emocionais)
const validatePersonalizedJourneyIntegrity = (journeyFlow: PersonalizedJourneyFlow): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!journeyFlow || !journeyFlow.steps) {
    errors.push('PersonalizedJourneyFlow ou steps não disponíveis');
    return { isValid: false, errors };
  }

  // Validação específica para jornadas baseadas em Intenções Emocionais
  console.log('ℹ️ Validando jornada personalizada baseada em EmotionalIntentionJourneyStep');

  journeyFlow.steps.forEach((step, stepIndex) => {
    if (!step.stepId) {
      errors.push(`Step ${stepIndex + 1} não possui stepId`);
    }
    
    if (!step.question && !step.customQuestion) {
      errors.push(`Step ${step.stepId} não possui pergunta nem pergunta customizada`);
    }
    
    if (!step.options || step.options.length === 0) {
      errors.push(`Step ${step.stepId} não possui opções`);
    } else {
      step.options.forEach((option, optionIndex) => {
        if (!option.text) {
          errors.push(`Opção ${optionIndex + 1} do step ${step.stepId} não possui texto`);
        }
        
        if (option.isEndState === false && !option.nextStepId) {
          errors.push(`Opção "${option.text}" do step ${step.stepId} não é final mas não possui nextStepId`);
        }
        
        if (option.isEndState === true && (!option.movieSuggestions || option.movieSuggestions.length === 0)) {
          errors.push(`Opção "${option.text}" do step ${step.stepId} é final mas não possui sugestões de filmes`);
        }
        
        // Verificar se nextStepId aponta para um step válido
        if (option.nextStepId) {
          const nextStepExists = journeyFlow.steps.some(s => s.stepId === option.nextStepId);
          if (!nextStepExists) {
            errors.push(`Opção "${option.text}" do step ${step.stepId} aponta para nextStepId "${option.nextStepId}" que não existe`);
          }
        }
      });
    }
  });

  return { isValid: errors.length === 0, errors };
};

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
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  useEffect(() => {
    const loadPersonalizedJourney = async () => {
      try {
        setLoading(true);
        const flow = await getPersonalizedJourneyFlow(selectedSentiment.id, selectedIntention.id);
        
        // Validar integridade da jornada personalizada
        const validation = validatePersonalizedJourneyIntegrity(flow);
        if (!validation.isValid) {
          console.error('❌ Problemas na integridade da jornada personalizada:', validation.errors);
          console.warn('⚠️ A jornada personalizada pode não funcionar corretamente devido aos seguintes problemas:');
          validation.errors.forEach(error => console.warn(`  - ${error}`));
        } else {
          console.log('✅ Jornada personalizada validada com sucesso');
        }
        
        setJourneyFlow(flow);
        
        // NOVA LÓGICA PARA JORNADAS BASEADAS EM INTENÇÕES
        // O sistema usa EmotionalIntentionJourneyStep para definir quais steps são usados
        // Os steps começam com order=2+ pois order=1 foi substituído pelo sistema de intenções
        console.log(`🧠 Jornada personalizada para intenção: ${selectedIntention.type}`);
        console.log('🔄 Sistema baseado em EmotionalIntentionJourneyStep - sem order=1');
        
        // Encontrar o primeiro step personalizado (baseado em priority, não order)
        let firstStep = flow.steps.find(step => step.priority === 1);
        if (!firstStep) {
          // Se não há priority=1, usar o step com menor priority ou menor order
          const sortedByPriority = [...flow.steps].sort((a, b) => (a.priority || 999) - (b.priority || 999));
          const sortedByOrder = [...flow.steps].sort((a, b) => a.order - b.order);
          firstStep = sortedByPriority[0] || sortedByOrder[0];
          console.log(`🎯 Usando step com priority=${firstStep?.priority} ou order=${firstStep?.order}`);
        }
        
        if (!firstStep) {
          console.error('❌ Nenhum step encontrado na jornada personalizada');
          setError('Erro: jornada personalizada não possui steps válidos.');
          setLoading(false);
          return;
        }
        
        console.log('🚀 Iniciando jornada personalizada no step:', {
          id: firstStep.id,
          stepId: firstStep.stepId,
          question: firstStep.question || firstStep.customQuestion,
          optionsCount: firstStep.options?.length || 0,
          isRequired: firstStep.isRequired,
          contextualHint: firstStep.contextualHint
        });
        
        setCurrentStep(firstStep);
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
    console.log('=== NAVEGAÇÃO DA JORNADA PERSONALIZADA ===');
    console.log('Opção selecionada:', option);
    console.log('isEndState:', option.isEndState);
    console.log('nextStepId:', option.nextStepId);
    console.log('movieSuggestions:', option.movieSuggestions);
    
    if (!journeyFlow || !currentStep) {
      console.error('Erro: journeyFlow ou currentStep não disponível');
      return;
    }

    // Adicionar step atual ao histórico antes de navegar
    setStepHistory(prev => [...prev, currentStep]);

    // TESTE EXPLÍCITO DO CAMPO isEndState
    if (option.isEndState === true) {
      console.log('✅ Estado final detectado (isEndState = true)');
      
      // Verificar se há sugestões de filmes disponíveis
      if (option.movieSuggestions && option.movieSuggestions.length > 0) {
        console.log('✅ Sugestões de filmes encontradas, navegando para página de resultados');
        console.log('Sugestões:', option.movieSuggestions);
        navigate('/sugestoes/minimal', { 
          state: { 
            movieSuggestions: option.movieSuggestions,
            journeyContext: {
              selectedSentiment,
              selectedIntention,
              journeyType: 'personalized',
              returnPath: '/intro'
            }
          } 
        });
        return;
      } else {
        console.warn('⚠️ Estado final sem sugestões de filmes');
        setError('Esta opção não possui filmes disponíveis. Por favor, tente outra opção.');
        return;
      }
    }

    // CASO isEndState = false, deve apresentar novo step
    if (option.isEndState === false) {
      console.log('➡️ Continuando jornada personalizada (isEndState = false)');
      
      // Verificar se há nextStepId
      if (!option.nextStepId) {
        console.error('❌ Erro: nextStepId não encontrado para continuar a jornada');
        setError('Erro na navegação: próximo passo não definido. Por favor, contate o suporte.');
        return;
      }

             console.log('🔍 Buscando próximo step com ID:', option.nextStepId);
       console.log('🔍 Steps disponíveis na jornada personalizada:');
       journeyFlow.steps.forEach(step => {
         console.log(`  - Step ID: ${step.id}, StepId: "${step.stepId}", Order: ${step.order}`);
       });

       // Buscar o próximo step pelo nextStepId na estrutura da jornada
       // Tentar busca exata primeiro
       let nextStep = journeyFlow.steps.find(
         (step: JourneyStepFlow) => step.stepId === option.nextStepId
       );

       // Se não encontrar, tentar busca com trim (remover espaços)
       if (!nextStep && option.nextStepId) {
         console.log('🔍 Tentando busca com trim...');
         nextStep = journeyFlow.steps.find(
           (step: JourneyStepFlow) => step.stepId.trim() === option.nextStepId!.trim()
         );
       }

      if (nextStep) {
        console.log('✅ Próximo step encontrado:', {
          id: nextStep.id,
          stepId: nextStep.stepId,
          question: nextStep.question,
          optionsCount: nextStep.options?.length || 0,
          customQuestion: nextStep.customQuestion,
          contextualHint: nextStep.contextualHint
        });

        // Verificar se o próximo step tem opções disponíveis
        if (!nextStep.options || nextStep.options.length === 0) {
          console.warn('⚠️ Próximo step não possui opções disponíveis');
          setError('Próximo passo não possui opções disponíveis. Por favor, tente novamente.');
          return;
        }

        // Navegar para o próximo step
        setCurrentStep(nextStep);
        setSelectedOption(''); // Reset da seleção para o próximo step
        console.log('✅ Navegação para próximo step da jornada personalizada concluída com sucesso');
      } else {
        console.error('❌ Próximo step não encontrado na estrutura da jornada personalizada');
        console.log('Steps disponíveis:', journeyFlow.steps.map(s => ({ id: s.id, stepId: s.stepId })));
        setError(`Erro ao avançar: próximo passo "${option.nextStepId}" não encontrado. Por favor, contate o suporte.`);
        return;
      }
    }

    console.log('=== FIM DA NAVEGAÇÃO PERSONALIZADA ===');
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

  // Debug: verificar estado do currentStep
  console.log('🔍 Estado do currentStep para renderização:', {
    hasCurrentStep: !!currentStep,
    hasQuestion: !!currentStep?.question,
    hasOptions: !!currentStep?.options,
    optionsLength: currentStep?.options?.length || 0,
    stepId: currentStep?.stepId,
    stepData: currentStep
  });

  if (currentStep && currentStep.question && currentStep.options) {
    const step = currentStep;
    const hasManyOptions = step.options.length > 8; // Aumentado para 8 opções
    
    console.log('✅ Renderizando step:', {
      stepId: step.stepId,
      question: step.question,
      optionsCount: step.options.length,
      hasManyOptions
    });

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
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: mode === 'dark' ? 'white' : 'black'
                  }}
                >
                  Jornada emocional:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Chip
                    label={selectedSentiment.name}
                    variant="outlined"
                    sx={{
                      borderColor: currentSentimentColors[selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2',
                      color: currentSentimentColors[selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: '40px',
                      borderRadius: '20px',
                      borderWidth: '2px',
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                    size="medium"
                  />
                  <Chip 
                    label={getIntentionLabel(selectedIntention.type)}
                    variant="outlined"
                    sx={{
                      borderColor: currentSentimentColors[selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2',
                      color: currentSentimentColors[selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: '40px',
                      borderRadius: '20px',
                      borderWidth: '2px',
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                    size="medium"
                  />
                </Box>
              </Box>
              
              <Typography variant="h4" gutterBottom>
                {step.customQuestion || step.question}
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
                        {option.text} ({option.id})
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
                          backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <Typography variant="h6">{option.text} ({option.id})</Typography>
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
              variant="outlined"
              onClick={onRestart}
              sx={{ px: 4, py: 1.5 }}
            >
              Recomeçar
            </Button>
          </Box>


        </Box>
      </Container>
    );
  }

  // Debug: caso não renderize
  console.log('❌ Não renderizando - condições não atendidas:', {
    hasCurrentStep: !!currentStep,
    hasQuestion: !!currentStep?.question,
    hasOptions: !!currentStep?.options,
    currentStep
  });

  return null;
};

export default PersonalizedJourney; 