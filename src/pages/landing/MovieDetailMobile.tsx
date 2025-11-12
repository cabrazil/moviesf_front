import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Container, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
import { MovieMetaTags } from '../../components/landing/MetaTags';
import { StreamingPlatformsMobile } from '../../components/landing/StreamingPlatformsMobile';
import OscarRecognition from '../../components/landing/OscarRecognition';
import { useThemeManager } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import tmdbLogo from '../../assets/themoviedb.png';
import imdbLogo from '../../assets/imdb.png';
import rtLogo from '../../assets/rottentomatoes.png';
import metacriticLogo from '../../assets/metascore.svg';

// Componente RatingIcon
const RatingIcon: React.FC<{ src: string; alt: string; size?: number }> = ({ src, alt, size = 20 }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: size,
      height: size,
      objectFit: 'contain'
    }}
  />
);

interface Movie {
  id: string;
  title: string;
  original_title?: string;
  year?: number;
  director?: string;
  description?: string;
  thumbnail?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  certification?: string;
  genres: string[];
  imdbRating?: number;
  rottenTomatoesRating?: number;
  metacriticRating?: number;
  landingPageHook?: string;
  contentWarnings?: string;
  targetAudienceForLP?: string;
  awardsSummary?: string;
  emotionalTags?: string[];
  mainCast?: Array<{
    actorName: string;
    characterName: string;
    order: number;
  }>;
  fullCast?: Array<{
    actorName: string;
    characterName: string;
    order: number;
  }>;
  mainTrailer?: {
    key: string;
    name: string;
    site: string;
    type: string;
    language: string;
    isMain: boolean;
  } | null;
  oscarAwards?: {
    wins: Array<{
      category: string;
      year: number;
      personName?: string;
    }>;
    nominations: Array<{
      category: string;
      year: number;
      personName?: string;
    }>;
    totalWins: number;
    totalNominations: number;
  } | null;
  platforms: Array<{
    streamingPlatform: {
      name: string;
      category: string;
    };
    accessType: string;
  }>;
  movieSentiments: Array<{
    mainSentiment: {
      name: string;
      description?: string;
    };
    subSentiment: {
      name: string;
      description?: string;
    };
  }>;
  movieSuggestionFlows: Array<{
    reason: string;
    relevance: number;
    journeyOptionFlow: {
      text: string;
      journeyStepFlow: {
        question: string;
        journeyFlow: {
          mainSentiment: {
            name: string;
          };
        };
      };
    };
  }>;
  quotes?: Array<{
    id: number;
    text: string;
    author: string | null;
    vehicle: string | null;
    url?: string | null;
  }>;
}

interface MovieDetailMobileProps {
  slug?: string;
}

// Função para extrair texto do landingPageHook
const extractHookText = (landingPageHook: string): string => {
  try {
    const trimmed = landingPageHook.trim();
    const jsonEndIndex = trimmed.lastIndexOf('}');
    
    if (jsonEndIndex === -1) {
      return landingPageHook; // Se não encontrar }, retorna o texto completo
    }
    
    const textAfterJson = trimmed.substring(jsonEndIndex + 1).trim();
    return textAfterJson.replace(/\s+/g, ' ').trim() || landingPageHook;
  } catch (error) {
    console.error('Erro ao extrair texto do landingPageHook:', error);
    return landingPageHook;
  }
};

// Função para formatar premiações
const formatAwardsForDisplay = (awardsSummary: string) => {
  const lines = awardsSummary.split('\n').filter(line => line.trim() !== '');
  const firstLine = lines[0] || '';
  const secondLine = lines[1] || '';
  
  return { firstLine, secondLine };
};

