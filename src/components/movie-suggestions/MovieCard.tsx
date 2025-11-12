import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography, Stack, Chip } from '@mui/material';
import { Person, Favorite, ChevronRight } from '@mui/icons-material';
import { MovieSuggestionFlow } from '../../services/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import MovieRatings from './MovieRatings';
import MoviePlatforms from './MoviePlatforms';
import { getSentimentColorWithOpacity } from './movieHelpers';

interface MovieCardProps {
  suggestion: MovieSuggestionFlow;
  journeyContext: any;
  streamingFilters: any;
  mode: 'light' | 'dark';
  sentimentColor: string;
}

const MovieCard: React.FC<MovieCardProps> = React.memo(({
  suggestion,
  journeyContext,
  streamingFilters,
  mode,
  sentimentColor
}) => {
  const navigate = useNavigate();
  const reason = suggestion.reason || '';
  const movie = suggestion.movie;

  const handleClick = useCallback(() => {
    navigate(`/onde-assistir/${movie.id}`, {
      state: {
        movie: movie,
        reason: suggestion.reason,
        sentimentId: journeyContext?.selectedSentiment?.id,
        intentionType: journeyContext?.selectedIntention?.type
      }
    });
  }, [navigate, movie, suggestion.reason, journeyContext]);

  // Memoizar plataformas processadas
  const platforms = useMemo(() => (movie as any).platforms || [], [movie]);

  // Memoizar gêneros limitados
  const limitedGenres = useMemo(() => 
    movie.genres?.slice(0, 3) || [],
    [movie.genres]
  );

  const sentimentColorWithOpacity = useMemo(() => 
    getSentimentColorWithOpacity(sentimentColor, '15'),
    [sentimentColor]
  );

  const sentimentColorBorder = useMemo(() => 
    getSentimentColorWithOpacity(sentimentColor, '40'),
    [sentimentColor]
  );

  return (
    <Card 
      elevation={3}
      onClick={handleClick}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header com thumbnail e título */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
          {movie.thumbnail && (
            <Box sx={{ flexShrink: 0 }}>
              <LazyLoadImage
                src={movie.thumbnail}
                alt={movie.title}
                effect="opacity"
                style={{
                  width: '90px',
                  height: '135px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
                placeholder={
                  <Box
                    sx={{
                      width: '90px',
                      height: '135px',
                      borderRadius: '8px',
                      bgcolor: 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Carregando...
                    </Typography>
                  </Box>
                }
              />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.75, lineHeight: 1.2, fontSize: '1rem' }}>
                {movie.title}
              </Typography>
              
              {/* Plataformas de Streaming */}
              <MoviePlatforms
                platforms={platforms}
                streamingFilters={streamingFilters}
                sentimentColor={sentimentColor}
                sentimentColorWithOpacity={sentimentColorWithOpacity}
                sentimentColorBorder={sentimentColorBorder}
              />
            </Box>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
              {movie.year && (
                <Chip 
                  label={movie.year} 
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
              {movie.director && (
                <Chip 
                  icon={<Person />} 
                  label={movie.director} 
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Stack>

            {/* Informações do filme: Ratings, Duração e Classificação */}
            <MovieRatings movie={movie} />

            {/* Gêneros compactos */}
            {movie.genres && movie.genres.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 0.75 }}>
                {limitedGenres.map((genre: string) => (
                  <Chip 
                    key={genre} 
                    label={genre} 
                    size="small"
                    color="default"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: '20px' }}
                  />
                ))}
                {movie.genres.length > 3 && (
                  <Chip 
                    label={`+${movie.genres.length - 3}`}
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
                gap: 0.5,
                p: 0.5,
                mt: 0.5,
                borderRadius: 1,
                backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${sentimentColorBorder}`,
                transition: 'all 0.2s ease'
              }}
            >
              <Favorite 
                sx={{ 
                  fontSize: 16, 
                  color: sentimentColor,
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
                  fontSize: 26,
                  color: sentimentColor,
                  mt: 0.2,
                  flexShrink: 0
                }} 
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  return (
    prevProps.suggestion.movie.id === nextProps.suggestion.movie.id &&
    prevProps.suggestion.reason === nextProps.suggestion.reason &&
    prevProps.mode === nextProps.mode &&
    prevProps.sentimentColor === nextProps.sentimentColor &&
    JSON.stringify(prevProps.streamingFilters) === JSON.stringify(nextProps.streamingFilters)
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

