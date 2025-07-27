import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Fade
} from '@mui/material';
import { PlayArrow as PlayIcon, Star as StarIcon } from '@mui/icons-material';
import { Movie } from '../types';
import { recordFeedback, completeSession, startEmotionalRecommendation } from '../services/api';
import { MainSentiment, EmotionalIntention } from '../services/api';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';

interface EmotionalRecommendation {
  movieId: string;
  movie: Movie;
  personalizedReason: string;
  relevanceScore: number;
  intentionAlignment: number;
}

interface EmotionalRecommendationsProps {
  selectedSentiment: MainSentiment;
  selectedIntention: EmotionalIntention;
  onBack: () => void;
  onRestart: () => void;
}

const EmotionalRecommendations: React.FC<EmotionalRecommendationsProps> = ({
  selectedSentiment,
  selectedIntention,
  onBack,
  onRestart
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<EmotionalRecommendation[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const response = await startEmotionalRecommendation({
          mainSentimentId: selectedSentiment.id,
          intentionType: selectedIntention.type,
          contextData: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        });

        setRecommendations(response.data.recommendations);
        setSessionId(response.data.sessionId);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar recomendações:', error);
        setError('Erro ao carregar as recomendações. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedSentiment.id, selectedIntention.type]);

  const handleMovieClick = async (recommendation: EmotionalRecommendation) => {
    setSelectedMovie(recommendation.movie);
    setDialogOpen(true);

    // Registrar que o filme foi visualizado
    if (!feedbackGiven.has(recommendation.movieId)) {
      try {
        await recordFeedback(sessionId, recommendation.movieId, true, false);
        setFeedbackGiven(prev => new Set(prev).add(recommendation.movieId));
      } catch (error) {
        console.error('Erro ao registrar visualização:', error);
      }
    }
  };

  const handleMovieAccept = async (recommendation: EmotionalRecommendation) => {
    try {
      await recordFeedback(sessionId, recommendation.movieId, true, true, 'Filme aceito pelo usuário');
      setFeedbackGiven(prev => new Set(prev).add(recommendation.movieId));
      
      // Finalizar sessão
      await completeSession(sessionId);
      
      // Navegar para detalhes do filme ou página de sucesso
      navigate(`/filme/${recommendation.movie.id}`);
    } catch (error) {
      console.error('Erro ao aceitar filme:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMovie(null);
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
          <p className="text-gray-600">Gerando suas recomendações personalizadas...</p>
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Fade in={true} timeout={500}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                  color={getIntentionColor(selectedIntention.type)}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    height: '40px',
                    borderRadius: '20px',
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                  size="medium"
                />
              </Box>
            </Box>
            
            <Typography variant="h4" gutterBottom>
              Suas Recomendações Personalizadas
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Baseado no seu estado emocional atual e na sua intenção, selecionamos estes filmes especialmente para você.
            </Typography>
          </Box>
        </Fade>

        {/* Lista de Recomendações */}
        <Grid container spacing={3}>
          {recommendations.map((recommendation) => (
            <Grid item xs={12} sm={6} md={4} key={recommendation.movieId}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleMovieClick(recommendation)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={recommendation.movie.thumbnail || '/placeholder-movie.jpg'}
                  alt={recommendation.movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {recommendation.movie.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {recommendation.movie.year} • {recommendation.movie.director}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon sx={{ color: 'gold', fontSize: 16 }} />
                    <Typography variant="body2">
                      Compatibilidade: {Math.round(recommendation.intentionAlignment * 100)}%
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {recommendation.personalizedReason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Botões de Navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ px: 4, py: 1.5 }}
          >
            Alterar Intenção
          </Button>
          <Button
            variant="text"
            onClick={onRestart}
            sx={{ px: 4, py: 1.5 }}
          >
            Recomeçar
          </Button>
        </Box>

        {/* Dialog de Detalhes do Filme */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedMovie && (
            <>
              <DialogTitle>
                <Typography variant="h5">
                  {selectedMovie.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {selectedMovie.year} • {selectedMovie.director}
                </Typography>
              </DialogTitle>
              
              <DialogContent>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Box sx={{ flexShrink: 0 }}>
                    <img
                      src={selectedMovie.thumbnail || '/placeholder-movie.jpg'}
                      alt={selectedMovie.title}
                      style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" paragraph>
                      {selectedMovie.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Gêneros:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedMovie.genres.map((genre) => (
                          <Chip key={genre} label={genre} size="small" />
                        ))}
                      </Box>
                    </Box>
                    
                    {selectedMovie.runtime && (
                      <Typography variant="body2" color="text.secondary">
                        Duração: {selectedMovie.runtime} minutos
                      </Typography>
                    )}
                  </Box>
                </Box>
              </DialogContent>
              
              <DialogActions>
                <Button onClick={handleCloseDialog}>
                  Fechar
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => {
                    const recommendation = recommendations.find(r => r.movie.id === selectedMovie.id);
                    if (recommendation) {
                      handleMovieAccept(recommendation);
                    }
                  }}
                >
                  Escolher Este Filme
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default EmotionalRecommendations; 