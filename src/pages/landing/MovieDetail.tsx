import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Paper, Button, Container, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
import { MovieMetaTags } from '../../components/landing/MetaTags';
import { StreamingPlatformsCompact } from '../../components/landing/StreamingPlatformsCompact';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useThemeManager } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import logoBlog from '../../assets/logo_header.png';
import tmdbLogo from '../../assets/themoviedb.png';
import imdbLogo from '../../assets/imdb.png';
import rtLogo from '../../assets/rottentomatoes.png';
import metacriticLogo from '../../assets/metascore.svg';




// Componente RatingIcon (comentado - não utilizado)
// const RatingIcon: React.FC<{ src: string; alt: string; size?: number }> = ({ src, alt, size = 20 }) => (
//   <Box
//     component="img"
//     src={src}
//     alt={alt}
//     sx={{
//       width: size,
//       height: size,
//       objectFit: 'contain'
//     }}
//   />
// );

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
  emotionalTags?: Array<{
    mainSentiment: string;
    subSentiment: string;
    relevance: number;
  }>;
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
      categoryName?: string;
      year: number;
      personName?: string;
    }>;
    nominations: Array<{
      category: string;
      categoryName?: string;
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
    author?: string;
    vehicle?: string;
    url?: string;
  }>;
  primaryJourney?: {
    journeyOptionFlowId: number;
    displayTitle: string | null;
  } | null;
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

// Função para gerar título dinâmico baseado na jornada emocional
const getDynamicTitle = (movie: Movie, similarMovies: any[]): string => {
  // 1. Prioridade: usar displayTitle do filme atual (jornada principal)
  if (movie.primaryJourney?.displayTitle) {
    return movie.primaryJourney.displayTitle;
  }

  // 2. Fallback: usar displayTitle do primeiro filme similar
  if (similarMovies && similarMovies.length > 0) {
    const firstSimilarMovie = similarMovies[0];
    if (firstSimilarMovie.displayTitle) {
      return firstSimilarMovie.displayTitle;
    }
  }

  // 3. Fallback final: título genérico
  return "Filmes que despertam a mesma emoção";
};

