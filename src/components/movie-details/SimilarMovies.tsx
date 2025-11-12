import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface SimilarMovie {
  id: string;
  title: string;
  year?: number;
  thumbnail?: string;
}

interface SimilarMoviesProps {
  similarMovies: SimilarMovie[];
}

const SimilarMovies: React.FC<SimilarMoviesProps> = React.memo(({ similarMovies }) => {
  const navigate = useNavigate();

  const handleMovieClick = useCallback((movieId: string) => {
    navigate(`/app/onde-assistir/${movieId}`);
  }, [navigate]);

  if (!similarMovies || similarMovies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Filmes Similares
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: 'repeat(3, 1fr)', 
          sm: 'repeat(4, 1fr)', 
          md: 'repeat(6, 1fr)' 
        }, 
        gap: 1.5,
        maxWidth: '100%'
      }}>
        {similarMovies.map((similarMovie) => (
          <Box
            key={similarMovie.id}
            onClick={() => handleMovieClick(similarMovie.id)}
            sx={{
              cursor: 'pointer',
              borderRadius: 1.5,
              overflow: 'hidden',
              boxShadow: 1,
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '120px',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              }
            }}
          >
            <Box sx={{ 
              height: 160, 
              bgcolor: 'grey.300',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '4px 4px 0 0'
            }}>
              {similarMovie.thumbnail ? (
                <LazyLoadImage
                  src={similarMovie.thumbnail}
                  alt={similarMovie.title}
                  effect="opacity"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px 4px 0 0'
                  }}
                  placeholder={
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      bgcolor: 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} />
                  }
                />
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.300',
                  color: 'grey.500'
                }}>
                  <Typography variant="caption">Sem imagem</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ 
              p: 0.8, 
              bgcolor: 'background.paper',
              borderRadius: '0 0 4px 4px'
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600,
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                mb: 0.2
              }}>
                {similarMovie.title}
              </Typography>
              {similarMovie.year && (
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem'
                }}>
                  {similarMovie.year}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.similarMovies.length === nextProps.similarMovies.length &&
    prevProps.similarMovies.every((movie, index) => 
      movie.id === nextProps.similarMovies[index]?.id
    )
  );
});

SimilarMovies.displayName = 'SimilarMovies';

export default SimilarMovies;

