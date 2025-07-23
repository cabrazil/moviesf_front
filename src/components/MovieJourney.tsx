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
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';

/**
 * ARQUITETURA DE JORNADAS EMOCIONAIS - NOVA VERSÃO
 * 
 * O sistema foi atualizado para usar Intenções Emocionais como ponto de partida:
 * 
 * FLUXO ANTIGO:
 * MainSentiment → JourneyFlow → JourneyStepFlow (order=1,2,3...) → JourneyOptionFlow
 * 
 * FLUXO ATUAL:
 * MainSentiment → EmotionalIntention (PROCESS/TRANSFORM/MAINTAIN/EXPLORE) 
 *              → EmotionalIntentionJourneyStep (associa emotionalIntentionId + journeyStepFlowId)
 *              → JourneyStepFlow (order=2,3,4... - sem order=1) 
 *              → JourneyOptionFlow
 * 
 * IMPLICAÇÕES:
 * - Não há mais steps com order=1 (substituído pelo sistema de intenções)
 * - Jornadas tradicionais começam com order=2
 * - Jornadas personalizadas usam priority baseado em EmotionalIntentionJourneyStep
 * - navegação por nextStepId continua funcionando normalmente
 */

interface MovieJourneyProps {
  selectedSentiment: MainSentiment;
  onBack: () => void;
  onRestart: () => void;
}

// Função para validar a integridade da jornada (atualizada para nova arquitetura)
const validateJourneyIntegrity = (journeyFlow: JourneyFlow): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!journeyFlow || !journeyFlow.steps) {
    errors.push('JourneyFlow ou steps não disponíveis');
    return { isValid: false, errors };
  }

  // Nova validação: não exigir order=1 (sistema de Intenções Emocionais)
  const hasOrderOne = journeyFlow.steps.some(s => s.order === 1);
  if (!hasOrderOne) {
    console.log('ℹ️ Jornada usa sistema de Intenções Emocionais (sem order=1)');
  }

  journeyFlow.steps.forEach((step, stepIndex) => {
    if (!step.stepId) {
      errors.push(`Step ${stepIndex + 1} não possui stepId`);
    }
    
    if (!step.question) {
      errors.push(`Step ${step.stepId} não possui pergunta`);
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
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  useEffect(() => {
    const loadJourneyFlow = async () => {
      try {
        setLoading(true);
        const flow = await getJourneyFlow(selectedSentiment.id);
        
        console.log('🔍 Estrutura da jornada carregada:');
        console.log('JourneyFlow ID:', flow.id);
        console.log('MainSentimentId:', flow.mainSentimentId);
        console.log('Total de steps:', flow.steps.length);
        
        // Log detalhado de todos os steps
        flow.steps.forEach((step, index) => {
          console.log(`Step ${index + 1}:`, {
            id: step.id,
            stepId: step.stepId,
            order: step.order,
            question: step.question.substring(0, 50) + '...',
            optionsCount: step.options?.length || 0
          });
        });
        
        // Validar integridade da jornada carregada
        const validation = validateJourneyIntegrity(flow);
        if (!validation.isValid) {
          console.error('❌ Problemas na integridade da jornada:', validation.errors);
          console.warn('⚠️ A jornada pode não funcionar corretamente devido aos seguintes problemas:');
          validation.errors.forEach(error => console.warn(`  - ${error}`));
        } else {
          console.log('✅ Jornada validada com sucesso');
        }
        
        setJourneyFlow(flow);
        
        // NOVA LÓGICA: Encontrar o primeiro step (não há mais order=1 devido às Intenções Emocionais)
        // O sistema agora usa EmotionalIntentionJourneyStep para definir o ponto de partida
        // Para jornadas tradicionais, começamos com o step de menor ordem disponível
        console.log('🔄 Sistema de Intenções Emocionais ativo - sem steps order=1');
        
        let firstStep = flow.steps.find(step => step.order === 1);
        if (!firstStep) {
          // Nova arquitetura: buscar step com menor ordem (normalmente order=2)
          const sortedSteps = [...flow.steps].sort((a, b) => a.order - b.order);
          firstStep = sortedSteps[0];
          console.log(`🎯 Iniciando jornada tradicional com order=${firstStep?.order} (nova arquitetura sem order=1)`);
        }
        
        if (!firstStep) {
          console.error('❌ Nenhum step encontrado na jornada');
          setError('Erro: jornada não possui steps válidos.');
          setLoading(false);
          return;
        }
        
        console.log('🚀 Iniciando jornada no step:', {
          id: firstStep.id,
          stepId: firstStep.stepId,
          question: firstStep.question,
          optionsCount: firstStep.options?.length || 0
        });
        
        setCurrentStep(firstStep);
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
    console.log('=== NAVEGAÇÃO DA JORNADA ===');
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
              journeyType: 'traditional',
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
      console.log('➡️ Continuando jornada (isEndState = false)');
      
      // Verificar se há nextStepId
      if (!option.nextStepId) {
        console.error('❌ Erro: nextStepId não encontrado para continuar a jornada');
        setError('Erro na navegação: próximo passo não definido. Por favor, contate o suporte.');
        return;
      }

             console.log('🔍 Buscando próximo step com ID:', option.nextStepId);
       console.log('🔍 Steps disponíveis na jornada:');
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
          optionsCount: nextStep.options?.length || 0
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
        console.log('✅ Navegação para próximo step concluída com sucesso');
      } else {
        console.error('❌ Próximo step não encontrado na estrutura da jornada');
        console.log('Steps disponíveis:', journeyFlow.steps.map(s => ({ id: s.id, stepId: s.stepId })));
        setError(`Erro ao avançar: próximo passo "${option.nextStepId}" não encontrado. Por favor, contate o suporte.`);
        return;
      }
    }

    console.log('=== FIM DA NAVEGAÇÃO ===');
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
    const hasManyOptions = step.options.length > 8; // Aumentado para 8 opções

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
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: mode === 'dark' ? 'white' : 'black'
                  }}
                >
                  Sentimento selecionado:
                </Typography>
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
                          backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
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


        </Box>
      </Container>
    );
  }

  return null;
};

export default MovieJourney; 