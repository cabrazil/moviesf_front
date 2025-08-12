import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Container, IconButton, AppBar, Toolbar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useThemeManager } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';


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
  genres: string[];
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

interface SimilarMovie {
  id: string;
  title: string;
  year?: number;
  thumbnail?: string;
  vote_average?: number;
  platforms: Array<{
    streamingPlatform: {
      name: string;
    };
  }>;
  movieSentiments: Array<{
    mainSentiment: {
      name: string;
    };
  }>;
}

interface MovieDetailProps {
  slug?: string;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { mode, toggleThemeMode } = useThemeManager();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'streaming' | 'emotional' | 'similar'>('streaming');

  // Usar o slug da prop ou do parâmetro da URL
  const finalSlug = propSlug || paramSlug;



  useEffect(() => {
    const fetchMovieData = async () => {
      if (!finalSlug) return;
      
      // Por enquanto, vamos usar apenas dados mock para evitar erros de API
      
      // Dados mock baseados no slug
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
      setSimilarMovies([]);
      setLoading(false);
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

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case 'subscription':
        return 'bg-green-500';
      case 'rental':
        return 'bg-yellow-500';
      case 'purchase':
        return 'bg-blue-500';
      case 'free_with_ads':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
            EmoFilms
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'center',
            gap: 4,
            mb: 4,
          }}
        >
          {/* Poster */}
          <Box sx={{ position: 'relative', minWidth: { xs: '100%', md: 300 } }}>
            <Box
              component="img"
              src={movie.thumbnail || '/images/default-movie.jpg'}
              alt={movie.title}
              sx={{
                width: '100%',
                maxWidth: 300,
                height: 'auto',
                borderRadius: 2,
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

          {/* Movie Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
              {movie.year && (
                <Typography component="span" variant="h3" color="text.secondary">
                  {' '}({movie.year})
                </Typography>
              )}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {movie.vote_average && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="body1" fontWeight="bold">
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                  {movie.vote_count && (
                    <Typography variant="body2" color="text.secondary">
                      ({movie.vote_count.toLocaleString()})
                    </Typography>
                  )}
                </Box>
              )}
              {movie.runtime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon />
                  <Typography variant="body2" color="text.secondary">
                    {movie.runtime} min
                  </Typography>
                </Box>
              )}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {movie.genres.map((genre, index) => (
                <Chip key={index} label={genre} size="small" />
              ))}
            </Stack>

            {movie.director && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <Typography component="span" fontWeight="bold">
                  Diretor:
                </Typography>{' '}
                {movie.director}
              </Typography>
            )}

            {movie.description && (
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {movie.description}
              </Typography>
            )}

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
              {movie.platforms.length > 0 ? (
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                  {movie.platforms.map((platform, index) => (
                    <Paper key={index} sx={{ p: 2, minWidth: 200 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6">
                          {platform.streamingPlatform.name}
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
