import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Container, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
import { MovieMetaTags } from '../../components/landing/MetaTags';
import { StreamingPlatformsCompact } from '../../components/landing/StreamingPlatformsCompact';
import OscarRecognition from '../../components/landing/OscarRecognition';
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

// Função para formatar premiações para exibição na LP
const formatAwardsForDisplay = (awardsSummary: string): { firstLine: string; secondLine?: string } => {
  if (!awardsSummary || awardsSummary.trim() === '') {
    return { firstLine: '' };
  }

  // Remover "no no total" duplicado se existir
  let cleaned = awardsSummary.replace(/no no total/g, 'no total');
  
  // Padrões para dividir em duas linhas
  const patterns = [
    // "Ganhou X Oscars. Y vitórias e Z indicações no total"
    /^(Ganhou \d+ Oscars?)\.\s*(.+)$/i,
    // "Indicado a X Oscars. Y vitórias e Z indicações no total"  
    /^(Indicado a \d+ Oscars?)\.\s*(.+)$/i,
    // "Ganhou X [premio]. Y vitórias e Z indicações no total"
    /^(Ganhou \d+ [^.]+)\.\s*(.+)$/i,
    // "Indicado a X [premio]. Y vitórias e Z indicações no total"
    /^(Indicado a \d+ [^.]+)\.\s*(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return {
        firstLine: match[1].trim(),
        secondLine: match[2].trim()
      };
    }
  }

  // Se não matched nenhum padrão, exibir em uma linha só
  // Mas se for muito longo (>50 caracteres), tentar quebrar no ponto
  if (cleaned.length > 50) {
    const dotIndex = cleaned.indexOf('.');
    if (dotIndex > 0 && dotIndex < cleaned.length - 1) {
      return {
        firstLine: cleaned.substring(0, dotIndex).trim(),
        secondLine: cleaned.substring(dotIndex + 1).trim()
      };
    }
  }

  return { firstLine: cleaned };
};

// Função para extrair o texto do landingPageHook
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