// Função para traduzir categorias do Oscar (versão completa da versão anterior)
const translateOscarCategory = (category: string): string => {
  if (!category) return '';
  
  // Normalizar a categoria (remover espaços extras, converter para maiúscula)
  const normalizedCategory = category.trim().toUpperCase();
  
  const translations: { [key: string]: string } = {
    'BEST PICTURE': 'Melhor Filme',
    'BEST DIRECTOR': 'Melhor Diretor',
    'BEST ACTOR': 'Melhor Ator',
    'BEST ACTRESS': 'Melhor Atriz',
    'BEST SUPPORTING ACTOR': 'Melhor Ator Coadjuvante',
    'BEST SUPPORTING ACTRESS': 'Melhor Atriz Coadjuvante',
    'BEST ORIGINAL SCREENPLAY': 'Melhor Roteiro Original',
    'BEST ADAPTED SCREENPLAY': 'Melhor Roteiro Adaptado',
    'BEST CINEMATOGRAPHY': 'Melhor Fotografia',
    'BEST FILM EDITING': 'Melhor Edição',
    'BEST PRODUCTION DESIGN': 'Melhor Direção de Arte',
    'BEST COSTUME DESIGN': 'Melhor Figurino',
    'BEST MAKEUP AND HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'BEST SOUND': 'Melhor Som',
    'BEST SOUND EDITING': 'Melhor Edição de Som',
    'SOUND EFFECTS EDITING': 'Melhor Edição de Efeitos Sonoros',
    'BEST SOUND MIXING': 'Melhor Mixagem de Som',
    'BEST VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'BEST ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'BEST ORIGINAL SONG': 'Melhor Canção Original',
    'WRITING (Original Screenplay)': 'Melhor Roteiro Original',
    'WRITING (Adapted Screenplay)': 'Melhor Roteiro Adaptado',
    'WRITING (ADAPTED SCREENPLAY)': 'Melhor Roteiro Adaptado',
    'WRITING (Story and Screenplay--written directly for the screen)': 'Melhor Roteiro Original',
    'WRITING (Screenplay Based on Material from Another Medium)': 'Melhor Roteiro Adaptado',
    'WRITING (Screenplay Based on Material Previously Produced or Published)': 'Melhor Roteiro baseado em material produzido ou publicado anteriormente',
    'BEST INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'BEST DOCUMENTARY FEATURE': 'Melhor Documentário',
    'BEST DOCUMENTARY SHORT SUBJECT': 'Melhor Documentário em Curta-Metragem',
    'BEST ANIMATED FEATURE FILM': 'Melhor Filme de Animação',
    'BEST ANIMATED SHORT FILM': 'Melhor Curta-Metragem de Animação',
    'BEST LIVE ACTION SHORT FILM': 'Melhor Curta-Metragem de Ação ao Vivo',
    'ACTOR IN A LEADING ROLE': 'Melhor Ator',
    'ACTRESS IN A LEADING ROLE': 'Melhor Atriz',
    'ACTOR IN A SUPPORTING ROLE': 'Melhor Ator Coadjuvante',
    'ACTRESS IN A SUPPORTING ROLE': 'Melhor Atriz Coadjuvante',
    'DIRECTING': 'Melhor Diretor',
    'CINEMATOGRAPHY': 'Melhor Fotografia',
    'FILM EDITING': 'Melhor Edição',
    'PRODUCTION DESIGN': 'Melhor Direção de Arte',
    'ART DIRECTION': 'Melhor Direção de Arte',
    'COSTUME DESIGN': 'Melhor Figurino',
    'MAKEUP AND HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'SOUND': 'Melhor Som',
    'SOUND MIXING': 'Melhor Mixagem de Som',
    'SOUND EDITING': 'Melhor Edição de Som',
    'VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'SPECIAL VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'ORIGINAL SONG': 'Melhor Canção Original',
    'MUSIC (Original Dramatic Score)': 'Melhor Trilha Sonora Original',
    'MUSIC (Original Score)': 'Melhor Trilha Sonora Original',
    'MUSIC (Original Song)': 'Melhor Canção Original',
    'MUSIC (ORIGINAL SCORE)': 'Melhor Trilha Sonora Original',
    'MUSIC (ORIGINAL SONG)': 'Melhor Canção Original',
    'WRITING (Screenplay Written Directly for the Screen)': 'Melhor Roteiro Original',
    'INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'DOCUMENTARY FEATURE': 'Melhor Documentário',
    'ANIMATED FEATURE FILM': 'Melhor Filme de Animação',
    // Adicionar suporte para formato com underscore (do backend)
    'BEST_PICTURE': 'Melhor Filme',
    'BEST_DIRECTOR': 'Melhor Diretor',
    'BEST_ACTOR': 'Melhor Ator',
    'BEST_ACTRESS': 'Melhor Atriz',
    'BEST_SUPPORTING_ACTOR': 'Melhor Ator Coadjuvante',
    'BEST_SUPPORTING_ACTRESS': 'Melhor Atriz Coadjuvante',
    'BEST_ORIGINAL_SCREENPLAY': 'Melhor Roteiro Original',
    'BEST_ADAPTED_SCREENPLAY': 'Melhor Roteiro Adaptado',
    'BEST_CINEMATOGRAPHY': 'Melhor Fotografia',
    'BEST_FILM_EDITING': 'Melhor Edição',
    'BEST_ORIGINAL_SCORE': 'Melhor Trilha Sonora Original',
    'BEST_ORIGINAL_SONG': 'Melhor Canção Original',
    'BEST_PRODUCTION_DESIGN': 'Melhor Direção de Arte',
    'BEST_COSTUME_DESIGN': 'Melhor Figurino',
    'BEST_MAKEUP_AND_HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'BEST_SOUND': 'Melhor Som',
    'BEST_VISUAL_EFFECTS': 'Melhores Efeitos Visuais',
    'BEST_ANIMATED_FEATURE': 'Melhor Filme de Animação',
    'BEST_INTERNATIONAL_FEATURE': 'Melhor Filme Internacional',
    'BEST_DOCUMENTARY_FEATURE': 'Melhor Documentário',
    'BEST_SHORT_FILM': 'Melhor Curta-Metragem',
    'BEST_ANIMATED_SHORT': 'Melhor Curta de Animação',
    'BEST_DOCUMENTARY_SHORT': 'Melhor Documentário Curto',
    'BEST_LIVE_ACTION_SHORT': 'Melhor Curta de Ação ao Vivo'
  };

  return translations[normalizedCategory] || category;
};

