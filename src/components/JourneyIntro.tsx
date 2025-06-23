import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Fade } from '@mui/material';
import { MainSentiment, getMainSentiments, EmotionalIntention } from '../services/api';
import EmotionalIntentionStep from './EmotionalIntentionStep';
import EmotionalRecommendations from './EmotionalRecommendations';
import PersonalizedJourney from './PersonalizedJourney';
import MovieJourney from './MovieJourney';

type JourneyStep = 'sentiment' | 'intention' | 'journey' | 'recommendations';

const JourneyIntro: React.FC = () => {
  const [sentiments, setSentiments] = useState<MainSentiment[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<MainSentiment | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<EmotionalIntention | null>(null);
  const [currentStep, setCurrentStep] = useState<JourneyStep>('sentiment');
  const [loading, setLoading] = useState(true);
  const [useTraditionalJourney, setUseTraditionalJourney] = useState(false);

  useEffect(() => {
    const loadSentiments = async () => {
      try {
        const data = await getMainSentiments();
        setSentiments(data);
      } catch (error) {
        console.error('Erro ao carregar sentimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSentiments();
  }, []);

  const handleSentimentSelect = (sentiment: MainSentiment) => {
    console.log('Sentimento selecionado:', sentiment);
    setSelectedSentiment(sentiment);
    setCurrentStep('intention');
  };

  const handleIntentionSelect = (intention: EmotionalIntention) => {
    console.log('Intenção selecionada:', intention);
    setSelectedIntention(intention);
    setCurrentStep('journey');
  };

  const handleSkipIntention = () => {
    console.log('Pulando para jornada tradicional');
    setUseTraditionalJourney(true);
    setCurrentStep('journey');
  };

  const handleStartRecommendations = () => {
    setCurrentStep('recommendations');
  };

  const handleBackToSentiment = () => {
    setSelectedSentiment(null);
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('sentiment');
  };

  const handleBackToIntention = () => {
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('intention');
  };

  const handleRestart = () => {
    setSelectedSentiment(null);
    setSelectedIntention(null);
    setUseTraditionalJourney(false);
    setCurrentStep('sentiment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando sentimentos...</p>
        </div>
      </div>
    );
  }

  // Etapa 1: Seleção de Sentimento
  if (currentStep === 'sentiment') {
    return (
      <Container maxWidth="lg">
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
          <Fade in={true} timeout={500}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" gutterBottom>
                Como você está se sentindo hoje?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
                Escolha o sentimento que melhor descreve seu estado emocional atual
              </Typography>
            </Box>
          </Fade>

          <Fade in={true} timeout={800}>
            <Grid container spacing={3} sx={{ maxWidth: 800 }}>
              {sentiments.map((sentiment) => (
                <Grid item xs={12} sm={6} md={4} key={sentiment.id}>
                  <Paper
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleSentimentSelect(sentiment)}
                  >
                    <Typography variant="h6" gutterBottom>
                      {sentiment.name}
                    </Typography>
                    {sentiment.description && (
                      <Typography variant="body2" color="text.secondary">
                        {sentiment.description}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Fade>
        </Box>
      </Container>
    );
  }

  // Etapa 2: Seleção de Intenção Emocional
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

  // Etapa 3: Jornada (Personalizada ou Tradicional)
  if (currentStep === 'journey' && selectedSentiment) {
    if (useTraditionalJourney || !selectedIntention) {
      // Jornada tradicional
      return (
        <MovieJourney
          selectedSentiment={selectedSentiment}
          onBack={handleBackToIntention}
          onRestart={handleRestart}
        />
      );
    } else {
      // Jornada personalizada baseada na intenção
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

  // Etapa 4: Recomendações Emocionais
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