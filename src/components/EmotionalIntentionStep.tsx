import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container, Button, Chip } from '@mui/material';
import { MainSentiment, EmotionalIntention, getEmotionalIntentions } from '../services/api';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import IntentionIcon from './IntentionIcon';

interface EmotionalIntentionStepProps {
  selectedSentiment: MainSentiment;
  onIntentionSelect: (intention: EmotionalIntention) => void;
  onSkip: () => void;
  onBack: () => void;
}

const EmotionalIntentionStep: React.FC<EmotionalIntentionStepProps> = ({
  selectedSentiment,
  onIntentionSelect,
  onBack
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intentions, setIntentions] = useState<EmotionalIntention[]>([]);
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  useEffect(() => {
    const loadIntentions = async () => {
      try {
        const data = await getEmotionalIntentions(selectedSentiment.id);
        setIntentions(data.intentions);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar intenções:', error);
        setError('Erro ao carregar as intenções emocionais. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadIntentions();
  }, [selectedSentiment.id]);

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
          <p className="text-gray-600">Carregando intenções emocionais...</p>
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
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <Typography variant="h4" gutterBottom>
          O que você gostaria de fazer com esse sentimento?
        </Typography>
        
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

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Escolha sua intenção emocional:
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: '1000px' }}>
          {intentions
            .sort((a, b) => {
              // Definir ordem específica para as intenções
              const order = ['PROCESS', 'TRANSFORM', 'MAINTAIN', 'EXPLORE'];
              const indexA = order.indexOf(a.type);
              const indexB = order.indexOf(b.type);
              return indexA - indexB;
            })
            .map((intention) => (
            <Grid item xs={12} sm={6} key={intention.id}>
              <Paper
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => onIntentionSelect(intention)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    <IntentionIcon intentionType={intention.type} size={32} />
                  </Box>
                  <Box>
                    {/* <Chip 
                      label={getIntentionLabel(intention.type)}
                      color={getIntentionColor(intention.type)}
                      size="small"
                      sx={{ mb: 1 }}
                    /> */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {getIntentionLabel(intention.type)}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                  {intention.description}
                </Typography>
                
                {/* {intention.preferredGenres.length > 0 && (
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Gêneros preferidos:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {intention.preferredGenres.slice(0, 3).map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {intention.preferredGenres.length > 3 && (
                        <Chip
                          label={`+${intention.preferredGenres.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                )} */}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ px: 4, py: 1.5 }}
          >
            Voltar para Sentimentos
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmotionalIntentionStep; 