import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container, Button, Skeleton, Fade } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainSentiment, getMainSentiments, EmotionalIntention } from '../services/api';
import EmotionalIntentionStep from '../components/EmotionalIntentionStep';

import PersonalizedJourney from '../components/PersonalizedJourney';
import { useThemeManager } from '../contexts/ThemeContext';
import SentimentIcon from '../components/SentimentIcon';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes'; // Import sentimentColors

type JourneyStep = 'sentiment' | 'intention' | 'journey';

const JourneyIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sentiments, setSentiments] = useState<MainSentiment[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<MainSentiment | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<EmotionalIntention | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStep>('sentiment');
  const [loading, setLoading] = useState(true);

  const { selectSentimentTheme, resetToDefaultTheme, mode } = useThemeManager();

  useEffect(() => {
    const loadSentiments = async () => {
      try {
        console.log('🔄 JourneyIntro - Iniciando carregamento de sentimentos...');
        const data = await getMainSentiments();
        console.log('✅ JourneyIntro - Sentimentos carregados:', data.length, 'sentimentos');

        const sortedSentiments = data.sort((a, b) => a.id - b.id);
        setSentiments(sortedSentiments);

        // Verificar se está restaurando uma jornada
        const restoreState = location.state;
        console.log('🔍 JourneyIntro - Verificando state:', restoreState);

        // Validação robusta antes da restauração
        const isValidRestoreState = restoreState?.restoreJourney &&
          restoreState.selectedSentiment &&
          restoreState.selectedSentiment.id &&
          restoreState.selectedIntention &&
          restoreState.selectedIntention.id &&
          typeof restoreState.selectedSentiment.id === 'number' &&
          typeof restoreState.selectedIntention.id === 'number';

        if (isValidRestoreState) {
          console.log('🔄 Restaurando jornada com validação completa...', {
            sentimentId: restoreState.selectedSentiment.id,
            intentionId: restoreState.selectedIntention.id,
            sentimentName: restoreState.selectedSentiment.name,
            intentionType: restoreState.selectedIntention.type
          });

          // Configurar tema do sentimento
          console.log('🎨 Configurando tema para sentimento ID:', restoreState.selectedSentiment.id);
          selectSentimentTheme(restoreState.selectedSentiment.id);

          // Restaurar estados
          setSelectedSentiment(restoreState.selectedSentiment);
          if (restoreState.selectedIntention) {
            setSelectedIntention(restoreState.selectedIntention);
          }

          // Determinar tipo de jornada e ir para o step correto
          if (restoreState.journeyType === 'personalized' && restoreState.selectedIntention) {
            setCurrentStep('journey');
          }

          // Limpar o state para não restaurar novamente
          // navigate('/intro', { replace: true }); // REMOVIDO - estava causando perda de contexto
        } else if (restoreState?.restoreJourney) {
          console.log('⚠️ JourneyIntro - Tentativa de restauração com dados inválidos:', {
            hasRestoreJourney: !!restoreState.restoreJourney,
            hasSelectedSentiment: !!restoreState.selectedSentiment,
            hasSelectedIntention: !!restoreState.selectedIntention,
            sentimentId: restoreState.selectedSentiment?.id,
            intentionId: restoreState.selectedIntention?.id,
            sentimentIdType: typeof restoreState.selectedSentiment?.id,
            intentionIdType: typeof restoreState.selectedIntention?.id,
            fullState: restoreState
          });
          resetToDefaultTheme();
        } else {
          console.log('🔍 JourneyIntro - Nenhuma restauração necessária, resetando tema');
          resetToDefaultTheme();
        }
      } catch (error) {
        console.error('❌ Erro ao carregar sentimentos:', error);
        // Adicionar fallback para dispositivos móveis
        setSentiments([]);
      } finally {
        setLoading(false);
      }
    };

    loadSentiments();
  }, [resetToDefaultTheme, selectSentimentTheme, location.state, navigate]);

  const handleSentimentSelect = (sentiment: MainSentiment) => {
    selectSentimentTheme(sentiment.id);
    setSelectedSentiment(sentiment);
    setCurrentStep('intention');
  };

  const handleIntentionSelect = (intention: EmotionalIntention) => {
    setSelectedIntention(intention);
    setCurrentStep('journey');
  };



  const handleBackToSentiment = () => {
    console.log('🔄 handleBackToSentiment - Resetando para seleção de sentimento');
    setSelectedSentiment(null);
    setSelectedIntention(null);

    setCurrentStep('sentiment');
    resetToDefaultTheme();
  };

  const handleBackToIntention = () => {
    setSelectedIntention(null);

    setCurrentStep('intention');
  };

  const handleRestart = () => {
    console.log('🔄 handleRestart - Reiniciando jornada completamente');
    setSelectedSentiment(null);
    setSelectedIntention(null);

    setCurrentStep('sentiment');
    resetToDefaultTheme();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Skeleton
            variant="text"
            width="60%"
            height={60}
            sx={{ mx: 'auto', mb: 2 }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={32}
            sx={{ mx: 'auto' }}
          />
        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="70%" height={32} />
                </Box>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: 1 }} />
        </Box>
      </Container>
    );
  }

  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  if (currentStep === 'sentiment') {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Fade in={true} timeout={600}>
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{
              fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.75rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
              fontWeight: { xs: 'bold', sm: 'normal', md: 'normal' }
            }}>

              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                Como você está?
              </Box>
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                Como você está se sentindo hoje?
              </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 1, sm: 0 },
              mb: { xs: 2, sm: 4 } // Menos margem no mobile
            }}>
              Defina seu sentimento nesse momento.
            </Typography>
          </Box>
        </Fade>
        {sentiments.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 4, px: { xs: 1, sm: 0 } }}>
            {sentiments.map((sentiment, index) => (
              <Grid item xs={6} sm={6} md={4} key={sentiment.id}>
                <Fade in={true} timeout={800 + (index * 100)}>
                  <Paper
                    onClick={() => handleSentimentSelect(sentiment)}
                    sx={{
                      p: { xs: 2.0, sm: 3 },
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: `2px solid ${currentSentimentColors[sentiment.id as keyof typeof currentSentimentColors]}`,
                      minHeight: { xs: '150px', sm: '160px' }, // Altura fixa para alinhar
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'column' }, // Sempre coluna para consistência visual mobile-like
                      alignItems: { xs: 'center', sm: 'flex-start' }, // Centralizado no mobile
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      textAlign: { xs: 'center', sm: 'left' },
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                        boxShadow: { xs: 2, sm: 6 },
                      },
                      '&:active': {
                        transform: { xs: 'scale(0.98)', sm: 'translateY(-4px)' },
                      }
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      width: '100%'
                    }}>
                      <SentimentIcon sentimentId={sentiment.id} size={32} />
                      <Typography variant="h6" component="h2" sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        mt: { xs: 1, sm: 0 }
                      }}>
                        {sentiment.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.3, sm: 1.4 },
                      display: { xs: '-webkit-box', sm: 'block' },
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { xs: 4, sm: 'none' } // Limitar linhas no mobile
                    }}>
                      {sentiment.shortDescription}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Não foi possível carregar os sentimentos.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ px: 4, py: 1.5 }}
            >
              Tentar Novamente
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/app')}
            sx={{ px: 4, py: 1.5 }}
          >
            Voltar para Home
          </Button>
        </Box>
      </Container>
    );
  }

  // ... (rest of the component remains the same)
  if (currentStep === 'intention' && selectedSentiment) {
    return (
      <EmotionalIntentionStep
        selectedSentiment={selectedSentiment}
        onIntentionSelect={handleIntentionSelect}

        onBack={handleBackToSentiment}
      />
    );
  }

  if (currentStep === 'journey' && selectedSentiment && selectedIntention) {
    return (
      <PersonalizedJourney
        selectedSentiment={selectedSentiment}
        selectedIntention={selectedIntention}
        onBack={handleBackToIntention}
        onRestart={handleRestart}
      />
    );
  }



  return null;
};

export default JourneyIntro; 