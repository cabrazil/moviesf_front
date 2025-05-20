import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { CalendarMonth, Person, PlayCircle } from '@mui/icons-material';

const MovieSuggestionsPageMinimal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];

  // Ordenar sugestões por título
  const sortedSuggestions = useMemo(() => {
    return [...movieSuggestions].sort((a, b) => 
      a.movie.title.localeCompare(b.movie.title, 'pt-BR')
    );
  }, [movieSuggestions]);

  const handleRestart = () => {
    navigate('/');
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

  if (!movieSuggestions.length) {
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80vh',
          py: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Filmes sugeridos para você
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRestart}
          >
            Voltar ao Início
          </Button>
        </Box>

        <Stack spacing={2}>
          {sortedSuggestions.map((suggestion) => (
            <Paper 
              key={suggestion.movie.id}
              elevation={1}
              sx={{ 
                p: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {suggestion.movie.thumbnail && (
                  <Box sx={{ flexShrink: 0 }}>
                    <img 
                      src={suggestion.movie.thumbnail} 
                      alt={suggestion.movie.title}
                      style={{
                        width: '80px',
                        height: '120px',
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" noWrap>
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
                      variant="subtitle2" 
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                      noWrap
                    >
                      {suggestion.movie.original_title}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {suggestion.movie.director && (
                      <Chip 
                        icon={<Person />} 
                        label={suggestion.movie.director} 
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {suggestion.movie.genres?.map((genre) => (
                      <Chip 
                        key={genre} 
                        label={genre} 
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  {suggestion.movie.streamingPlatforms && suggestion.movie.streamingPlatforms.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      {suggestion.movie.streamingPlatforms.map((platform) => (
                        <Tooltip key={platform} title={platform}>
                          <Chip 
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
                        </Tooltip>
                      ))}
                    </Box>
                  )}

                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    {suggestion.reason}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default MovieSuggestionsPageMinimal; 