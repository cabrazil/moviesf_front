import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container, Chip, Stack, Divider } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { Movie as MovieIcon, CalendarMonth, Person, SmartDisplay, PlayCircle } from '@mui/icons-material';

const MovieSuggestionsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (movieId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [movieId]: !prev[movieId]
    }));
  };

  const truncateDescription = (description: string, maxLength: number = 150): string => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    
    // Encontrar o último espaço antes do limite
    const lastSpace = description.substring(0, maxLength).lastIndexOf(' ');
    return description.substring(0, lastSpace) + '...';
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
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
          py: 4,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Filmes sugeridos para você
        </Typography>
        <Stack spacing={3} sx={{ width: '100%' }}>
          {movieSuggestions.map((suggestion) => {
            const isExpanded = expandedDescriptions[suggestion.movie.id] || false;
            const description = suggestion.movie.description || '';
            const displayDescription = isExpanded ? description : truncateDescription(description);

            return (
            <Paper 
              key={suggestion.movie.id}
              elevation={3}
              sx={{ 
                p: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                {suggestion.movie.thumbnail && (
                  <Box sx={{ flexShrink: 0 }}>
                    <img 
                      src={suggestion.movie.thumbnail} 
                      alt={suggestion.movie.title}
                      style={{
                        width: '150px',
                        height: 'auto',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5">
                      {suggestion.movie.title}
                    </Typography>
                    {suggestion.movie.year && (
                      <Chip 
                        icon={<CalendarMonth />} 
                        label={suggestion.movie.year} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  {suggestion.movie.original_title && (
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ fontStyle: 'italic', mb: 0.5 }}
                    >
                      {suggestion.movie.original_title}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1}>
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

                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                      {displayDescription}
                      {description.length > 150 && (
                        <Button
                          onClick={() => toggleDescription(suggestion.movie.id)}
                          sx={{ 
                            ml: 1,
                            p: 0,
                            minWidth: 'auto',
                            textTransform: 'none',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {isExpanded ? 'Mostrar menos' : 'Leia mais...'}
                        </Button>
                      )}
                  </Typography>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Gêneros:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {suggestion.movie.genres?.map((genre) => (
                        <Chip 
                          key={genre} 
                          label={genre} 
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>

                  {suggestion.movie.streamingPlatforms && suggestion.movie.streamingPlatforms.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Disponível em:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {suggestion.movie.streamingPlatforms.map((platform) => (
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
                              '& .MuiChip-label': { 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 0.5
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" color="primary">
                    {suggestion.reason}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            );
          })}
        </Stack>
        <Button
          variant="contained"
          onClick={handleRestart}
          sx={{ mt: 4 }}
        >
          Voltar ao Início
        </Button>
      </Box>
    </Container>
  );
};

export default MovieSuggestionsPage; 