// Função para gerar texto da seção "Para quem pode ser esse filme?"




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
        setSimilarMovies(data.similarMovies || []);
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
              vibesFilm
            </Typography>
            <IconButton 
              sx={{ 
                ml: 1, 
                color: mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
              }} 
              onClick={toggleThemeMode}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
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
      <AppBar position="static" sx={{ 
        backgroundColor: 'transparent', 
        boxShadow: 'none', 
        borderBottom: mode === 'dark' 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(0,0,0,0.2)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            vibesFilm
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ color: 'text.primary' }}
            >
              Voltar
            </Button>
            <IconButton 
              sx={{ 
                ml: 1, 
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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              flexShrink: 0,
              width: { xs: '100%', md: 320 },
              maxWidth: { xs: '100%', md: 320 }
            }}>
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

              {/* Seção 4: Elenco Principal */}
              {movie.mainCast && movie.mainCast.length > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" sx={{ 
                    mb: 1, 
                    color: '#1976d2', 
                    fontWeight: 500,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}>
                    Elenco Principal
                  </Typography>
                  <Stack spacing={0.75}>
                    {movie.mainCast.map((actor, index) => (
                      <Typography key={index} variant="body2" sx={{ 
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                        textAlign: { xs: 'center', md: 'left' },
                        lineHeight: 1.4
                      }}>
                        <span style={{ fontWeight: 500, color: 'text.primary' }}>
                          {actor.actorName}
                        </span>
                        <span style={{ color: 'text.secondary', fontSize: '0.85em', fontStyle: 'italic' }}>
                          {' '}como {actor.characterName}
                        </span>
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Seção 5: Premiações Oscar ou Premiações Gerais */}
              {movie.oscarAwards ? (
                // Se tem dados do Oscar, mostrar seção de Reconhecimento no Oscar
                <OscarRecognition 
                  movieTitle={movie.title}
                  oscarAwards={movie.oscarAwards}
                />
              ) : movie.awardsSummary && movie.awardsSummary.trim() !== '' ? (
                // Se não tem Oscar mas tem awardsSummary, mostrar seção de Premiações
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" sx={{ 
                    mb: 1, 
                    color: '#1976d2', 
                    fontWeight: 500,
                    textAlign: { xs: 'center', md: 'left' },
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}>
                    Premiações
                  </Typography>
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    {(() => {
                      const { firstLine, secondLine } = formatAwardsForDisplay(movie.awardsSummary!);
                      return (
                        <>
                          <Typography variant="body2" sx={{ 
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                            lineHeight: 1.4,
                            color: 'text.primary',
                            fontWeight: 500
                          }}>
                            {firstLine}
                          </Typography>
                          {secondLine && (
                            <Typography variant="body2" sx={{ 
                              fontSize: { xs: '0.85rem', md: '0.9rem' },
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

            {/* Informações do filme - Lado direito */}
            <Box sx={{ 
              flex: 1, 
              minWidth: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              maxWidth: { xs: '100%', md: 'calc(100% - 320px - 48px)' } // 320px da coluna esquerda + 48px do gap
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
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Guia Emocional e Curadoria Personalizada | vibesFilm
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
                
                {/* Disclaimers genéricos */}
                <Box sx={{ mt: 2, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      display: 'block'
                    }}
                  >
                    * Os períodos e termos de teste grátis podem variar. Consulte a plataforma para detalhes atualizados.
                  </Typography>
                </Box>
              </Box>



              {/* Por que assistir? - H2 */}
              <Box sx={{ mt: 1, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  alignItems: { xs: 'center', md: 'flex-start' }, 
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 0.5,
                  width: '100%'
                }}>
                  <Typography variant="h2" component="h2" sx={{ 
                    color: '#1976d2', 
                    textAlign: { xs: 'center', md: 'left' }, 
                    fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                    fontWeight: 600 
                  }}>
                    Por que assistir este filme?
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => navigate('/')}
                    sx={{
                      bgcolor: '#1976d2',
                      color: 'white',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 600,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: '#1565c0',
                        boxShadow: 3,
                      },
                      minWidth: { xs: '100%', md: 'auto' }
                    }}
                  >
                    🎭 Quer o filme perfeito para sua Vibe?
                  </Button>
                </Box>
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
                          fontSize: '0.85rem',
                          textAlign: { xs: 'center', md: 'left' },
                          opacity: 0.8
                        }}
                      >
                        {movie.contentWarnings}
                      </Typography>
                    </Box>
                  )}
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
                  Para quem pode ser recomendado esse filme?
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
                          fontSize: '0.9rem',
                          textAlign: { xs: 'center', md: 'left' }
                        }}
                      >
                        Tags Emocionais Chave:
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {movie.emotionalTags.slice(0, 6).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small" 
                            sx={{ 
                              fontSize: '0.8rem', 
                              height: 24,
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              color: '#1976d2',
                              border: '1px solid rgba(25, 118, 210, 0.3)',
                              '& .MuiChip-label': { px: 1 }
                            }} 
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Paper>
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
                {/* Título da seção */}
                <Typography variant="h2" component="h2" sx={{ 
                  mb: 1.5, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600 
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
                        fontSize: { xs: '0.95rem', md: '1rem' },
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
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        bgcolor: 'transparent'
                      }}
                    >
                      Mais do Elenco
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
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        bgcolor: 'transparent'
                      }}
                    >
                      Avaliações
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
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        bgcolor: 'transparent'
                      }}
                    >
                      Filmes que despertam a mesma Emoção
                    </Button>
                  </Stack>
                </Box>

                {/* Tab Content */}
                {activeTab === 'trailer' && (
                  <Box sx={{ maxWidth: '100%' }}>
                    <Typography variant="h3" component="h3" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Trailer Oficial
                    </Typography>
                    {movie.mainTrailer ? (
                      <Box>
                        {/* Player do YouTube */}
                        <Box sx={{ 
                          width: '100%', 
                          maxWidth: { xs: '100%', sm: '600px', md: '800px' }, // Responsivo
                          height: 0, 
                          paddingBottom: { xs: '56.25%', sm: '50%', md: '42.85%' }, // Responsivo
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden',
                          mx: 'auto' // Centralizar
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
                              border: 0
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </Box>
                        
                        {/* Informações do trailer - mais sutil */}
                        <Box sx={{ mt: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {movie.mainTrailer.name} • {movie.mainTrailer.language === 'pt-BR' ? 'Dublado' : 
                              movie.mainTrailer.language === 'pt' ? 'Legendado' : 
                              movie.mainTrailer.language === 'en' ? 'Original' : movie.mainTrailer.language}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: 200, 
                        bgcolor: 'grey.100', 
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        p: 3
                      }}>
                        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                          Trailer não disponível
                        </Typography>
                        <Typography variant="body2" textAlign="center">
                          Este filme não possui trailer digital disponível no momento.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {activeTab === 'cast' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Mais do Elenco
                    </Typography>
                    {movie.fullCast && movie.fullCast.length > 0 ? (
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2 
                      }}>
                        {movie.fullCast.map((actor, index) => (
                          <Box key={index} sx={{ 
                            p: 2, 
                            border: '1px solid', 
                            borderColor: 'grey.200', 
                            borderRadius: 1,
                            bgcolor: 'background.paper'
                          }}>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 500, 
                              color: 'text.primary',
                              fontSize: { xs: '0.9rem', md: '0.95rem' }
                            }}>
                              {actor.actorName}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.8rem', md: '0.85rem' },
                              mt: 0.5,
                              fontStyle: 'italic'
                            }}>
                              como {actor.characterName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Informações do elenco em breve...
                      </Typography>
                    )}
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
                      Filmes que despertam a mesma Emoção
                    </Typography>
                    {similarMovies.length > 0 ? (
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
                        gap: 1.5,
                        maxWidth: '100%'
                      }}>
                        {similarMovies.map((similarMovie) => (
                          <Box 
                            key={similarMovie.id} 
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
                            onClick={() => similarMovie.slug && navigate(`/filme/${similarMovie.slug}`)}
                          >
                            <Box sx={{ 
                              height: 160, 
                              bgcolor: 'grey.300',
                              position: 'relative',
                              overflow: 'hidden',
                              borderRadius: '4px 4px 0 0'
                            }}>
                              {similarMovie.thumbnail ? (
                                <img
                                  src={similarMovie.thumbnail}
                                  alt={similarMovie.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px 4px 0 0'
                                  }}
                                />
                              ) : (
                                <Box sx={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  bgcolor: 'grey.200',
                                  borderRadius: '4px 4px 0 0'
                                }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    Sem imagem
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ p: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500, 
                                  fontSize: '0.75rem',
                                  lineHeight: 1.2,
                                  mb: 0.25,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {similarMovie.title}
                              </Typography>
                              {similarMovie.year && (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ fontSize: '0.7rem' }}
                                >
                                  {similarMovie.year}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Nenhum filme similar encontrado no momento.
                      </Typography>
                    )}
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
