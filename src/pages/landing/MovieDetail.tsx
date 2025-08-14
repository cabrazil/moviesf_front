import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Container, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
    accessType: string;
  }>>([]);
  const [reason, setReason] = useState<string | null>(null);
  // const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'streaming' | 'emotional' | 'similar'>('streaming');

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
        const response = await fetch(`${baseURL}/api/public/filme/${finalSlug}`);
        
        if (!response.ok) {
          throw new Error(`Filme não encontrado (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ MovieDetail - Dados reais carregados:', data);
        
        setMovie(data.movie);
        // A API pública não retorna subscriptionPlatforms e reason, então usamos arrays vazios
        setSubscriptionPlatforms([]);
        setReason(null);
        // setSimilarMovies([]); // Por enquanto vazio, depois implementamos
        setLoading(false);
      } catch (error) {
        console.error('❌ MovieDetail - Erro ao buscar dados reais:', error);
        
        // Fallback para dados mock se a API falhar
        console.log('🔄 MovieDetail - Usando dados mock como fallback');
        const mockMovie = {
          id: '1',
          title: 'A Caso do Lago',
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

  const getAccessTypeLabel = (accessType: string) => {
    switch (accessType) {
      case 'subscription':
        return 'Incluído na assinatura';
      case 'rental':
        return 'Aluguel';
      case 'purchase':
        return 'Compra';
      case 'free_with_ads':
        return 'Gratuito com anúncios';
      default:
        return 'Disponível';
    }
  };

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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section - Layout ajustado */}
        <Box sx={{ mb: 6 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'center',
              gap: { xs: 0, md: 4 },
              px: { xs: 0, md: 2 },
              pt: 3,
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {/* Poster - Lado esquerdo, menor */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box
                component="img"
                src={movie.thumbnail || '/images/default-movie.jpg'}
                alt={movie.title}
                sx={{
                  width: { xs: 240, md: 280 },
                  height: { xs: 340, md: 400 },
                  borderRadius: 4,
                  objectFit: 'cover',
                  boxShadow: 3,
                  mb: { xs: 3, md: 0 },
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

            {/* Informações do filme - Lado direito */}
            <Box sx={{ 
              flex: 1, 
              minWidth: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              maxWidth: { xs: '100%', md: 700 } 
            }}>
              {/* Título e ano */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: 1, 
                mb: 1, 
                justifyContent: { xs: 'center', md: 'flex-start' } 
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.3rem', md: '1.6rem' }, 
                  lineHeight: 1.2 
                }}>
                  {movie.title}
                </Typography>
                {movie.year && (
                  <Chip 
                    label={movie.year} 
                    size="small" 
                    sx={{ 
                      borderColor: '#1976d2', 
                      color: '#1976d2', 
                      bgcolor: 'transparent', 
                      borderWidth: 1, 
                      borderStyle: 'solid', 
                      fontSize: '0.85rem', 
                      height: 22,
                      alignSelf: 'flex-start',
                      mt: 0.5
                    }} 
                  />
                )}
              </Box>

              {/* Ratings */}
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ mb: 1 }}>
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
                  <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}></Typography>
                ) : null}
              </Stack>

              {/* Gêneros */}
              <Stack direction="row" spacing={1} sx={{ mb: 1.2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {movie.genres.map((genre, index) => (
                  <Chip key={index} label={genre} size="small" />
                ))}
              </Stack>

              {/* Diretor, duração e classificação */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                {movie.director && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      Diretor: <span style={{ color: '#1976d2', fontWeight: 500 }}>{movie.director}</span>
                    </Typography>
                    {(movie.runtime || movie.certification) && (
                      <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                    )}
                  </>
                )}
                {movie.runtime && (
                  <>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                    </Typography>
                    {movie.certification && (
                      <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                    )}
                  </>
                )}
                {movie.certification && (
                  <Tooltip title="Classificação etária" arrow>
                    <Chip label={movie.certification} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontSize: '0.85rem', height: 22 }} />
                  </Tooltip>
                )}
              </Box>

              {/* Linha horizontal */}
              <Divider sx={{ borderColor: '#1976d2', opacity: 0.7, mb: 1.2, width: '100%' }} />

              {/* Descrição */}
              {movie.description && (
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}>
                  {movie.description}
                </Typography>
              )}

              {/* Por que assistir? */}
              <Box sx={{ mb: 3, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 0.5, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1rem', md: '1.1rem' }, 
                  fontWeight: 600 
                }}>
                  ✨ Por que assistir este filme?
                </Typography>
                <Paper elevation={0} sx={{ 
                  bgcolor: mode === 'light' ? '#f5f5f5' : '#222', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1.5px solid #1976d240', 
                  fontStyle: 'italic', 
                  maxWidth: 700, 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem' 
                }}>
                  {reason || 'Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única que ressoa com diferentes estados emocionais. Sua narrativa envolvente e personagens profundos criam uma jornada que pode inspirar, consolar ou desafiar, dependendo do que você busca no momento.'}
                </Paper>
              </Box>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FavoriteIcon />}
                  onClick={() => navigate('/intro')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Descobrir Jornada Emocional
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Baixar App
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

              {/* Tabs Section */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant={activeTab === 'streaming' ? 'contained' : 'text'}
              onClick={() => setActiveTab('streaming')}
            >
              Onde Assistir
            </Button>
            <Button
              variant={activeTab === 'emotional' ? 'contained' : 'text'}
              onClick={() => setActiveTab('emotional')}
            >
              Análise Emocional
            </Button>
            <Button
              variant={activeTab === 'similar' ? 'contained' : 'text'}
              onClick={() => setActiveTab('similar')}
            >
              Filmes Similares
            </Button>
          </Stack>

          {/* Tab Content */}
          {activeTab === 'streaming' && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Onde Assistir
              </Typography>
              {subscriptionPlatforms && subscriptionPlatforms.length > 0 ? (
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                  {subscriptionPlatforms.map((platform, index) => (
                    <Paper key={index} sx={{ p: 2, minWidth: 200 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6">
                          {platform.name}
                        </Typography>
                        <Chip 
                          label={getAccessTypeLabel(platform.accessType)} 
                          size="small" 
                          color="primary"
                        />
                      </Stack>
                      <Button
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        fullWidth
                      >
                        Assistir
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Este filme não está disponível para streaming no momento.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deixe-nos enviar uma notificação quando estiver disponível.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'emotional' && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Análise Emocional
              </Typography>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
                {/* Sentimentos */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Sentimentos Associados
                  </Typography>
                  <Stack spacing={2}>
                    {movie.movieSentiments.map((sentiment, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                          {sentiment.mainSentiment.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sentiment.subSentiment.name}
                        </Typography>
                        {sentiment.mainSentiment.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {sentiment.mainSentiment.description}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </Box>

                {/* Jornadas */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Jornadas Sugeridas
                  </Typography>
                  <Stack spacing={2}>
                    {movie.movieSuggestionFlows.map((suggestion, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                          {suggestion.journeyOptionFlow.journeyStepFlow.journeyFlow.mainSentiment.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {suggestion.journeyOptionFlow.journeyStepFlow.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {suggestion.reason}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}

          {activeTab === 'similar' && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Filmes Similares
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Funcionalidade em desenvolvimento...
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
