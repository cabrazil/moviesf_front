import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container, Button, Chip } from '@mui/material';
import { MainSentiment, EmotionalIntention, getEmotionalIntentions } from '../services/api';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import IntentionIcon from './IntentionIcon';

interface EmotionalIntentionStepProps {
  selectedSentiment: MainSentiment;
  onIntentionSelect: (intention: EmotionalIntention) => void;
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

  // Cache para intenções emocionais
  const [intentionsCache, setIntentionsCache] = useState<Map<number, EmotionalIntention[]>>(new Map());

  // Flag para evitar requisições duplicadas
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(false);

  useEffect(() => {
    const loadIntentions = async () => {
      // Evitar requisições duplicadas
      if (isLoadingIntentions) {
        console.log('⏳ Intenções já estão sendo carregadas, ignorando requisição duplicada');
        return;
      }

      try {
        // Verificar cache primeiro
        console.log('🔍 Verificando cache de intenções para sentimento ID:', selectedSentiment.id);

        if (intentionsCache.has(selectedSentiment.id)) {
          console.log('✅ Intenções encontradas no cache, carregando...');
          const cachedIntentions = intentionsCache.get(selectedSentiment.id)!;
          setIntentions(cachedIntentions);
          setLoading(false);
          console.log('✅ Intenções carregadas do cache com sucesso');
          return;
        }

        console.log('🔄 Cache não encontrado, carregando da API...');
        setIsLoadingIntentions(true);
        const data = await getEmotionalIntentions(selectedSentiment.id);

        // Validar dados recebidos
        if (!data || !data.intentions || !Array.isArray(data.intentions)) {
          throw new Error('Dados de intenções inválidos recebidos da API');
        }

        // Salvar no cache
        setIntentionsCache(prev => {
          const newCache = new Map(prev);
          newCache.set(selectedSentiment.id, data.intentions);
          console.log('💾 Intenções salvas no cache para sentimento ID:', selectedSentiment.id);
          return newCache;
        });

        setIntentions(data.intentions);
        setLoading(false);
        setIsLoadingIntentions(false);
        console.log('✅ Intenções carregadas da API com sucesso');
      } catch (error) {
        console.error('❌ Erro ao carregar intenções:', error);
        setError('Erro ao carregar as intenções emocionais. Por favor, tente novamente mais tarde.');
        setLoading(false);
        setIsLoadingIntentions(false);
      }
    };

    loadIntentions();
  }, [selectedSentiment.id, intentionsCache, isLoadingIntentions]);

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

  const handleRetry = () => {
    console.log('🔄 Tentando recarregar intenções...');
    setError(null);
    setLoading(true);
    setIsLoadingIntentions(false); // Reset da flag para permitir nova requisição

    // Limpar cache para forçar nova requisição
    setIntentionsCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(selectedSentiment.id);
      console.log('🗑️ Cache de intenções limpo para sentimento ID:', selectedSentiment.id);
      return newCache;
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
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
        <Typography variant="h4" gutterBottom sx={{
          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
          lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
        }}>
          O que você gostaria de fazer com esse sentimento?
        </Typography>

        <Box sx={{ mb: 3, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
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

        <Typography variant="h6" color="text.secondary" sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          Escolha sua intenção:
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ maxWidth: '1000px', px: { xs: 1, sm: 0 } }}>
          {intentions
            .sort((a, b) => {
              // Definir ordem específica para as intenções: Manter, Processar, Transformar, Explorar
              const order = ['MAINTAIN', 'PROCESS', 'TRANSFORM', 'EXPLORE'];
              const indexA = order.indexOf(a.type);
              const indexB = order.indexOf(b.type);
              // Se não encontrar na ordem, colocar no final
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            })
            .map((intention) => (
              <Grid item xs={6} sm={6} key={intention.id}>
                <Paper
                  sx={{
                    p: { xs: 1.5, sm: 3 },
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'flex-start' }, // Centralizar no mobile
                    textAlign: { xs: 'center', sm: 'left' },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    transition: 'all 0.3s ease',
                    minHeight: { xs: '140px', sm: 'auto' },
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: { xs: 'none', sm: 'translateY(-2px)' },
                      boxShadow: { xs: 2, sm: 3 }
                    },
                    '&:active': {
                      transform: { xs: 'scale(0.98)', sm: 'translateY(-2px)' },
                    }
                  }}
                  onClick={() => onIntentionSelect(intention)}
                >
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    mb: { xs: 1, sm: 2 },
                    width: '100%'
                  }}>
                    <Box sx={{
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 },
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <IntentionIcon intentionType={intention.type} size={32} />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.95rem', sm: '1.25rem' }
                      }}>
                        {getIntentionLabel(intention.type)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{
                    mb: { xs: 0, sm: 2 },
                    flexGrow: 1,
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    lineHeight: { xs: 1.2, sm: 1.4 },
                    display: { xs: '-webkit-box', sm: 'block' },
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: { xs: 4, sm: 'none' } // Limitar linhas no mobile
                  }}>
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