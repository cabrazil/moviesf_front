import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Fade,
  LinearProgress,
  useMediaQuery,
  useTheme
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
  if (process.env.NODE_ENV === 'development') {
    console.log('ℹ️ Validando jornada personalizada baseada em EmotionalIntentionJourneyStep');
  }

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

        // NOVA VALIDAÇÃO: Verificar se opções com nextStepId têm isEndState = false
        if (option.nextStepId && option.isEndState === true) {
          errors.push(`Opção "${option.text}" do step ${step.stepId} possui nextStepId mas isEndState = true (inconsistência)`);
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

// Função auxiliar movida para fora do componente
const getIntentionLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'PROCESS': 'Processar',
    'TRANSFORM': 'Transformar',
    'MAINTAIN': 'Manter',
    'EXPLORE': 'Explorar'
  };
  return labels[type] || type;
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [journeyFlow, setJourneyFlow] = useState<PersonalizedJourneyFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStepFlow | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [stepHistory, setStepHistory] = useState<JourneyStepFlow[]>([]);
  const { mode } = useThemeManager();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Cache usando useRef para evitar re-renders
  const journeyCacheRef = useRef<Map<string, PersonalizedJourneyFlow>>(new Map());

  // Flag para evitar requisições duplicadas usando useRef
  const isLoadingJourneyRef = useRef(false);

  // Memoizar cores do sentimento
  const currentSentimentColors = useMemo(() =>
    mode === 'dark' ? darkSentimentColors : lightSentimentColors,
    [mode]
  );

  // Memoizar cor do sentimento atual
  const sentimentColor = useMemo(() =>
    currentSentimentColors[selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2',
    [currentSentimentColors, selectedSentiment.id]
  );

  // Memoizar label da intenção
  const intentionLabel = useMemo(() =>
    getIntentionLabel(selectedIntention.type),
    [selectedIntention.type]
  );

  // Memoizar se tem muitas opções
  const hasManyOptions = useMemo(() =>
    currentStep?.options ? currentStep.options.length > 8 : false,
    [currentStep?.options]
  );

  useEffect(() => {
    const loadPersonalizedJourney = async () => {
      // Evitar requisições duplicadas
      if (isLoadingJourneyRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⏳ Jornada já está sendo carregada, ignorando requisição duplicada');
        }
        return;
      }

      try {
        // Verificar cache primeiro
        const cacheKey = `${selectedSentiment.id}-${selectedIntention.id}`;
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Verificando cache para chave:', cacheKey);
        }

        if (journeyCacheRef.current.has(cacheKey)) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Jornada encontrada no cache, carregando...');
          }
          const cachedFlow = journeyCacheRef.current.get(cacheKey)!;
          setJourneyFlow(cachedFlow);

          // Encontrar o primeiro step do cache
          let firstStep = cachedFlow.steps.find(step => step.priority === 1);
          if (!firstStep) {
            const sortedByPriority = [...cachedFlow.steps].sort((a, b) => (a.priority || 999) - (b.priority || 999));
            const sortedByOrder = [...cachedFlow.steps].sort((a, b) => a.order - b.order);
            firstStep = sortedByPriority[0] || sortedByOrder[0];
          }

          if (firstStep) {
            setCurrentStep(firstStep);
            setLoading(false);
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Jornada carregada do cache com sucesso');
            }
            return;
          }
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Cache não encontrado, carregando da API...');
        }
        isLoadingJourneyRef.current = true;
        setLoading(true);
        setLoadingProgress(0);

        // Simular progresso para feedback visual
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev < 90) return prev + 10;
            return prev;
          });
        }, 100);

        const flow = await getPersonalizedJourneyFlow(selectedSentiment.id, selectedIntention.id);

        clearInterval(progressInterval);
        setLoadingProgress(100);

        // Validar integridade da jornada personalizada
        const validation = validatePersonalizedJourneyIntegrity(flow);
        if (!validation.isValid) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Problemas na integridade da jornada personalizada:', validation.errors);
            console.warn('⚠️ A jornada personalizada pode não funcionar corretamente devido aos seguintes problemas:');
            validation.errors.forEach(error => console.warn(`  - ${error}`));
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Jornada personalizada validada com sucesso');
          }
        }

        setJourneyFlow(flow);

        // Salvar no cache
        journeyCacheRef.current.set(cacheKey, flow);
        if (process.env.NODE_ENV === 'development') {
          console.log('💾 Jornada salva no cache com chave:', cacheKey);
        }

        // NOVA LÓGICA PARA JORNADAS BASEADAS EM INTENÇÕES
        if (process.env.NODE_ENV === 'development') {
          console.log(`🧠 Jornada personalizada para intenção: ${selectedIntention.type}`);
          console.log('🔄 Sistema baseado em EmotionalIntentionJourneyStep - sem order=1');
        }

        // Encontrar o primeiro step personalizado (baseado em priority, não order)
        let firstStep = flow.steps.find(step => step.priority === 1);
        if (!firstStep) {
          // Se não há priority=1, usar o step com menor priority ou menor order
          const sortedByPriority = [...flow.steps].sort((a, b) => (a.priority || 999) - (b.priority || 999));
          const sortedByOrder = [...flow.steps].sort((a, b) => a.order - b.order);
          firstStep = sortedByPriority[0] || sortedByOrder[0];
          if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 Usando step com priority=${firstStep?.priority} ou order=${firstStep?.order}`);
          }
        }

        if (!firstStep) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Nenhum step encontrado na jornada personalizada');
          }
          setError('Erro: jornada personalizada não possui steps válidos.');
          setLoading(false);
          isLoadingJourneyRef.current = false;
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 Iniciando jornada personalizada no step:', {
            id: firstStep.id,
            stepId: firstStep.stepId,
            question: firstStep.question || firstStep.customQuestion,
            optionsCount: firstStep.options?.length || 0,
            isRequired: firstStep.isRequired,
            contextualHint: firstStep.contextualHint
          });
        }

        setCurrentStep(firstStep);
        // Pequeno delay para mostrar o progresso completo
        setTimeout(() => {
          setLoading(false);
          isLoadingJourneyRef.current = false;
        }, 200);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao carregar jornada personalizada:', error);
        }
        setError('Erro ao carregar a jornada personalizada. Por favor, tente novamente mais tarde.');
        setLoading(false);
        isLoadingJourneyRef.current = false;
      }
    };

    loadPersonalizedJourney();
  }, [selectedSentiment.id, selectedIntention.id]); // Removido isLoadingJourney das dependências

  // Memoizar função de busca de step
  const findStepById = useCallback((stepId: string, steps: JourneyStepFlow[]): JourneyStepFlow | undefined => {
    // Tentar busca exata primeiro
    let nextStep = steps.find((step: JourneyStepFlow) => step.stepId === stepId);

    // Se não encontrar, tentar busca com trim (remover espaços)
    if (!nextStep && stepId) {
      nextStep = steps.find((step: JourneyStepFlow) => step.stepId.trim() === stepId.trim());
    }

    return nextStep;
  }, []);

  const handleOptionSelect = useCallback((option: JourneyOptionFlow) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== NAVEGAÇÃO DA JORNADA PERSONALIZADA ===');
      console.log('Opção selecionada:', option);
      console.log('isEndState:', option.isEndState);
      console.log('nextStepId:', option.nextStepId);
      console.log('movieSuggestions:', option.movieSuggestions);
    }

    if (!journeyFlow || !currentStep) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro: journeyFlow ou currentStep não disponível');
      }
      return;
    }

    // Adicionar step atual ao histórico antes de navegar
    setStepHistory(prev => [...prev, currentStep]);

    // LÓGICA CORRIGIDA: Verificar isEndState primeiro
    if (option.isEndState === true) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Estado final detectado (isEndState = true)');
      }

      // Verificar se há sugestões de filmes disponíveis
      if (option.movieSuggestions && option.movieSuggestions.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Sugestões de filmes encontradas, navegando para página de filtros');
          console.log('Sugestões:', option.movieSuggestions);
          console.log('✅ Texto da opção selecionada:', option.text);
        }

        // Adicionar o texto da opção às sugestões para uso na tela de filtros
        const movieSuggestionsWithOptionText = option.movieSuggestions.map((suggestion: any) => ({
          ...suggestion,
          journeyOptionFlow: {
            ...suggestion.journeyOptionFlow,
            text: option.text
          }
        }));

        navigate('/filters', {
          state: {
            movieSuggestions: movieSuggestionsWithOptionText,
            selectedOptionText: (isMobile && option.mobileText) ? option.mobileText : option.text, // Backup direto
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
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Estado final sem sugestões de filmes');
        }
        setError('Esta opção não possui filmes disponíveis. Por favor, tente outra opção.');
        return;
      }
    }

    // LÓGICA CORRIGIDA: Se isEndState = false, SEMPRE deve ter nextStepId
    if (option.isEndState === false) {
      if (process.env.NODE_ENV === 'development') {
        console.log('➡️ Continuando jornada personalizada (isEndState = false)');
      }

      // Verificar se há nextStepId
      if (!option.nextStepId) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Erro: nextStepId não encontrado para continuar a jornada');
        }
        setError('Erro na navegação: próximo passo não definido. Por favor, contate o suporte.');
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Buscando próximo step com ID:', option.nextStepId);
        console.log('🔍 Steps disponíveis na jornada personalizada:');
        journeyFlow.steps.forEach(step => {
          console.log(`  - Step ID: ${step.id}, StepId: "${step.stepId}", Order: ${step.order}`);
        });
      }

      // Buscar o próximo step usando função memoizada
      const nextStep = findStepById(option.nextStepId, journeyFlow.steps);

      if (nextStep) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Próximo step encontrado:', {
            id: nextStep.id,
            stepId: nextStep.stepId,
            question: nextStep.question,
            optionsCount: nextStep.options?.length || 0,
            customQuestion: nextStep.customQuestion,
            contextualHint: nextStep.contextualHint
          });
        }

        // Verificar se o próximo step tem opções disponíveis
        if (!nextStep.options || nextStep.options.length === 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Próximo step não possui opções disponíveis');
          }
          setError('Próximo passo não possui opções disponíveis. Por favor, tente novamente.');
          return;
        }

        // Navegar para o próximo step
        setCurrentStep(nextStep);
        setSelectedOption(''); // Reset da seleção para o próximo step
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Navegação para próximo step da jornada personalizada concluída com sucesso');
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Próximo step não encontrado na estrutura da jornada personalizada');
          console.log('Steps disponíveis:', journeyFlow.steps.map(s => ({ id: s.id, stepId: s.stepId })));
        }
        setError(`Erro ao avançar: próximo passo "${option.nextStepId}" não encontrado. Por favor, contate o suporte.`);
        return;
      }
    }

    // CASO ESPECIAL: Se isEndState não está definido, verificar se há nextStepId
    if (option.isEndState === undefined || option.isEndState === null) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ isEndState não definido, verificando nextStepId...');
      }

      if (option.nextStepId) {
        if (process.env.NODE_ENV === 'development') {
          console.log('➡️ nextStepId encontrado, continuando jornada...');
        }
        // Reutilizar a lógica de navegação para próximo step
        const nextStep = findStepById(option.nextStepId, journeyFlow.steps);

        if (nextStep) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Próximo step encontrado (isEndState undefined):', {
              id: nextStep.id,
              stepId: nextStep.stepId,
              question: nextStep.question,
              optionsCount: nextStep.options?.length || 0
            });
          }

          if (!nextStep.options || nextStep.options.length === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ Próximo step não possui opções disponíveis');
            }
            setError('Próximo passo não possui opções disponíveis. Por favor, tente novamente.');
            return;
          }

          setCurrentStep(nextStep);
          setSelectedOption('');
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Navegação para próximo step concluída (isEndState undefined)');
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Próximo step não encontrado (isEndState undefined)');
          }
          setError(`Erro ao avançar: próximo passo "${option.nextStepId}" não encontrado. Por favor, contate o suporte.`);
          return;
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ isEndState não definido e sem nextStepId');
        }
        setError('Erro na configuração da opção: estado não definido. Por favor, contate o suporte.');
        return;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('=== FIM DA NAVEGAÇÃO PERSONALIZADA ===');
    }
  }, [journeyFlow, currentStep, navigate, selectedSentiment, selectedIntention, findStepById]);

  const handleDropdownChange = useCallback((event: any) => {
    const optionId = event.target.value;
    setSelectedOption(optionId);
    const option = currentStep?.options.find(opt => opt.id === optionId);
    if (option) {
      handleOptionSelect(option);
    }
  }, [currentStep?.options, handleOptionSelect]);

  const handleGoBack = useCallback(() => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setCurrentStep(previousStep);
      setStepHistory(prev => prev.slice(0, -1));
      setSelectedOption('');
    } else {
      onBack();
    }
  }, [stepHistory, onBack]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            py: 4
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                border: 3,
                borderColor: 'primary.main',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                mb: 2,
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
            <Typography variant="h6" color="text.secondary">
              Preparando sua jornada...
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 300, mt: 2, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={loadingProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {loadingProgress < 100 ? `${Math.round(loadingProgress)}%` : 'Quase pronto...'}
            </Typography>
          </Box>
        </Box>
      </Container>
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

  // Debug apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Estado do currentStep para renderização:', {
      hasCurrentStep: !!currentStep,
      hasQuestion: !!currentStep?.question,
      hasOptions: !!currentStep?.options,
      optionsLength: currentStep?.options?.length || 0,
      stepId: currentStep?.stepId,
      stepData: currentStep
    });
  }

  if (currentStep && currentStep.question && currentStep.options) {
    const step = currentStep;

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Renderizando step:', {
        stepId: step.stepId,
        question: step.question,
        optionsCount: step.options.length,
        hasManyOptions
      });
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
            py: 4
          }}
        >
          {/* Cabeçalho com contexto */}
          <Fade in={true} timeout={500}>
            <Box sx={{ mb: 4, width: '100%' }}>
              <Box sx={{
                mb: 3,
                textAlign: { xs: 'left', sm: 'center' },
                px: { xs: 2, sm: 0 }
              }}>
                {/* Layout inline para mobile, stacked para desktop */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  alignItems: { xs: 'center', sm: 'center' },
                  gap: { xs: 1.5, sm: 0 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 0, sm: 1 },
                      color: mode === 'dark' ? 'white' : 'black',
                      fontSize: { xs: '0.9rem', sm: '1.25rem' },
                      fontWeight: { xs: 'normal', sm: 'medium' },
                      whiteSpace: { xs: 'nowrap', sm: 'normal' }
                    }}
                  >
                    Intenção:
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 2 },
                    flexWrap: 'wrap'
                  }}>
                    <Chip
                      label={selectedSentiment.name}
                      variant="outlined"
                      sx={{
                        borderColor: sentimentColor,
                        color: sentimentColor,
                        fontWeight: 'bold',
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        height: { xs: '32px', sm: '40px' },
                        borderRadius: '20px',
                        borderWidth: '2px',
                        '& .MuiChip-label': {
                          px: { xs: 1.5, sm: 2 }
                        }
                      }}
                      size="medium"
                    />
                    <Chip
                      label={intentionLabel}
                      variant="outlined"
                      sx={{
                        borderColor: sentimentColor,
                        color: sentimentColor,
                        fontWeight: 'bold',
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        height: { xs: '32px', sm: '40px' },
                        borderRadius: '20px',
                        borderWidth: '2px',
                        '& .MuiChip-label': {
                          px: { xs: 1.5, sm: 2 }
                        }
                      }}
                      size="medium"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontSize: { xs: '0.95rem', sm: '1.4rem', md: '1.5rem' },
                  color: { xs: 'text.secondary', sm: 'text.primary' },
                  lineHeight: { xs: 1.3, sm: 1.3, md: 1.4 },
                  fontWeight: { xs: 'normal', sm: 'medium' },
                  mb: { xs: 1, sm: 3 }
                }}
              >
                {isMobile && step.mobileQuestion ? step.mobileQuestion : (step.customQuestion || step.question)}
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
                        {isMobile && option.mobileText ? option.mobileText : option.text} ({option.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Grid container spacing={{ xs: 2, sm: 2 }} sx={{ px: { xs: 1, sm: 0 } }}>
                  {step.options.map((option: JourneyOptionFlow) => (
                    <Grid item xs={12} sm={6} key={option.id}>
                      <Paper
                        sx={{
                          p: { xs: 2.5, sm: 3 }, // Padding um pouco maior
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
                          height: '100%', // Força altura igual em todos os cards da linha
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center', // Centraliza conteúdo verticalmente
                          minHeight: { xs: 'auto', sm: '140px' }, // Altura mínima consistente em desktop
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: { xs: 'none', sm: 'translateY(-2px)' },
                            boxShadow: { xs: 2, sm: 3 }
                          },
                          '&:active': {
                            transform: { xs: 'scale(0.98)', sm: 'translateY(-2px)' },
                          }
                        }}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <Typography variant="h6" sx={{
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                          mb: { xs: 1, sm: 1 }
                        }}>
                          {isMobile && option.mobileText ? option.mobileText : option.text}
                        </Typography>
                        {option.description && (
                          <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.9rem', sm: '0.875rem' },
                            lineHeight: { xs: 1.3, sm: 1.4 }
                          }}>
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

  // Debug apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('❌ Não renderizando - condições não atendidas:', {
      hasCurrentStep: !!currentStep,
      hasQuestion: !!currentStep?.question,
      hasOptions: !!currentStep?.options,
      currentStep
    });
  }

  return null;
};

export default PersonalizedJourney;

