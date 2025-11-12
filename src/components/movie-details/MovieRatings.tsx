import React from 'react';
import { Box, Typography } from '@mui/material';
import tmdbLogo from '../../assets/themoviedb.png';
import imdbLogo from '../../assets/imdb.png';
import rtLogo from '../../assets/rottentomatoes.png';
import metacriticLogo from '../../assets/metascore.svg';

interface MovieRatingsProps {
  movie: {
    vote_average?: number | null;
    imdbRating?: number | null;
    rottenTomatoesRating?: number | null;
    metacriticRating?: number | null;
  };
  isMobile?: boolean;
}

const RatingIcon: React.FC<{ src: string; alt: string; size?: number }> = ({ src, alt, size = 20 }) => (
  <img src={src} alt={alt} style={{ width: size, height: size }} />
);

const MovieRatings: React.FC<MovieRatingsProps> = React.memo(({ movie, isMobile = false }) => {
  const hasRatings = 
    (typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
    (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
    (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
    (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null);

  if (!hasRatings) return null;

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMobile ? 'center' : 'flex-start', 
      width: '100%'
    }}>
      <Typography variant="body2" sx={{ 
        mb: 0.5, 
        color: '#1976d2', 
        fontWeight: 500,
        textAlign: isMobile ? 'center' : 'left',
        fontSize: isMobile ? '0.9rem' : '0.95rem'
      }}>
        Notas da Crítica:
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RatingIcon src={tmdbLogo} alt="TMDB" />
            <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {Number(movie.vote_average).toFixed(1)}
            </Typography>
          </Box>
        )}
        {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RatingIcon src={imdbLogo} alt="IMDB" />
            <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {Number(movie.imdbRating).toFixed(1)}
            </Typography>
          </Box>
        )}
        {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RatingIcon src={rtLogo} alt="Rotten Tomatoes" />
            <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {Number(movie.rottenTomatoesRating).toFixed(0)}%
            </Typography>
          </Box>
        )}
        {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RatingIcon src={metacriticLogo} alt="Metacritic" />
            <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {Number(movie.metacriticRating).toFixed(0)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.movie.vote_average === nextProps.movie.vote_average &&
    prevProps.movie.imdbRating === nextProps.movie.imdbRating &&
    prevProps.movie.rottenTomatoesRating === nextProps.movie.rottenTomatoesRating &&
    prevProps.movie.metacriticRating === nextProps.movie.metacriticRating &&
    prevProps.isMobile === nextProps.isMobile
  );
});

MovieRatings.displayName = 'MovieRatings';

export default MovieRatings;

