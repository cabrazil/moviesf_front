import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import tmdbLogo from '../../assets/themoviedb.png';
import imdbLogo from '../../assets/imdb.png';
import rtLogo from '../../assets/rottentomatoes.png';
import metacriticLogo from '../../assets/metascore.svg';

interface MovieRatingsProps {
  movie: any;
}

const RatingIcon: React.FC<{ src: string; alt: string; size?: number; colorFilter?: string }> = ({ 
  src, 
  alt, 
  size = 18, 
  colorFilter 
}) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ 
      width: size, 
      height: size, 
      objectFit: 'contain', 
      verticalAlign: 'middle', 
      marginRight: 2, 
      filter: colorFilter || undefined 
    }} 
  />
);

const MovieRatings: React.FC<MovieRatingsProps> = React.memo(({ movie }) => {
  const hasRatings = 
    (typeof (movie as any).vote_average !== 'undefined' && (movie as any).vote_average !== null) ||
    (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
    (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
    (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null);

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
      {/* TMDB */}
      {typeof (movie as any).vote_average !== 'undefined' && (movie as any).vote_average !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RatingIcon src={tmdbLogo} alt="TMDB" size={24} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
            {Number((movie as any).vote_average).toFixed(1)}
          </Typography>
        </Box>
      )}
      {/* IMDb */}
      {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RatingIcon src={imdbLogo} alt="IMDb" size={20} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
            {Number(movie.imdbRating).toFixed(1)}
          </Typography>
        </Box>
      )}
      {/* Rotten Tomatoes */}
      {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RatingIcon src={rtLogo} alt="Rotten Tomatoes" size={20} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
            {Number(movie.rottenTomatoesRating).toFixed(0)}%
          </Typography>
        </Box>
      )}
      {/* Metacritic */}
      {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RatingIcon src={metacriticLogo} alt="Metacritic" size={20} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
            {Number(movie.metacriticRating).toFixed(0)}
          </Typography>
        </Box>
      )}
      {/* Barra vertical de separação */}
      {hasRatings && (
        <Typography variant="caption" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
      )}
      {/* Duração */}
      {movie.runtime && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
            {movie.runtime} min
          </Typography>
        </Box>
      )}
      {/* Classificação */}
      {(movie as any).certification && (
        <Chip 
          label={(movie as any).certification} 
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
  );
}, (prevProps, nextProps) => {
  // Comparação customizada
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.movie.imdbRating === nextProps.movie.imdbRating &&
    prevProps.movie.runtime === nextProps.movie.runtime &&
    (prevProps.movie as any).vote_average === (nextProps.movie as any).vote_average &&
    prevProps.movie.rottenTomatoesRating === nextProps.movie.rottenTomatoesRating &&
    prevProps.movie.metacriticRating === nextProps.movie.metacriticRating &&
    (prevProps.movie as any).certification === (nextProps.movie as any).certification
  );
});

MovieRatings.displayName = 'MovieRatings';

export default MovieRatings;

