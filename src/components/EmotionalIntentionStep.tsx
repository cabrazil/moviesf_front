import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Container, Button, Chip } from '@mui/material';
import { MainSentiment, EmotionalIntention, EmotionalIntentionsResponse, getEmotionalIntentions } from '../services/api';

interface EmotionalIntentionStepProps {
  selectedSentiment: MainSentiment;
  onIntentionSelect: (intention: EmotionalIntention) => void;
  onSkip: () => void;
  onBack: () => void;
}

const EmotionalIntentionStep: React.FC<EmotionalIntentionStepProps> = ({
  selectedSentiment,
  onIntentionSelect,
  onSkip,
  onBack
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intentions, setIntentions] = useState<EmotionalIntention[]>([]);

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

  const getIntentionColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' => {
    const colors = {
      'PROCESS': 'primary' as const,
      'TRANSFORM': 'secondary' as const,
      'MAINTAIN': 'success' as const,
      'EXPLORE': 'warning' as const
    };
    return colors[type as keyof typeof colors] || 'primary';
  };

  const getIntentionIcon = (type: string): string => {
    const icons = {
      'PROCESS': '🧠',
      'TRANSFORM': '🔄',
      'MAINTAIN': '⚖️',
      'EXPLORE': '🔍'
    };
    return icons[type as keyof typeof icons] || '💭';
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
        
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Sentimento selecionado:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {selectedSentiment.name}
          </Typography>
          {selectedSentiment.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedSentiment.description}
            </Typography>
          )}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Escolha sua intenção emocional:
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: '1000px' }}>
          {intentions.map((intention) => (
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
                  <Typography variant="h4" sx={{ mr: 2 }}>
                    {getIntentionIcon(intention.type)}
                  </Typography>
                  <Box>
                    <Chip 
                      label={getIntentionLabel(intention.type)}
                      color={getIntentionColor(intention.type)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {getIntentionLabel(intention.type)}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                  {intention.description}
                </Typography>
                
                {intention.preferredGenres.length > 0 && (
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
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ px: 4, py: 1.5 }}
          >
            Voltar
          </Button>
          <Button
            variant="text"
            onClick={() => onIntentionSelect({ 
              id: 0, 
              type: 'EXPLORE', 
              description: 'Usar jornada tradicional', 
              preferredGenres: [], 
              avoidGenres: [], 
              emotionalTone: 'similar' 
            })}
            sx={{ px: 4, py: 1.5 }}
          >
            Pular (Jornada Tradicional)
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmotionalIntentionStep; 