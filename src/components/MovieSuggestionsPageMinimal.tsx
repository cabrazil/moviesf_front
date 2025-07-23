import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Stack, Chip, Tooltip, Grid, Card, CardContent } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { CalendarMonth, Person, PlayCircle, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useThemeManager } from '../contexts/ThemeContext';

const MovieSuggestionsPageMinimal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const journeyContext = location.state?.journeyContext;
  const [currentPage, setCurrentPage] = useState(0);
  const { mode } = useThemeManager();

  const MOVIES_PER_PAGE = 4;

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
    if (journeyContext) {
      // Voltar para /intro com o contexto da jornada para restaurar o estado
      navigate('/intro', { 
        state: { 
          restoreJourney: true,
          selectedSentiment: journeyContext.selectedSentiment,
          selectedIntention: journeyContext.selectedIntention,
          journeyType: journeyContext.journeyType
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

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'netflix':
        return '🎬';
      case 'amazon prime':
        return '🎥';
      case 'hbo max':
        return '📺';
      case 'disney+':
        return '🏰';
      default:
        return '🎞️';
    }
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
      <Box sx={{ minHeight: '80vh', py: 4 }}>
        {/* Cabeçalho Minimalista */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header com thumbnail e título */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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

                        {/* Gêneros compactos */}
                        {suggestion.movie.genres && suggestion.movie.genres.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
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

                        {/* Reason - Campo Principal */}
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
                            fontSize: '0.75rem'
                          }}
                        >
                          {reason}
                        </Typography>
                      </Box>
                    </Box>





                    {/* Plataformas de streaming */}
                    {suggestion.movie.streamingPlatforms && suggestion.movie.streamingPlatforms.length > 0 && (
                      <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {suggestion.movie.streamingPlatforms.slice(0, 3).map((platform: string) => (
                            <Chip 
                              key={platform} 
                              icon={<PlayCircle />}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <span>{getPlatformIcon(platform)}</span>
                                  <span>{platform}</span>
                                </Box>
                              }
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem',
                                height: '24px',
                                '& .MuiChip-label': { 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 0.5
                                }
                              }}
                            />
                          ))}
                          {suggestion.movie.streamingPlatforms.length > 3 && (
                            <Chip 
                              label={`+${suggestion.movie.streamingPlatforms.length - 3}`}
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '24px' }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
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