import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainSentiment, getMainSentiments, EmotionalIntention } from '../services/api';
import EmotionalIntentionStep from './EmotionalIntentionStep';
import EmotionalRecommendations from './EmotionalRecommendations';
import PersonalizedJourney from './PersonalizedJourney';
import MovieJourney from './MovieJourney';
import { useThemeManager } from '../contexts/ThemeContext';
import SentimentIcon from './SentimentIcon';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes'; // Import sentimentColors

type JourneyStep = 'sentiment' | 'intention' | 'journey' | 'recommendations';

const JourneyIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sentiments, setSentiments] = useState<MainSentiment[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<MainSentiment | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<EmotionalIntention | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStep>('sentiment');
  const [loading, setLoading] = useState(true);
  const [useTraditionalJourney, setUseTraditionalJourney] = useState(false);
  const { selectSentimentTheme, resetToDefaultTheme, mode } = useThemeManager();

  useEffect(() => {
    const loadSentiments = async () => {
      try {
        const data = await getMainSentiments();
        const sortedSentiments = data.sort((a, b) => a.id - b.id);
        setSentiments(sortedSentiments);
        
        // Verificar se está restaurando uma jornada
        const restoreState = location.state;
        console.log('🔍 JourneyIntro - Verificando state:', restoreState);
        
        if (restoreState?.restoreJourney && restoreState.selectedSentiment && restoreState.selectedSentiment.id) {
          console.log('🔄 Restaurando jornada...', restoreState);
          
          // Configurar tema do sentimento
          console.log('🎨 Configurando tema para sentimento ID:', restoreState.selectedSentiment.id);
          selectSentimentTheme(restoreState.selectedSentiment.id);
          
          // Restaurar estados
          setSelectedSentiment(restoreState.selectedSentiment);
          if (restoreState.selectedIntention) {
            setSelectedIntention(restoreState.selectedIntention);
          }
          
          // Determinar tipo de jornada e ir para o step correto
          if (restoreState.journeyType === 'traditional') {
            setUseTraditionalJourney(true);
            setCurrentStep('journey');
          } else if (restoreState.journeyType === 'personalized' && restoreState.selectedIntention) {
            setUseTraditionalJourney(false);
            setCurrentStep('journey');
          }
          
          // Limpar o state para não restaurar novamente
          // navigate('/intro', { replace: true }); // REMOVIDO - estava causando perda de contexto
        } else if (restoreState?.restoreJourney) {
          console.log('⚠️ JourneyIntro - Tentativa de restauração sem sentimento válido:', restoreState);
          resetToDefaultTheme();
        } else {
          console.log('🔍 JourneyIntro - Nenhuma restauração necessária, resetando tema');
          resetToDefaultTheme();
        }
      } catch (error) {
        console.error('Erro ao carregar sentimentos:', error);
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

  const handleSkipIntention = () => {
    setUseTraditionalJourney(true);
    setCurrentStep('journey');
  };

  const handleBackToSentiment = () => {
    console.log('🔄 handleBackToSentiment - Resetando para seleção de sentimento');
    setSelectedSentiment(null);
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('sentiment');
    resetToDefaultTheme();
  };

  const handleBackToIntention = () => {
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('intention');
  };

  const handleRestart = () => {
    console.log('🔄 handleRestart - Reiniciando jornada completamente');
    setSelectedSentiment(null);
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('sentiment');
    resetToDefaultTheme();
  };

  if (loading) {
    return <div>Carregando...</div>; // Simplified loader
  }

  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  if (currentStep === 'sentiment') {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>Como você está se sentindo hoje?</Typography>
          <Typography variant="h6" color="text.secondary">Escolha o sentimento que melhor descreve seu estado emocional.</Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {sentiments.map((sentiment) => (
            <Grid item xs={12} sm={6} md={4} key={sentiment.id}>
              <Paper
                onClick={() => handleSentimentSelect(sentiment)}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: `2px solid ${currentSentimentColors[sentiment.id as keyof typeof currentSentimentColors]}`, // Use specific sentiment color for border
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SentimentIcon sentimentId={sentiment.id} size={24} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {sentiment.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {sentiment.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
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
        onSkip={handleSkipIntention}
        onBack={handleBackToSentiment}
      />
    );
  }

  if (currentStep === 'journey' && selectedSentiment) {
    if (useTraditionalJourney || !selectedIntention) {
      return (
        <MovieJourney
          selectedSentiment={selectedSentiment}
          onBack={handleBackToIntention}
          onRestart={handleRestart}
        />
      );
    } else {
      return (
        <PersonalizedJourney
          selectedSentiment={selectedSentiment}
          selectedIntention={selectedIntention}
          onBack={handleBackToIntention}
          onRestart={handleRestart}
        />
      );
    }
  }

  if (currentStep === 'recommendations' && selectedSentiment && selectedIntention) {
    return (
      <EmotionalRecommendations
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