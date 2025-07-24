import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Stack, Chip, Tooltip, Grid, Card, CardContent } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { CalendarMonth, Person, ChevronLeft, ChevronRight, Star, AccessTime, Favorite } from '@mui/icons-material';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';

const MovieSuggestionsPageMinimal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const journeyContext = location.state?.journeyContext;
  const [currentPage, setCurrentPage] = useState(0);
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  // Debug inicial do componente
  console.log('🎬 MovieSuggestionsPageMinimal carregado:', {
    movieSuggestions: movieSuggestions.length,
    journeyContext,
    locationState: location.state,
    mode
  });

  // Salvar journeyContext no localStorage como backup
  useEffect(() => {
    if (journeyContext) {
      localStorage.setItem('journeyContext', JSON.stringify(journeyContext));
      console.log('💾 JourneyContext salvo no localStorage:', journeyContext);
    }
  }, [journeyContext]);

  const MOVIES_PER_PAGE = 4;

  // Função para obter a cor do sentimento atual
  const getSentimentColor = () => {
    console.log('🔍 Debug getSentimentColor:', {
      journeyContext,
      locationState: location.state,
      currentSentimentColors
    });
    
    // Verificar se temos o journeyContext com sentimento
    if (journeyContext?.selectedSentiment?.id) {
      const color = currentSentimentColors[journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
      console.log('🎨 Cor do sentimento (journeyContext):', color, 'ID:', journeyContext.selectedSentiment.id);
      return color;
    }
    
    // Verificar se temos o sentimento diretamente no state da localização
    const state = location.state;
    if (state?.sentimentId) {
      const color = currentSentimentColors[state.sentimentId as keyof typeof currentSentimentColors] || '#1976d2';
      console.log('🎨 Cor do sentimento (state.sentimentId):', color, 'ID:', state.sentimentId);
      return color;
    }
    
    // Verificar se temos o sentimento no journeyContext do state
    if (state?.journeyContext?.selectedSentiment?.id) {
      const color = currentSentimentColors[state.journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
      console.log('🎨 Cor do sentimento (state.journeyContext):', color, 'ID:', state.journeyContext.selectedSentiment.id);
      return color;
    }
    
    // Verificar se temos o sentimento no journeyContext do state (estrutura alternativa)
    if (state?.journeyContext?.selectedSentiment) {
      const sentimentId = state.journeyContext.selectedSentiment.id || state.journeyContext.selectedSentiment;
      const color = currentSentimentColors[sentimentId as keyof typeof currentSentimentColors] || '#1976d2';
      console.log('🎨 Cor do sentimento (state.journeyContext alt):', color, 'ID:', sentimentId);
      return color;
    }
    
    // Verificar localStorage como último recurso
    try {
      const savedContext = localStorage.getItem('journeyContext');
      if (savedContext) {
        const parsedContext = JSON.parse(savedContext);
        if (parsedContext?.selectedSentiment?.id) {
          const color = currentSentimentColors[parsedContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
          console.log('🎨 Cor do sentimento (localStorage):', color, 'ID:', parsedContext.selectedSentiment.id);
          return color;
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao ler journeyContext do localStorage:', error);
    }
    
    console.log('🎨 Cor do sentimento: padrão (#1976d2) - nenhum sentimento encontrado');
    return '#1976d2'; // Cor padrão se não houver sentimento
  };

  // Ordenar todas as sugestões e calcular paginação
  const { totalPages, displaySuggestions } = useMemo(() => {
    const sorted = [...movieSuggestions].sort((a, b) => a.movie.title.localeCompare(b.movie.title, 'pt-BR'));
    const total = Math.ceil(sorted.length / MOVIES_PER_PAGE);
    const start = currentPage * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;
    const display = sorted.slice(start, end);
    
    return {
      totalPages: total,
      displaySuggestions: display
    };
  }, [movieSuggestions, currentPage]);

  const handleRestart = () => {
    navigate('/');
  };

  const handleBack = () => {
    // Garantir que temos o contexto da jornada
    let contextToPass = journeyContext || location.state?.journeyContext;
    
    // Se não temos contexto, tentar recuperar do localStorage
    if (!contextToPass) {
      try {
        const savedContext = localStorage.getItem('journeyContext');
        if (savedContext) {
          contextToPass = JSON.parse(savedContext);
          console.log('🔄 Contexto recuperado do localStorage:', contextToPass);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao recuperar contexto do localStorage:', error);
      }
    }
    
    console.log('🔄 Navegando de volta...', {
      journeyContext,
      locationState: location.state,
      contextToPass
    });
    
    if (contextToPass) {
      // Voltar para /intro com o contexto da jornada para restaurar o estado
      navigate('/intro', { 
        state: { 
          restoreJourney: true,
          selectedSentiment: contextToPass.selectedSentiment,
          selectedIntention: contextToPass.selectedIntention,
          journeyType: contextToPass.journeyType
        } 
      });
    } else {
      // Fallback para /intro sem contexto
      navigate('/intro');
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const truncateText = (text: string, maxLength: number = 120): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
    return text.substring(0, lastSpace) + '...';
  };



  if (!displaySuggestions.length) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Nenhuma sugestão de filme encontrada.
          </Typography>
          <Button variant="contained" onClick={handleRestart} sx={{ mt: 4 }}>
            Voltar ao Início
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '80vh', py: 2 }}>
        {/* Cabeçalho Minimalista */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Filmes cuidadosamente sugeridos para você
          </Typography>
          {totalPages > 1 && (
            <Typography variant="body2" color="text.secondary">
              Página {currentPage + 1} de {totalPages} • {movieSuggestions.length} {movieSuggestions.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
            </Typography>
          )}
        </Box>

        {/* Grid de Filmes */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {displaySuggestions.map((suggestion) => {
            const reason = suggestion.reason || '';
            
            return (
              <Grid item xs={12} md={6} key={suggestion.movie.id}>
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header com thumbnail e título */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {suggestion.movie.thumbnail && (
                        <Box sx={{ flexShrink: 0 }}>
                          <img 
                            src={suggestion.movie.thumbnail} 
                            alt={suggestion.movie.title}
                            style={{
                              width: '90px',
                              height: '135px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, lineHeight: 1.2 }}>
                          {suggestion.movie.title}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                          {suggestion.movie.year && (
                            <Chip 
                              icon={<CalendarMonth />} 
                              label={suggestion.movie.year} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {suggestion.movie.director && (
                            <Chip 
                              icon={<Person />} 
                              label={suggestion.movie.director} 
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                        </Stack>

                        {/* Informações do filme: Rating, Duração e Classificação */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                          {(suggestion.movie as any).vote_average && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {Number((suggestion.movie as any).vote_average).toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                          {suggestion.movie.runtime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {suggestion.movie.runtime} min
                              </Typography>
                            </Box>
                          )}
                          {(suggestion.movie as any).certification && (
                            <Chip 
                              label={(suggestion.movie as any).certification} 
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: '20px',
                                backgroundColor: 'warning.light',
                                color: 'warning.contrastText',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Stack>

                        {/* Gêneros compactos */}
                        {suggestion.movie.genres && suggestion.movie.genres.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                            {suggestion.movie.genres.slice(0, 3).map((genre: string) => (
                              <Chip 
                                key={genre} 
                                label={genre} 
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                            ))}
                            {suggestion.movie.genres.length > 3 && (
                              <Chip 
                                label={`+${suggestion.movie.genres.length - 3}`}
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                            )}
                          </Stack>
                        )}

                        {/* Reason - Campo Principal com coração e seta */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1,
                            p: 1.5,
                            borderRadius: 1,
                            backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${getSentimentColor()}20`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                              borderColor: `${getSentimentColor()}40`,
                              transform: 'translateY(-1px)'
                            }
                          }}
                          onClick={() => {
                            navigate(`/filme/${suggestion.movie.id}`, {
                              state: {
                                movie: suggestion.movie,
                                reason: suggestion.reason,
                                sentimentId: journeyContext?.selectedSentiment?.id
                              }
                            });
                          }}
                        >
                          <Favorite 
                            sx={{ 
                              fontSize: 16, 
                              color: getSentimentColor(),
                              mt: 0.2,
                              flexShrink: 0
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '0.75rem',
                              flex: 1
                            }}
                          >
                            {reason}
                          </Typography>
                          <ChevronRight 
                            sx={{ 
                              fontSize: 26, // tamanho aumentado
                              color: getSentimentColor(),
                              mt: 0.2,
                              flexShrink: 0
                            }} 
                          />
                        </Box>
                      </Box>
                    </Box>


                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              startIcon={<ChevronLeft />}
              sx={{ px: 3, py: 1 }}
            >
              Anterior
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              {currentPage + 1} de {totalPages}
            </Typography>
            
            <Button
              variant="outlined"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              endIcon={<ChevronRight />}
              sx={{ px: 3, py: 1 }}
            >
              Próximo
            </Button>
          </Box>
        )}

        {/* Navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ px: 3, py: 1.5 }}
          >
            Voltar
          </Button>
          <Button
            variant="outlined"
            onClick={handleRestart}
            sx={{ px: 4, py: 1.5 }}
          >
            Nova Jornada
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default MovieSuggestionsPageMinimal; 