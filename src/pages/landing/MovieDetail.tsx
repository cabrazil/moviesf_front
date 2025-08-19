import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Container, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
import { MovieMetaTags } from '../../components/landing/MetaTags';
import { StreamingPlatformsCompact } from '../../components/landing/StreamingPlatformsCompact';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useThemeManager } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import tmdbLogo from '../../assets/themoviedb.svg';
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
}

// interface SimilarMovie {
//   id: string;
//   title: string;
//   year?: number;
//   thumbnail?: string;
//   vote_average?: number;
//   platforms: Array<{
//     streamingPlatform: {
//       name: string;
//     };
//   }>;
//   movieSentiments: Array<{
//     mainSentiment: {
//       name: string;
//     };
//   }>;
// }

interface MovieDetailProps {
  slug?: string;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ slug: propSlug }) => {
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
  const [reason, setReason] = useState<string | null>(null);
  // const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trailer' | 'cast' | 'reviews' | 'similar'>('trailer');


  // Usar o slug da prop ou do parâmetro da URL
  const finalSlug = propSlug || identifier;



  useEffect(() => {
    console.log('🎬 MovieDetail - useEffect executado, finalSlug:', finalSlug);
    
    const fetchMovieData = async () => {
      if (!finalSlug) {
        console.log('❌ MovieDetail - Slug não encontrado, retornando');
        return;
      }
      
      try {
        setLoading(true);
        console.log('🔄 MovieDetail - Buscando dados reais para slug:', finalSlug);
        
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://moviesf-back.vercel.app' 
          : 'http://localhost:3000';
        
        // Usar a API específica para landing page
        const response = await fetch(`${baseURL}/api/movie/${finalSlug}/hero`);
        
        if (!response.ok) {
          throw new Error(`Filme não encontrado (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ MovieDetail - Dados reais carregados:', data);
        
        setMovie(data.movie);
        setSubscriptionPlatforms(data.subscriptionPlatforms || []);
        setRentalPurchasePlatforms(data.rentalPurchasePlatforms || []);
        setReason(data.reason);
        // setSimilarMovies([]); // Por enquanto vazio, depois implementamos
        setLoading(false);
      } catch (error) {
        console.error('❌ MovieDetail - Erro ao buscar dados reais:', error);
        
        // Fallback para dados mock se a API falhar
        console.log('🔄 MovieDetail - Usando dados mock como fallback');
        const mockMovie = {
          id: '1',
          title: 'A Caso do Lago',
          original_title: 'Sharp Objects',
          year: 2018,
          director: 'Reese Witherspoon',
          description: 'Uma investigadora retorna à sua cidade natal para resolver um caso de assassinato que pode estar relacionado a um crime não resolvido de 25 anos atrás.',
          thumbnail: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
          vote_average: 7.8,
          vote_count: 8900,
          runtime: 115,
          genres: ['Drama', 'Mistério', 'Suspense'],
          platforms: [
            {
              streamingPlatform: {
                name: 'HBO Max',
                category: 'streaming'
              },
              accessType: 'subscription'
            },
            {
              streamingPlatform: {
                name: 'Netflix',
                category: 'streaming'
              },
              accessType: 'subscription'
            },
            {
              streamingPlatform: {
                name: 'Amazon Prime',
                category: 'streaming'
              },
              accessType: 'rental'
            }
          ],
          movieSentiments: [
            {
              mainSentiment: {
                name: 'Mistério',
                description: 'Filmes que despertam curiosidade e suspense'
              },
              subSentiment: {
                name: 'Investigação',
                description: 'Histórias de descoberta e resolução'
              }
            },
            {
              mainSentiment: {
                name: 'Drama',
                description: 'Filmes com narrativas emocionais profundas'
              },
              subSentiment: {
                name: 'Suspense',
                description: 'Tensão e expectativa'
              }
            }
          ],
          movieSuggestionFlows: [
            {
              reason: 'Ideal para quem gosta de mistérios e investigações',
              relevance: 0.95,
              journeyOptionFlow: {
                text: 'Quero algo misterioso',
                journeyStepFlow: {
                  question: 'Que tipo de história você busca hoje?',
                  journeyFlow: {
                    mainSentiment: {
                      name: 'Mistério'
                    }
                  }
                }
              }
            }
          ]
        };
        
        setMovie(mockMovie);
        // setSimilarMovies([]);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [finalSlug]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
              emoFilms
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
              Filme não encontrado
            </Typography>
            <Button onClick={() => navigate('/')} variant="contained">
              Voltar para a página inicial
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }



  // const getAccessTypeColor = (accessType: string) => {
  //   switch (accessType) {
  //     case 'subscription':
  //       return 'bg-green-500';
  //     case 'rental':
  //       return 'bg-yellow-500';
  //     case 'purchase':
  //       return 'bg-blue-500';
  //     case 'free_with_ads':
  //       return 'bg-purple-500';
  //     default:
  //       return 'bg-gray-500';
  //   }
  // };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Meta tags dinâmicas para SEO */}
      {movie && (
        <MovieMetaTags 
          movie={movie}
          platforms={subscriptionPlatforms}
          rentalPurchasePlatforms={rentalPurchasePlatforms}
        />
      )}
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            emoFilms
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ color: 'text.primary' }}
            >
              Voltar
            </Button>
            <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 1, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Hero Section - Layout ajustado */}
        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'center',
              gap: { xs: 0, md: 6 },
              pt: 1,
              maxWidth: '100%',
            }}
          >
            {/* Poster e informações - Lado esquerdo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, flexShrink: 0 }}>
              {/* Poster */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Box
                  component="img"
                  src={movie.thumbnail || '/images/default-movie.jpg'}
                  alt={movie.title}
                  sx={{
                    width: { xs: 260, md: 320 },
                    height: { xs: 370, md: 460 },
                    borderRadius: 4,
                    objectFit: 'cover',
                    boxShadow: 3,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              {/* Seção 1: Dados de Rating */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: '#1976d2', 
                  fontWeight: 500,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}>
                  Rating
                </Typography>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RatingIcon src={tmdbLogo} alt="TMDB" size={16} />
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.vote_average).toFixed(1)}</Typography>
                    </Box>
                  )}
                  {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RatingIcon src={imdbLogo} alt="IMDb" size={14} />
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
                    </Box>
                  )}
                  {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RatingIcon src={rtLogo} alt="Rotten Tomatoes" size={14} />
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
                    </Box>
                  )}
                  {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RatingIcon src={metacriticLogo} alt="Metacritic" size={14} />
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Seção 2: Gêneros */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: '#1976d2', 
                  fontWeight: 500,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}>
                  Gêneros
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {movie.genres.map((genre, index) => (
                    <Chip 
                      key={index} 
                      label={genre} 
                      size="medium" 
                      sx={{ 
                        fontSize: { xs: '0.85rem', md: '0.9rem' }, 
                        height: 28,
                        '& .MuiChip-label': { px: 1.5 }
                      }} 
                    />
                  ))}
                </Stack>
              </Box>

              {/* Seção 3: Diretor */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: '#1976d2', 
                  fontWeight: 500,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}>
                  Diretor
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  {movie.director || 'Não informado'}
                </Typography>
              </Box>
            </Box>

            {/* Informações do filme - Lado direito */}
            <Box sx={{ 
              flex: 1, 
              minWidth: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              maxWidth: { xs: '100%', md: '100%' } 
            }}>
              {/* Título e ano - H1 */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: 1, 
                mb: 1, 
                justifyContent: { xs: 'center', md: 'flex-start' } 
              }}>
                <Typography variant="h1" component="h1" sx={{ 
                  fontWeight: 'bold', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.5rem', md: '2rem' }, 
                  lineHeight: 1.2,
                  color: 'text.primary'
                }}>
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Críticas e Guia Emocional | emoFilms
                </Typography>
              </Box>

              {/* Título original, duração e classificação */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  Título original: <span style={{ color: '#1976d2', fontWeight: 500 }}>
                    {movie.original_title && movie.original_title.trim() !== '' && movie.original_title !== movie.title 
                      ? movie.original_title 
                      : movie.title}
                  </span>
                </Typography>
                {movie.runtime && (
                  <>
                    <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                    </Typography>
                  </>
                )}
                {movie.certification && (
                  <>
                    <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                    <Tooltip title="Classificação etária" arrow>
                      <Chip label={movie.certification} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontSize: '0.85rem', height: 22 }} />
                    </Tooltip>
                  </>
                )}
              </Box>

              {/* Linha horizontal */}
              <Divider sx={{ borderColor: '#1976d2', opacity: 0.7, mb: 1.2, width: '100%' }} />

              {/* Onde Assistir Hoje? - H2 */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="h2" component="h2" sx={{ 
                  mb: 2, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600 
                }}>
                  Onde assistir hoje?
                </Typography>
                <StreamingPlatformsCompact 
                  subscriptionPlatforms={subscriptionPlatforms}
                  rentalPurchasePlatforms={rentalPurchasePlatforms}
                />
              </Box>



              {/* Por que assistir? - H2 */}
              <Box sx={{ mt: 1, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h2" component="h2" sx={{ 
                  mb: 0.5, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600 
                }}>
                  Por que assistir este filme?
                </Typography>
                <Paper elevation={0} sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1.5px solid #1976d240', 
                  fontStyle: 'italic', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem' 
                }}>
                  {reason || 'Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única que ressoa com diferentes estados emocionais. Sua narrativa envolvente e personagens profundos criam uma jornada que pode inspirar, consolar ou desafiar, dependendo do que você busca no momento.'}
                </Paper>
              </Box>

              {/* Para quem pode ser esse filme? - H2 */}
              <Box sx={{ mt: 1, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h2" component="h2" sx={{ 
                  mb: 0.5, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600 
                }}>
                  Para quem pode ser esse filme?
                </Typography>
                <Paper elevation={0} sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1.5px solid #1976d240', 
                  fontStyle: 'italic', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem' 
                }}>
                  A Emoção de assistir {movie.title}. Busco um filme para quebrar a calma... Para uma experiência mais intensa... mergulhe em um drama de guerra...
                </Paper>
              </Box>

              {/* CTA Grande - Após a seção "Para quem pode ser esse filme?" */}
              <Box sx={{ 
                mt: 1, 
                mb: 3, 
                width: '100%', 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-start' } 
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/')}
                  sx={{
                    bgcolor: '#1976d2',
                    color: 'white',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    py: 2,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#1565c0',
                      boxShadow: 4,
                    },
                    minWidth: { xs: '100%', md: 'auto' }
                  }}
                >
                  🎭 Quer o filme perfeito para seu momento/sentimento?
                </Button>
              </Box>

              {/* Sinopse - H2 */}
              {movie.description && (
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Typography variant="h2" component="h2" sx={{ 
                    mb: 1, 
                    color: '#1976d2', 
                    textAlign: { xs: 'center', md: 'left' }, 
                    fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                    fontWeight: 600 
                  }}>
                    Sinopse
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    lineHeight: 1.6,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}>
                    {movie.description}
                  </Typography>
                </Box>
              )}

              {/* Sistema de Tabs */}
              <Box sx={{ mt: 3, width: '100%' }}>
                {/* Tabs Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Stack direction="row" spacing={0}>
                    <Button
                      variant={activeTab === 'trailer' ? 'contained' : 'text'}
                      onClick={() => setActiveTab('trailer')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 0,
                        borderBottom: activeTab === 'trailer' ? '2px solid #1976d2' : 'none',
                        color: activeTab === 'trailer' ? '#1976d2' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      Trailer
                    </Button>
                    <Button
                      variant={activeTab === 'cast' ? 'contained' : 'text'}
                      onClick={() => setActiveTab('cast')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 0,
                        borderBottom: activeTab === 'cast' ? '2px solid #1976d2' : 'none',
                        color: activeTab === 'cast' ? '#1976d2' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      Elenco Principal
                    </Button>
                    <Button
                      variant={activeTab === 'reviews' ? 'contained' : 'text'}
                      onClick={() => setActiveTab('reviews')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 0,
                        borderBottom: activeTab === 'reviews' ? '2px solid #1976d2' : 'none',
                        color: activeTab === 'reviews' ? '#1976d2' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      Avaliações
                    </Button>
                    <Button
                      variant={activeTab === 'similar' ? 'contained' : 'text'}
                      onClick={() => setActiveTab('similar')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 0,
                        borderBottom: activeTab === 'similar' ? '2px solid #1976d2' : 'none',
                        color: activeTab === 'similar' ? '#1976d2' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      Filmes Similares
                    </Button>
                  </Stack>
                </Box>

                {/* Tab Content */}
                {activeTab === 'trailer' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Trailer Oficial
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 200, 
                      bgcolor: 'grey.300', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}>
                      <Typography variant="body2">
                        Trailer em breve...
                      </Typography>
                    </Box>
                  </Box>
                )}

                {activeTab === 'cast' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Elenco Principal
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Informações do elenco em breve...
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 2 
                    }}>
                      {[1, 2, 3, 4].map((item) => (
                        <Box key={item} sx={{ 
                          height: 120, 
                          bgcolor: 'grey.200', 
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Ator {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 'reviews' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Avaliações de Usuários
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Avaliações de usuários em breve...
                    </Typography>
                    <Stack spacing={2}>
                      {[1, 2, 3].map((item) => (
                        <Paper key={item} sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="body2" color="text.secondary">
                            "Avaliação {item} - Lorem ipsum dolor sit amet..."
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

                {activeTab === 'similar' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Filmes Similares
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Filmes similares em breve...
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: 2 
                    }}>
                      {[1, 2, 3, 4].map((item) => (
                        <Box key={item} sx={{ 
                          height: 150, 
                          bgcolor: 'grey.200', 
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Filme {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