export const MovieDetailMobile: React.FC<MovieDetailMobileProps> = ({ slug: propSlug }) => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const { mode, toggleThemeMode } = useThemeManager();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [subscriptionPlatforms, setSubscriptionPlatforms] = useState<Array<{
    id: string;
    name: string;
    category: string;
    logoPath: string;
    hasFreeTrial: boolean;
    freeTrialDuration: string | null;
    baseUrl: string | null;
    accessType: string;
  }>>([]);
  const [rentalPurchasePlatforms, setRentalPurchasePlatforms] = useState<Array<{
    id: string;
    name: string;
    category: string;
    logoPath: string;
    hasFreeTrial: boolean;
    freeTrialDuration: string | null;
    baseUrl: string | null;
    accessType: string;
  }>>([]);
  const [similarMovies, setSimilarMovies] = useState<Array<{
    id: string;
    title: string;
    year?: number;
    thumbnail?: string;
    slug?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trailer' | 'cast' | 'reviews' | 'similar'>('similar');

  // Usar o slug da prop ou do parâmetro da URL
  const finalSlug = propSlug || identifier;

  useEffect(() => {
    console.log('🎬 MovieDetailMobile - useEffect executado, finalSlug:', finalSlug);
    
    const fetchMovieData = async () => {
      if (!finalSlug) {
        console.log('❌ MovieDetailMobile - Slug não encontrado, retornando');
        return;
      }
      
      try {
        setLoading(true);
        console.log('🔄 MovieDetailMobile - Buscando dados reais para slug:', finalSlug);
        
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://moviesf-back.vercel.app' 
          : 'http://localhost:3333';
        
        // Usar a API específica para landing page
        const response = await fetch(`${baseURL}/api/movie/${finalSlug}/hero`);
        
        if (!response.ok) {
          throw new Error(`Filme não encontrado (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ MovieDetailMobile - Dados reais carregados:', data);
        
        setMovie(data.movie);
        setSubscriptionPlatforms(data.subscriptionPlatforms || []);
        setRentalPurchasePlatforms(data.rentalPurchasePlatforms || []);
        setSimilarMovies(data.similarMovies || []);
        setLoading(false);
      } catch (error) {
        console.error('❌ MovieDetailMobile - Erro ao buscar dados reais:', error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [finalSlug]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Typography variant="h6" color="text.secondary">
          Carregando filme...
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Typography variant="h6" color="text.secondary">
          Filme não encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <MovieMetaTags 
        movie={movie} 
        platforms={subscriptionPlatforms}
        rentalPurchasePlatforms={rentalPurchasePlatforms}
      />
      
      {/* AppBar Mobile */}
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <Button
            onClick={() => navigate('/')}
            sx={{ 
              color: mode === 'dark' ? 'white' : 'black',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            ← vibesFilm
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{ 
                color: mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }} 
              onClick={toggleThemeMode}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="sm" 
        sx={{ 
          py: 2, 
          px: { xs: 1, sm: 2 },
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* 1. Título e Informações Básicas */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" sx={{ 
            fontWeight: 'bold', 
            fontSize: { xs: '1.2rem', sm: '1.4rem' }, 
            lineHeight: 1.2,
            color: 'text.primary',
            mb: 1,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          }}>
            {movie.title} {movie.year && `(${movie.year})`}: Onde assistir e Guia Emocional | vibesFilm
          </Typography>
          
          {/* Informações básicas */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            mb: 2,
            width: '100%',
            overflow: 'hidden'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              fontSize: '0.9rem',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              Título original: <span style={{ 
                color: '#1976d2', 
                fontWeight: 500,
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {movie.original_title && movie.original_title.trim() !== '' && movie.original_title !== movie.title 
                  ? movie.original_title 
                  : movie.title}
              </span>
            </Typography>
            {movie.runtime && (
              <>
                <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </Typography>
              </>
            )}
            {movie.certification && (
              <>
                <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                <Tooltip title="Classificação etária" arrow>
                  <Chip label={movie.certification} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontSize: '0.8rem', height: 20 }} />
                </Tooltip>
              </>
            )}
          </Box>
          
          <Divider sx={{ borderColor: '#1976d2', opacity: 0.7, mb: 2 }} />
        </Box>

        {/* 2. Call-to-Action Principal - Onde Assistir */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" component="h2" sx={{ 
            mb: 2, 
            color: '#1976d2', 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            fontWeight: 700 
          }}>
            Onde assistir hoje?
          </Typography>
          <StreamingPlatformsMobile 
            subscriptionPlatforms={subscriptionPlatforms}
            rentalPurchasePlatforms={rentalPurchasePlatforms}
          />
          
          {/* Disclaimers genéricos */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: mode === 'dark' ? 'text.secondary' : 'text.primary',
                fontSize: '0.7rem',
                opacity: mode === 'dark' ? 0.7 : 0.9,
                display: 'block',
                fontWeight: 600
              }}
            >
              * Os períodos e termos de teste grátis podem variar. Consulte a plataforma para detalhes atualizados.
            </Typography>
          </Box>
        </Box>

        {/* 3. Conteúdo de Engajamento */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" component="h2" sx={{ 
            mb: 1, 
            color: '#1976d2', 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            fontWeight: 700 
          }}>
            Por que assistir a este filme?
          </Typography>
          <Paper elevation={0} sx={{ 
            bgcolor: 'transparent', 
            color: 'text.secondary', 
            p: 1.5, 
            borderRadius: 2, 
            border: '1.5px solid #1976d240', 
            fontStyle: 'italic', 
            textAlign: 'center', 
            fontSize: '0.9rem' 
          }}>
            {movie?.landingPageHook ? extractHookText(movie.landingPageHook) : 'Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única que ressoa com diferentes estados emocionais. Sua narrativa envolvente e personagens profundos criam uma jornada que pode inspirar, consolar ou desafiar, dependendo do que você busca no momento.'}
            
            {/* Content Warnings dentro do box */}
            {movie?.contentWarnings && 
             movie.contentWarnings !== 'Atenção: nenhum alerta de conteúdo significativo.' && (
              <Box sx={{ mt: 1.5 }}>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    opacity: 0.8
                  }}
                >
                  {movie.contentWarnings}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* 4. Botão CTA Otimizado */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#FF6B35',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                bgcolor: '#FF8C00',
                boxShadow: 3,
              },
              minWidth: '100%'
            }}
          >
            Encontre filmes para sua Vibe!
          </Button>
        </Box>

        {/* 5. Para quem pode ser recomendado */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" component="h2" sx={{ 
            mb: 1, 
            color: '#1976d2', 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            fontWeight: 700 
          }}>
            Para quem pode ser recomendado este filme?
          </Typography>
          <Paper elevation={0} sx={{ 
            bgcolor: 'transparent', 
            color: 'text.secondary', 
            p: 1.5, 
            borderRadius: 2, 
            border: '1.5px solid #1976d240', 
            fontStyle: 'italic', 
            textAlign: 'center', 
            fontSize: '0.9rem' 
          }}>
            {movie?.targetAudienceForLP ? 
              movie.targetAudienceForLP :
              `Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única.`
            }
            
            {/* Tags Emocionais */}
            {movie?.emotionalTags && movie.emotionalTags.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    color: '#1976d2',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}
                >
                  Tags Emocionais Chave:
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {movie.emotionalTags.slice(0, 3).map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.75rem', 
                        height: 22,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        color: '#1976d2',
                        border: '1px solid rgba(25, 118, 210, 0.3)',
                        '& .MuiChip-label': { px: 0.8 }
                      }} 
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* 6. Informações Técnicas Compactas */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Poster pequeno */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={movie.thumbnail || '/images/default-movie.jpg'}
              alt={movie.title}
              sx={{
                width: 180,
                height: 250,
                borderRadius: 2,
                objectFit: 'cover',
                boxShadow: 2,
              }}
            />
          </Box>

          {/* Rating */}
          <Box>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              color: '#1976d2', 
              fontWeight: 500,
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              Rating
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ flexWrap: 'wrap' }}>
              {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RatingIcon src={tmdbLogo} alt="TMDB" size={14} />
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{Number(movie.vote_average).toFixed(1)}</Typography>
                </Box>
              )}
              {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RatingIcon src={imdbLogo} alt="IMDb" size={12} />
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
                </Box>
              )}
              {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RatingIcon src={rtLogo} alt="Rotten Tomatoes" size={12} />
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
                </Box>
              )}
              {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RatingIcon src={metacriticLogo} alt="Metacritic" size={12} />
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Gêneros */}
          <Box>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              color: '#1976d2', 
              fontWeight: 500,
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              Gêneros
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {movie.genres.map((genre, index) => (
                <Chip 
                  key={index} 
                  label={genre} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.8rem', 
                    height: 24,
                    '& .MuiChip-label': { px: 1.2 }
                  }} 
                />
              ))}
            </Stack>
          </Box>

          {/* Diretor */}
          <Box>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              color: '#1976d2', 
              fontWeight: 500,
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              Diretor
            </Typography>
            <Typography variant="body2" sx={{ 
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {movie.director || 'Não informado'}
            </Typography>
          </Box>

          {/* Elenco Principal (compacto) */}
          {movie.mainCast && movie.mainCast.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ 
                mb: 1, 
                color: '#1976d2', 
                fontWeight: 500,
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                Elenco Principal
              </Typography>
              <Stack spacing={0.5}>
                {movie.mainCast.slice(0, 3).map((actor, index) => (
                  <Typography key={index} variant="body2" sx={{ 
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    lineHeight: 1.4
                  }}>
                    <span style={{ fontWeight: 500, color: 'text.primary' }}>
                      {actor.actorName}
                    </span>
                    <span style={{ color: 'text.secondary', fontSize: '0.8em', fontStyle: 'italic' }}>
                      {' '}como {actor.characterName}
                    </span>
                  </Typography>
                ))}
                {movie.mainCast.length > 3 && (
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}>
                    +{movie.mainCast.length - 3} outros
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Premiações (compacto) */}
          {movie.oscarAwards ? (
            <OscarRecognition 
              movieTitle={movie.title}
              oscarAwards={movie.oscarAwards}
            />
          ) : movie.awardsSummary && movie.awardsSummary.trim() !== '' ? (
            <Box>
              <Typography variant="body2" sx={{ 
                mb: 1, 
                color: '#1976d2', 
                fontWeight: 500,
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                Premiações
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                {(() => {
                  const { firstLine, secondLine } = formatAwardsForDisplay(movie.awardsSummary!);
                  return (
                    <>
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        color: 'text.primary',
                        fontWeight: 500
                      }}>
                        {firstLine}
                      </Typography>
                      {secondLine && (
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.8rem',
                          lineHeight: 1.4,
                          color: 'text.secondary',
                          mt: 0.25
                        }}>
                          {secondLine}
                        </Typography>
                      )}
                    </>
                  );
                })()}
              </Box>
            </Box>
          ) : null}
        </Box>

        {/* 7. CTA Repetido */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#FF6B35',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                bgcolor: '#FF8C00',
                boxShadow: 3,
              },
              minWidth: '100%'
            }}
          >
            Descubra seu filme ideal agora
          </Button>
        </Box>

        {/* 8. Sinopse */}
        {movie.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h2" component="h2" sx={{ 
              mb: 1, 
              color: '#1976d2', 
              textAlign: 'center', 
              fontSize: '1.1rem', 
              fontWeight: 600 
            }}>
              Sinopse
            </Typography>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.6,
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {movie.description}
            </Typography>
          </Box>
        )}

        {/* 9. Sistema de Tabs */}
        <Box sx={{ mt: 3 }}>
          {/* Título da seção */}
          <Typography variant="h2" component="h2" sx={{ 
            mb: 1.5, 
            color: '#1976d2', 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            fontWeight: 700 
          }}>
            Mais sobre "{movie?.title}"
          </Typography>
          
          {/* Tabs Navigation */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: mode === 'dark' ? 'divider' : 'rgba(0,0,0,0.3)', 
            mb: 1 
          }}>
            <Stack direction="row" spacing={0}>
              <Button
                variant="text"
                onClick={() => setActiveTab('trailer')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 0,
                  borderBottom: activeTab === 'trailer' ? '2px solid #1976d2' : 'none',
                  color: activeTab === 'trailer' ? '#1976d2' : 'text.secondary',
                  fontSize: '0.85rem',
                  bgcolor: 'transparent'
                }}
              >
                Trailer
              </Button>
              <Button
                variant="text"
                onClick={() => setActiveTab('cast')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 0,
                  borderBottom: activeTab === 'cast' ? '2px solid #1976d2' : 'none',
                  color: activeTab === 'cast' ? '#1976d2' : 'text.secondary',
                  fontSize: '0.85rem',
                  bgcolor: 'transparent'
                }}
              >
                Elenco
              </Button>
              <Button
                variant="text"
                onClick={() => setActiveTab('reviews')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 0,
                  borderBottom: activeTab === 'reviews' ? '2px solid #1976d2' : 'none',
                  color: activeTab === 'reviews' ? '#1976d2' : 'text.secondary',
                  fontSize: '0.85rem',
                  bgcolor: 'transparent'
                }}
              >
                Críticas
              </Button>
              <Button
                variant="text"
                onClick={() => setActiveTab('similar')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 0,
                  borderBottom: activeTab === 'similar' ? '2px solid #1976d2' : 'none',
                  color: activeTab === 'similar' ? '#1976d2' : 'text.secondary',
                  fontSize: '0.85rem',
                  bgcolor: 'transparent'
                }}
              >
                Similares
              </Button>
            </Stack>
          </Box>

          {/* Tab Content */}
          {activeTab === 'trailer' && (
            <Box sx={{ maxWidth: '100%' }}>
              <Typography variant="h3" component="h3" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Trailer Oficial
              </Typography>
              {movie.mainTrailer ? (
                <Box>
                  {/* Player do YouTube */}
                  <Box sx={{ 
                    width: '100%', 
                    height: 0, 
                    paddingBottom: '56.25%', 
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mx: 'auto'
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${movie.mainTrailer.key}`}
                      title={movie.mainTrailer.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Trailer não disponível no momento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'cast' && (
            <Box>
              <Typography variant="h3" component="h3" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Elenco Completo
              </Typography>
              {movie.fullCast && movie.fullCast.length > 0 ? (
                <Stack spacing={1}>
                  {movie.fullCast.map((actor, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                        {actor.actorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                        {actor.characterName}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Informações do elenco não disponíveis no momento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'reviews' && (
            <Box>
              <Typography variant="h3" component="h3" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                O que a Crítica diz?
              </Typography>
              {movie.quotes && movie.quotes.length > 0 ? (
                <Stack spacing={2}>
                  {movie.quotes.map((quote) => (
                    <Box key={quote.id} sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <blockquote style={{ 
                        margin: 0, 
                        fontStyle: 'italic', 
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        color: 'text.primary'
                      }}>
                        "{quote.text}"
                      </blockquote>
                      <Box sx={{ mt: 1, textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.8rem'
                        }}>
                          {quote.author && `— ${quote.author}`}
                          {quote.author && quote.vehicle && ', '}
                          {quote.url && quote.vehicle ? (
                            <a 
                              href={quote.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                color: '#1976d2', 
                                textDecoration: 'none',
                                fontWeight: 500
                              }}
                            >
                              {quote.vehicle}
                            </a>
                          ) : quote.vehicle}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma crítica encontrada no momento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'similar' && (
            <Box>
              <Typography variant="h3" component="h3" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Filmes que despertam a mesma Emoção
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontStyle: 'italic',
                display: 'block',
                mb: 1.5,
                textAlign: 'center'
              }}>
                (apenas para referência)
              </Typography>
              {similarMovies && similarMovies.length > 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1.5 
                }}>
                  {similarMovies.map((similarMovie) => (
                    <Box 
                      key={similarMovie.id} 
                      sx={{ 
                        cursor: 'default',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        '&:hover': { 
                          transform: 'none',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={similarMovie.thumbnail ? similarMovie.thumbnail.replace('/w500/', '/w96/') : '/images/default-movie.jpg'}
                        alt={similarMovie.title}
                        sx={{
                          width: 60,
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 1,
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.9rem',
                          lineHeight: 1.2,
                          mb: 0.5
                        }}>
                          {similarMovie.title}
                        </Typography>
                        {similarMovie.year && (
                          <Typography variant="caption" sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.8rem'
                          }}>
                            {similarMovie.year}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum filme similar encontrado no momento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* 10. CTA Final no Rodapé */}
        <Box sx={{ mt: 4, mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#FF6B35',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                bgcolor: '#FF8C00',
                boxShadow: 3,
              },
              minWidth: '100%'
            }}
          >
            Experimente vibesFilm agora!
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
