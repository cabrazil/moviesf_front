import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container, Chip, Stack, Divider, Card, CardContent, IconButton } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { CalendarMonth, Person, PlayCircle, ExpandMore, ExpandLess } from '@mui/icons-material';

const MovieSuggestionsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [expandedReasons, setExpandedReasons] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (movieId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [movieId]: !prev[movieId]
    }));
  };

  const toggleReason = (movieId: string) => {
    setExpandedReasons(prev => ({
      ...prev,
      [movieId]: !prev[movieId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    // Encontrar o último espaço antes do limite
    const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
    return text.substring(0, lastSpace) + '...';
  };

  useEffect(() => {
    console.log('MovieSuggestionsPage - location.state:', location.state);
    console.log('MovieSuggestionsPage - movieSuggestions:', movieSuggestions);
    if (movieSuggestions.length > 0) {
      console.log('Primeiro filme:', movieSuggestions[0].movie);
      console.log('Campos do primeiro filme:', {
        title: movieSuggestions[0].movie.title,
        thumbnail: movieSuggestions[0].movie.thumbnail,
        original_title: movieSuggestions[0].movie.original_title
      });
    }
  }, [location.state, movieSuggestions]);

  const handleRestart = () => {
    navigate('/');
  };

  const handleRefineSearch = () => {
    navigate('/intro');
  };

  if (!movieSuggestions.length) {
    return (
      <Container maxWidth="md">
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '80vh', py: 4 }}>
        {/* Cabeçalho Contextual */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Sua Jornada Emocional Concluída
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Encontramos {movieSuggestions.length} {movieSuggestions.length === 1 ? 'filme perfeito' : 'filmes perfeitos'} para você
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Cada filme foi cuidadosamente selecionado baseado na sua jornada emocional específica
          </Typography>
        </Box>

        {/* Grid de Filmes */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {movieSuggestions.map((suggestion) => {
            const isDescriptionExpanded = expandedDescriptions[suggestion.movie.id] || false;
            const isReasonExpanded = expandedReasons[suggestion.movie.id] || false;
            const description = suggestion.movie.description || '';
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
                              width: '80px',
                              height: '120px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                          {suggestion.movie.title}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
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
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {suggestion.movie.genres.slice(0, 3).map((genre) => (
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
                      </Box>
                    </Box>

                    {/* Descrição compacta */}
                    {description && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {isDescriptionExpanded ? description : truncateText(description, 100)}
                          {description.length > 100 && (
                            <Button
                              onClick={() => toggleDescription(suggestion.movie.id)}
                              sx={{ 
                                ml: 0.5, p: 0, minWidth: 'auto', textTransform: 'none',
                                fontSize: '0.75rem', color: 'primary.main',
                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                              }}
                            >
                              {isDescriptionExpanded ? 'menos' : 'mais...'}
                            </Button>
                          )}
                        </Typography>
                      </Box>
                    )}

                    {/* Plataformas de streaming */}
                    {suggestion.movie.streamingPlatforms && suggestion.movie.streamingPlatforms.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {suggestion.movie.streamingPlatforms.slice(0, 2).map((platform) => (
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
                          {suggestion.movie.streamingPlatforms.length > 2 && (
                            <Chip 
                              label={`+${suggestion.movie.streamingPlatforms.length - 2}`}
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '24px' }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Divider */}
                    <Divider sx={{ mb: 2 }} />

                    {/* Reason - Destaque Principal */}
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          Por que este filme é perfeito para você:
                        </Typography>
                        {reason.length > 120 && (
                          <IconButton 
                            size="small" 
                            onClick={() => toggleReason(suggestion.movie.id)}
                            sx={{ color: 'primary.main' }}
                          >
                            {isReasonExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </Box>
                      
                      <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {isReasonExpanded ? reason : truncateText(reason, 120)}
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Navegação Melhorada */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleRefineSearch}
            sx={{ px: 4, py: 1.5 }}
          >
            Refinar Busca
          </Button>
          <Button
            variant="contained"
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

export default MovieSuggestionsPage; 