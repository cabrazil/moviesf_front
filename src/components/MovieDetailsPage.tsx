import React from 'react';
import { Box, Typography, Chip, Divider, Stack, Paper, Button } from '@mui/material';

import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import { useThemeManager } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import tmdbLogo from '../assets/themoviedb.svg';
import imdbLogo from '../assets/imdb.png';
import rtLogo from '../assets/rottentomatoes.png';
import metacriticLogo from '../assets/metascore.svg';

const MovieDetailsPage: React.FC = () => {
  const { mode } = useThemeManager();
  const location = useLocation();
  const state = location.state || {};
  const movie = state.movie;
  const reason = state.reason;
  const sentimentId = state.sentimentId;
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;
  const themeColor = currentSentimentColors[(sentimentId as keyof typeof currentSentimentColors)] || '#1976d2';

  // Verificar se os dados necessários estão disponíveis
  if (!movie || !reason || !sentimentId) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Dados do filme não encontrados.
        </Typography>
      </Box>
    );
  }

  // Componente de ícone para ratings
  const RatingIcon: React.FC<{ src: string; alt: string; size?: number }> = ({ src, alt, size = 20 }) => (
    <img src={src} alt={alt} style={{ width: size, height: size, objectFit: 'contain', verticalAlign: 'middle', marginRight: 2 }} />
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', pb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'center',
          gap: { xs: 0, md: 4 },
          px: { xs: 0, md: 2 }, // menos padding horizontal
          pt: 3,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Poster */}
        <Box
          component="img"
          src={movie.thumbnail}
          alt={movie.title}
          sx={{
            width: { xs: 240, md: 340 }, // imagem maior
            height: { xs: 340, md: 480 },
            borderRadius: 4,
            objectFit: 'cover',
            boxShadow: 3,
            mb: { xs: 3, md: 0 },
          }}
        />

        {/* Informações do filme */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, maxWidth: { xs: '100%', md: 700 } }}>
          {/* Título e infos principais */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1.3rem', md: '1.6rem' } }}>{movie.title}</Typography>
          <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.98rem', md: '1.08rem' }, letterSpacing: 1, textTransform: 'uppercase' }}>{movie.year}</Typography>
            {/* Ratings */}
            {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RatingIcon src={tmdbLogo} alt="TMDB" size={20} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.vote_average).toFixed(1)}</Typography>
              </Box>
            )}
            {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RatingIcon src={imdbLogo} alt="IMDb" size={18} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
              </Box>
            )}
            {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RatingIcon src={rtLogo} alt="Rotten Tomatoes" size={18} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
              </Box>
            )}
            {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RatingIcon src={metacriticLogo} alt="Metacritic" size={18} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
              </Box>
            )}
            {/* Barra vertical de separação */}
            {(typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
             (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
             (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
             (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null) ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
            ) : null}
            {/* Duração */}
            {movie.runtime && (
              <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{movie.runtime} min</Typography>
            )}
            {/* Classificação */}
            {movie.certification && (
              <Chip label={movie.certification} size="small" sx={{ bgcolor: themeColor, color: '#fff', fontSize: '0.85rem', height: 22 }} />
            )}
          </Stack>
          {movie.director && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2, textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '0.95rem', md: '1rem' } }}>
              Diretor: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.director}</span>
            </Typography>
          )}

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Gêneros */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#fff', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1rem', md: '1.1rem' } }}>Gêneros:</Typography>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              {movie.genres && movie.genres.map((genre: string) => (
                <Chip key={genre} label={genre} size="small" sx={{ borderColor: themeColor, color: themeColor, bgcolor: 'transparent', borderWidth: 1, borderStyle: 'solid', fontSize: '0.85rem', height: 22 }} />
              ))}
            </Stack>
          </Box>

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Motivo para assistir */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#fff', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1rem', md: '1.1rem' } }}>Por que assistir?</Typography>
            <Paper elevation={0} sx={{ bgcolor: mode === 'light' ? '#f5f5f5' : '#222', color: 'text.secondary', p: 1.5, borderRadius: 2, border: `1.5px solid ${themeColor}40`, fontStyle: 'italic', maxWidth: 700, textAlign: { xs: 'center', md: 'left' }, fontSize: '0.97rem' }}>
              {reason}
            </Paper>
          </Box>

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Sinopse */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#fff', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1rem', md: '1.1rem' } }}>Sinopse</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, textAlign: { xs: 'center', md: 'left' }, fontSize: '0.97rem', lineHeight: 1.5 }}>
              {movie.description || 'Sinopse não disponível.'}
            </Typography>
          </Box>

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Disponível em */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#fff', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1rem', md: '1.1rem' } }}>Disponível em:</Typography>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              {(movie.streamingPlatforms && movie.streamingPlatforms.length > 0)
                ? movie.streamingPlatforms.map((platform: string) => (
                    <Chip key={platform} label={platform} size="small" sx={{ borderColor: themeColor, color: themeColor, bgcolor: 'transparent', borderWidth: 1, borderStyle: 'solid', fontSize: '0.85rem', height: 22 }} />
                  ))
                : <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>Não disponível em streaming</Typography>
              }
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Barra de navegação fixa (botões padrão) */}
      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, bgcolor: 'background.paper', borderTop: `2px solid ${themeColor}`, py: 2, display: 'flex', justifyContent: 'center', gap: 2, zIndex: 10 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" sx={{ px: 4, borderWidth: 1 }} onClick={() => window.history.back()}>
            Filmes
          </Button>
          <Button variant="outlined" color="primary" sx={{ px: 4, borderWidth: 1 }} href="/">
            Home
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MovieDetailsPage; 