// Função para gerar texto da seção "Para quem pode ser esse filme?"
const MovieDetail: React.FC<MovieDetailProps> = ({ slug: propSlug }) => {
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
  const [showFullCast, setShowFullCast] = useState(false);
  const [showFullNominations, setShowFullNominations] = useState(false);
  



  // Usar o slug da prop ou do parâmetro da URL
  const finalSlug = propSlug || identifier;

  // Hooks devem vir ANTES de qualquer return condicional

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
          : 'http://localhost:3333';
        
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
        setMovie(null);
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
              Vibesfilm
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
          backgroundColor: mode === 'dark' ? 'transparent' : 'rgba(0,0,0,0.05)',
        boxShadow: 'none', 
          borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            component="img"
            src={logoBlog}
            alt="VibesFilm Logo"
            onClick={() => navigate('/')}
            sx={{
              height: { xs: 32, sm: 40 },
              width: 'auto',
              maxWidth: { xs: 150, sm: 200 },
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 0.8
              }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

      <Container maxWidth="xl" sx={{ py: 1, px: { xs: 2, sm: 2, md: 3 }, overflow: 'hidden' }}>
        {/* Hero Section - Layout Desktop */}
        <Box sx={{ mb: 4 }}>
          {/* Layout Desktop */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'center',
              gap: { xs: 0, md: 6 },
              pt: 1,
              maxWidth: '100%',
              overflow: 'hidden',
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

              {/* H1 para Mobile - Logo após a Hero */}
              <Box sx={{ 
                display: { xs: 'block', md: 'none' },
                mt: 2,
                mb: 2,
                px: 1
              }}>
                <Typography variant="h1" component="h1" sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'center', 
                  fontSize: '1.4rem', 
                  lineHeight: 1.3,
                            color: 'text.primary',
                  wordBreak: 'break-word',
                  hyphens: 'auto'
                          }}>
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Guia Emocional e Curadoria Personalizada | Vibesfilm
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
              maxWidth: { xs: '100%', md: 'calc(100% - 320px - 48px)' } // 320px da coluna esquerda + 48px do gap
            }}>
              {/* Título e ano - H1 - Mobile: abaixo da Hero */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'baseline', 
                gap: 1, 
                mb: 1, 
                justifyContent: 'flex-start' 
              }}>
                <Typography variant="h1" component="h1" sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'left', 
                  fontSize: '2rem', 
                  lineHeight: 1.2,
                  color: 'text.primary'
                }}>
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Guia Emocional e Curadoria Personalizada | Vibesfilm
                </Typography>
              </Box>

              {/* Título original, diretor, duração e classificação */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                  Título original: <span style={{ color: '#1976d2', fontWeight: 500 }}>
                    {movie.original_title && movie.original_title.trim() !== '' && movie.original_title !== movie.title 
                      ? movie.original_title 
                      : movie.title}
                  </span>
                </Typography>
                {movie.director && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      |
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      Diretor: <span style={{ color: '#1976d2', fontWeight: 500 }}>{movie.director}</span>
                    </Typography>
                  </>
                )}
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
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      Classificação: 
                    </Typography>
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
                      color: mode === 'dark' ? 'text.secondary' : 'text.primary',
                      fontSize: '0.75rem',
                      opacity: mode === 'dark' ? 0.7 : 0.9,
                      display: 'block'
                    }}
                  >
                    * Os períodos e termos de teste grátis podem variar. Consulte a plataforma para detalhes atualizados.
                  </Typography>
                </Box>
              </Box>



              {/* Qual é a Vibe de movie.title? - H2 */}
              <Box sx={{ mt: 1, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                {/* Desktop: Apenas o título */}
                <Typography variant="h2" component="h2" sx={{ 
                  color: '#1976d2', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: 600,
                  margin: 0,
                  mb: 0.5,
                  display: { xs: 'none', md: 'block' }
                }}>
                  Qual é a Vibe de {movie?.title}?
                </Typography>

                {/* Mobile: Apenas o título */}
                <Typography variant="h2" component="h2" sx={{ 
                  color: '#1976d2', 
                  textAlign: 'center', 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  mb: 0.5,
                  display: { xs: 'block', md: 'none' }
                }}>
                  Qual é a Vibe de {movie?.title}?
                </Typography>
                
                {/* Texto "Prepare-se para..." */}
                <Paper elevation={0} sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1.5px solid #1976d240', 
                  fontStyle: 'italic', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem',
                  mb: 2
                }}>
                  {movie?.landingPageHook ? extractHookText(movie.landingPageHook) : 'Prepare-se para uma experiência cinematográfica única que ressoa com diferentes estados emocionais. Sua narrativa envolvente e personagens profundos criam uma jornada que pode inspirar, consolar ou desafiar, dependendo do que você busca no momento.'}
                </Paper>

                {/* Tags Emocionais Chave - H3 */}
                {movie?.emotionalTags && movie.emotionalTags.length > 0 && (
                  <Box sx={{ mb: 2, width: '100%' }}>
                    <Typography variant="h3" component="h3" sx={{ 
                      mb: 1, 
                      color: '#1976d2', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1rem', md: '1.1rem' }, 
                      fontWeight: 600 
                    }}>
                      Tags Emocionais Chave:
                    </Typography>
                    <Box component="ul" sx={{ 
                      pl: 2, 
                      m: 0,
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      {movie.emotionalTags
                        .sort((a, b) => b.relevance - a.relevance) // Ordenar por relevância (maior para menor)
                        .slice(0, 4) // Pegar apenas as 4 mais relevantes
                        .map((tag, index) => (
                        <Box component="li" key={index} sx={{ 
                          mb: 0.5,
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          color: 'text.primary'
                        }}>
                          {tag.subSentiment}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Alerta de Conteúdo - H3 */}
                {movie?.contentWarnings && 
                 movie.contentWarnings !== 'Atenção: nenhum alerta de conteúdo significativo.' && (
                  <Box sx={{ mb: 2, width: '100%' }}>
                    <Typography variant="h3" component="h3" sx={{ 
                      mb: 1, 
                      color: '#ff6b35', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1rem', md: '1.1rem' }, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}>
                      ⚠️ Alerta de Conteúdo
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: 'text.primary',
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <span style={{ fontWeight: 600 }}>Atenção: </span>{movie.contentWarnings.replace('Atenção: ', '')}
                    </Typography>
                  </Box>
                )}
              </Box>


              {/* Para Quem o vibesfilm Recomenda "movie.title"? - H2 */}
              <Box sx={{ mt: 1, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h2" component="h2" sx={{ 
                  mb: 0.5, 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600 
                }}>
                  Para Quem o Vibesfilm Recomenda "{movie?.title}"?
                </Typography>
                <Paper elevation={0} sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1.5px solid #1976d240', 
                  fontStyle: 'italic', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem',
                  mb: 2
                }}>
                  {movie?.targetAudienceForLP ? 
                    movie.targetAudienceForLP :
                    'Este filme pode ser perfeito para quem busca uma experiência cinematográfica única e envolvente.'
                  }
                </Paper>

                {/* CTA "Encontre o Filme Perfeito para Sua Vibe" */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: { xs: 'center', md: 'flex-start' },
                  width: '100%'
                }}>
                  <Typography variant="h3" component="h3" sx={{ 
                    mb: 1, 
                    color: '#1976d2', 
                    textAlign: { xs: 'center', md: 'left' }, 
                    fontSize: { xs: '1rem', md: '1.1rem' }, 
                    fontWeight: 600 
                  }}>
                    Gostou da nossa análise?
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/app')}
                    sx={{
                      bgcolor: '#ff6b35',
                      color: 'white',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      py: 2,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 3,
                      '&:hover': {
                        bgcolor: '#e55a2b',
                        boxShadow: 4,
                      },
                      minWidth: { xs: '100%', md: 'auto' },
                      mb: 1
                    }}
                  >
                    Encontre o Filme Perfeito para Sua Vibe
                  </Button>

                  {/* Microcopy */}
                  <Typography variant="body2" sx={{ 
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    color: 'text.secondary',
                    textAlign: { xs: 'center', md: 'left' },
                    fontStyle: 'italic',
                    maxWidth: { xs: '100%', md: '400px' },
                    lineHeight: 1.4
                  }}>
                    Use a curadoria emocional do Vibesfilm para nunca mais perder tempo escolhendo o que assistir.
                  </Typography>
                </Box>
              </Box>

              {/* Sinopse - H2 */}
              {movie.description && (
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Typography variant="h2" component="h2" sx={{ 
                    color: '#1976d2', 
                    textAlign: { xs: 'center', md: 'left' }, 
                    fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                    fontWeight: 600,
                    margin: 0,
                    mb: 1
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

              {/* Notas e Gêneros - H2 */}
              <Box sx={{ mt: 3, width: '100%' }}>
                <Typography variant="h2" component="h2" sx={{ 
                  color: '#1976d2', 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600,
                  margin: 0,
                  mb: 2
                }}>
                  Notas e Gêneros
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  gap: { xs: 2, md: 4 },
                  alignItems: { xs: 'center', md: 'flex-start' }
                }}>
                  {/* Notas da Crítica */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h3" component="h3" sx={{ 
                      mb: 1, 
                      color: '#1976d2', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1rem', md: '1.1rem' }, 
                      fontWeight: 600 
                    }}>
                      Notas da Crítica:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5, 
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}>
                      {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <img 
                            src={tmdbLogo} 
                            alt="TMDB" 
                            style={{ 
                              width: 20, 
                              height: 20,
                              objectFit: 'contain',
                              display: 'block'
                            }} 
                          />
                          <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>{Number(movie.vote_average).toFixed(1)}</Typography>
                        </Box>
                      )}
                      {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <img src={imdbLogo} alt="IMDB" style={{ width: 20, height: 20 }} />
                          <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
                        </Box>
                      )}
                      {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <img src={rtLogo} alt="Rotten Tomatoes" style={{ width: 20, height: 20 }} />
                          <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
                        </Box>
                      )}
                      {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <img src={metacriticLogo} alt="Metacritic" style={{ width: 20, height: 20 }} />
                          <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 500 }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Gêneros */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h3" component="h3" sx={{ 
                      mb: 1, 
                      color: '#1976d2', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1rem', md: '1.1rem' }, 
                      fontWeight: 600 
                    }}>
                      Gêneros:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 0.5,
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}>
                      {movie.genres.map((genre, index) => (
                        <Chip 
                          key={index} 
                          label={genre} 
                          size="small" 
                          sx={{ 
                            fontSize: { xs: '0.8rem', md: '0.9rem' }, 
                            height: 28,
                            '& .MuiChip-label': { px: 1.5 }
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>


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
                
                {/* Layout Responsivo: Accordion */}
                <>
                {/* Seção 1: Trailer (sempre visível) */}
                <Box sx={{ mb: 3 }}>
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
                </Box>

                {/* Seção 2: Elenco Principal (simplificado) */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h3" 
                    component="h3" 
                    sx={{ 
                      mb: 2, 
                      color: '#1976d2', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                      fontWeight: 600 
                    }}
                  >
                    Elenco Principal
                  </Typography>
                  {/* Lista simples do elenco */}
                  {movie.mainCast && movie.mainCast.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {/* Mostrar apenas atores com order 0-4 (elenco principal) */}
                      {movie.mainCast?.filter(actor => actor.order <= 4).map((actor, index) => (
                        <Box key={index} sx={{ 
                          py: 1, 
                          borderBottom: index < 4 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 500, 
                            color: 'text.primary',
                            fontSize: '1rem'
                          }}>
                            {actor.actorName} <span style={{ fontStyle: 'italic', color: '#666' }}>como</span> <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{actor.characterName}</span>
                          </Typography>
                        </Box>
                      ))}
                      
                      {/* Atores extras (order > 4) - mostrados quando showFullCast = true */}
                      {showFullCast && movie.mainCast?.some(actor => actor.order > 4) && (
                        <Box sx={{ mt: 2 }}>
                          {movie.mainCast?.filter(actor => actor.order > 4).map((actor, index) => (
                            <Box key={index} sx={{ 
                              py: 1, 
                              borderBottom: index < (movie.mainCast?.filter(actor => actor.order > 4).length || 0) - 1 ? '1px solid' : 'none',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500, 
                                color: 'text.primary',
                                fontSize: '1rem'
                              }}>
                                {actor.actorName} <span style={{ fontStyle: 'italic', color: '#666' }}>como</span> <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{actor.characterName}</span>
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Ver mais se houver atores com order > 4 */}
                      {movie.mainCast.some(actor => actor.order > 4) && (
                        <Box sx={{ 
                          mt: 2, 
                          pt: 1, 
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          textAlign: 'center'
                        }}>
                          <Button
                            variant="text"
                            onClick={() => setShowFullCast(!showFullCast)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.9rem',
                              color: '#1976d2',
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                              }
                            }}
                          >
                            {showFullCast ? 'Ver menos' : `Ver mais... (${movie.mainCast?.filter(actor => actor.order > 4).length || 0} atores)`}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}

                </Box>

                {/* Seção 3: Premiações (simplificado) */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h3" 
                    component="h3" 
                    sx={{ 
                      mb: 2, 
                      color: '#1976d2', 
                      textAlign: { xs: 'center', md: 'left' }, 
                      fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                      fontWeight: 600 
                    }}
                  >
                    Premiações e Reconhecimento
                  </Typography>
                    
                    {movie.oscarAwards && (movie.oscarAwards.wins.length > 0 || movie.oscarAwards.nominations.length > 0) ? (
                      // Se tem dados estruturados do Oscar, mostrar versão simplificada
                      <Box sx={{ mb: 2 }}>
                        {/* Texto introdutório */}
                        <Typography variant="body1" sx={{ 
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          color: 'text.primary',
                          fontWeight: 500
                        }}>
                          {movie.title} foi indicado a {(movie.oscarAwards?.wins.length || 0) + (movie.oscarAwards?.nominations.length || 0)} Oscar{((movie.oscarAwards?.wins.length || 0) + (movie.oscarAwards?.nominations.length || 0)) > 1 ? 's' : ''} em {(movie.oscarAwards?.wins.length || 0) > 0 ? movie.oscarAwards?.wins[0]?.year : movie.oscarAwards?.nominations[0]?.year}{(movie.oscarAwards?.wins.length || 0) > 0 ? ', ' : ''}{(movie.oscarAwards?.wins.length || 0) > 0 ? <span style={{ fontStyle: 'italic' }}>conquistou</span> : ''}:
                        </Typography>

                        {/* Vitórias no Oscar - sempre visíveis */}
                        {movie.oscarAwards?.wins && movie.oscarAwards.wins.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            {movie.oscarAwards.wins.map((win, index) => (
                              <Box key={index} sx={{ 
                                py: 1, 
                                borderBottom: index < (movie.oscarAwards?.wins.length || 0) - 1 ? '1px solid' : 'none',
                                borderColor: 'divider'
                              }}>
                                <Typography variant="body1" sx={{ 
                                  fontWeight: 500, 
                                  color: 'text.primary',
                                  fontSize: '1rem'
                                }}>
                                  {translateOscarCategory(win.categoryName || win.category)} <span style={{ fontStyle: 'italic', color: '#666' }}>para</span> <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{win.personName}</span>
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {/* Indicações que não venceram - só aparecem no "Ver mais" */}
                        {movie.oscarAwards?.nominations && movie.oscarAwards.nominations.length > 0 && (
                          <>

                            {/* Indicações extras - mostradas quando showFullNominations = true */}
                            {showFullNominations && (
                              <Box sx={{ mt: 2 }}>
                                {movie.oscarAwards.nominations.map((nomination, index) => (
                                  <Box key={index} sx={{ 
                                    py: 1, 
                                    borderBottom: index < (movie.oscarAwards?.nominations.length || 0) - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider'
                                  }}>
                                    <Typography variant="body1" sx={{ 
                                      fontWeight: 500, 
                                      color: 'text.primary',
                                      fontSize: '1rem'
                                    }}>
                                      {translateOscarCategory(nomination.categoryName || nomination.category)} <span style={{ fontStyle: 'italic', color: '#666' }}>para</span> <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{nomination.personName}</span>
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}

                            {/* Ver mais se houver indicações */}
                            {movie.oscarAwards.nominations.length > 0 && (
                              <Box sx={{ 
                                mt: 2, 
                                pt: 1, 
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                textAlign: 'center'
                              }}>
                                <Button
                                  variant="text"
                                  onClick={() => setShowFullNominations(!showFullNominations)}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '0.9rem',
                                    color: '#1976d2',
                                    fontWeight: 500,
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                    }
                                  }}
                                >
                                  {showFullNominations ? 'Ver menos' : `Ver mais... (${movie.oscarAwards.nominations.length} ${movie.oscarAwards.nominations.length > 1 ? 'indicações' : 'indicação'})`}
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    ) : (
                      // Layout elegante sem card para premiações gerais
                      <Box sx={{ 
                        py: 2,
                        textAlign: 'left'
                      }}>
                        <Typography variant="body1" sx={{ 
                          color: 'text.primary',
                          fontWeight: 500,
                          mb: 1.5,
                          fontSize: '1rem',
                          lineHeight: 1.6
                        }}>
                          {movie.awardsSummary && movie.awardsSummary.trim() !== '' && !movie.awardsSummary.toLowerCase().includes('oscar')
                            ? `Este filme recebeu "${movie.awardsSummary}" em outras cerimônias de premiações.`
                            : 'Este filme pode ter recebido outros reconhecimentos importantes em festivais e premiações especializadas.'
                          }
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    {/* Seção 4: Filmes Relacionados (sempre visível) */}
                    <Box>
                      {/* Título fixo em azul */}
                      <Typography variant="h3" component="h3" sx={{ 
                        color: '#1976d2',
                        textAlign: { xs: 'center', md: 'left' },
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        fontWeight: 600,
                        margin: 0,
                        mb: 1
                      }}>
                        Filmes Relacionados
                      </Typography>
                      
                      {/* Texto descritivo em branco */}
                      <Typography variant="body1" sx={{ 
                        color: 'text.primary',
                        textAlign: { xs: 'center', md: 'left' },
                        fontSize: '1rem',
                        fontWeight: 400,
                        mb: 1,
                        lineHeight: 1.5
                      }}>
                        {getDynamicTitle(movie, similarMovies)}
                      </Typography>
                      
                      {/* Frase explicativa elegante */}
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        textAlign: { xs: 'center', md: 'left' },
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        mb: 2,
                        lineHeight: 1.4
                      }}>
                        *os filmes abaixo podem despertar sentimentos semelhantes.
                      </Typography>
                      
                      {/* CTA na mesma linha */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                        mb: 2
                      }}>
                        
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate('/app')}
                          sx={{
                            bgcolor: '#ff6b35',
                            color: 'white',
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            fontWeight: 600,
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: 2,
                            '&:hover': {
                              bgcolor: '#e55a2b',
                              boxShadow: 3,
                            },
                            minWidth: 'auto'
                          }}
                        >
                          Quer mais recomendações como esta?
                        </Button>
                      </Box>
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
                              onClick={() => similarMovie.slug && navigate(`/onde-assistir/${similarMovie.slug}`)}
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
                  </Box>
                </>
              </Box>
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default MovieDetail;