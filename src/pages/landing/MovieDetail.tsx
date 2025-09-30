import React, { useState, useEffect, useMemo } from 'react';
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
// import tmdbLogo from '../../assets/themoviedb.svg';
// import imdbLogo from '../../assets/imdb.png';
// import rtLogo from '../../assets/rottentomatoes.png';
// import metacriticLogo from '../../assets/metascore.svg';




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
    author?: string;
    vehicle?: string;
    url?: string;
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

// Função para gerar título dinâmico baseado na jornada emocional
const getDynamicTitle = (movie: Movie, similarMovies: any[]): string => {
  // Mapear journeyOptionFlowId para textos descritivos baseado nos dados coletados
  const journeyTitles: { [key: number]: string } = {
    43: "Filmes que exploram a tristeza de forma profunda",
    145: "Filmes que exploram a ambição e excelência",
    32: "Filmes que exploram o isolamento e relações complexas",
    159: "Filmes que oferecem entretenimento e leveza",
    46: "Filmes sobre autodescoberta e crescimento pessoal",
    120: "Filmes que oferecem conforto e sensação familiar",
    178: "Filmes que exploram as emoções positivas",
    98: "Filmes de suspense psicológico e mistérios",
    88: "Filmes sobre dramas de guerra, eventos históricos ou lutas por justiça",
    103: "Filmes que exploram a ansiedade e pressões sociais",
    105: "Filmes sobre ansiedade diante do desconhecido",
    7: "Filmes de romance tocante e reflexivo",
    101: "Filmes que jogam com a sua percepção com reviravoltas inesperadas"
  };

  // Se temos filmes similares, usar o journeyOptionFlowId do primeiro (maior relevanceScore)
  if (similarMovies && similarMovies.length > 0) {
    const firstSimilarMovie = similarMovies[0];
    if (firstSimilarMovie.journeyOptionFlowId && journeyTitles[firstSimilarMovie.journeyOptionFlowId]) {
      return journeyTitles[firstSimilarMovie.journeyOptionFlowId];
    }
  }

  // Fallback: lógica baseada no título do filme (implementação temporária para teste)
  const title = movie.title.toLowerCase();
  
  // Mapeamento baseado nos dados coletados
  if (title.includes('divertida mente') || title.includes('inside out')) {
    return journeyTitles[43]; // Tristeza
  }
  if (title.includes('oppenheimer')) {
    return journeyTitles[145]; // Ambição e excelência
  }
  if (title.includes('adaline') || title.includes('incrível história')) {
    return journeyTitles[32]; // Isolamento e relações
  }
  if (title.includes('cisne negro')) {
    return journeyTitles[43]; // Tristeza (assumindo baseado nos dados)
  }
  if (title.includes('melancolia')) {
    return journeyTitles[43]; // Tristeza
  }
  if (title.includes('aftersun')) {
    return journeyTitles[43]; // Tristeza
  }
  if (title.includes('500 dias')) {
    return journeyTitles[43]; // Tristeza
  }
  if (title.includes('sangue negro')) {
    return journeyTitles[145]; // Ambição e excelência
  }
  if (title.includes('bons companheiros')) {
    return journeyTitles[145]; // Ambição e excelência
  }
  if (title.includes('cidade dos sonhos') || title.includes('mulholland drive')) {
    return journeyTitles[101];
  }
  if (title.includes('tempo de matar')) {
    return journeyTitles[103]; // Ansiedade e pressões sociais
  }
  if (title.includes('advogado do diabo') || title.includes('o sexto sentido')) {
    return journeyTitles[101]; // Reviravoltas inesperadas
  }
  if (title.includes('1917')) {
    return journeyTitles[88]; // Drama de guera
  }
  
  // Título genérico para filmes não mapeados
  return "Filmes que despertam a mesma emoção";
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
  const [activeTab, setActiveTab] = useState<'trailer' | 'cast' | 'reviews' | 'awards' | 'similar'>('similar');
  const [showFullCast, setShowFullCast] = useState(false);

  // Filtrar elenco completo para remover duplicatas do elenco principal
  // Remove atores que já estão no elenco principal
  const filteredFullCast = useMemo(() => {
    if (!movie?.fullCast || !movie?.mainCast) return movie?.fullCast || [];
    
    // Criar lista de nomes do elenco principal para comparação
    const mainCastNames = movie.mainCast.map(actor => 
      actor.actorName.toLowerCase().trim()
    );
    
    // Filtrar elenco completo removendo atores do elenco principal
    return movie.fullCast.filter(actor => 
      !mainCastNames.includes(actor.actorName.toLowerCase().trim())
    );
  }, [movie?.fullCast, movie?.mainCast]);


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
              vibesfilm
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
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              vibesfilm
          </Typography>
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
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Guia Emocional e Curadoria Personalizada | vibesfilm
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
                  {movie.title} {movie.year && `(${movie.year})`}: Onde assistir, Guia Emocional e Curadoria Personalizada | vibesfilm
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
                  Para Quem o vibesfilm Recomenda "{movie?.title}"?
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
                    'Este filme é ideal para quem busca uma experiência cinematográfica única e envolvente.'
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
                    onClick={() => navigate('/')}
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
                    Use a curadoria emocional do vibesfilm para nunca mais perder tempo escolhendo o que assistir.
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
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 0.5, sm: 1 },
                      alignItems: { xs: 'center', md: 'flex-start' },
                      flexWrap: 'wrap'
                    }}>
                      {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                        <Typography variant="body1" sx={{ 
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          color: 'text.primary',
                          fontWeight: 500
                        }}>
                          TMDB {Number(movie.vote_average).toFixed(1)}
                        </Typography>
                      )}
                      {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                        <>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.disabled',
                            display: { xs: 'none', sm: 'block' }
                          }}>
                            |
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.primary',
                            fontWeight: 500
                          }}>
                            IMDb {Number(movie.imdbRating).toFixed(1)}
                          </Typography>
                        </>
                      )}
                      {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                        <>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.disabled',
                            display: { xs: 'none', sm: 'block' }
                          }}>
                            |
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.primary',
                            fontWeight: 500
                          }}>
                            Rotten Tomatoes {Number(movie.rottenTomatoesRating).toFixed(0)}%
                          </Typography>
                        </>
                      )}
                      {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                        <>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.disabled',
                            display: { xs: 'none', sm: 'block' }
                          }}>
                            |
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            color: 'text.primary',
                            fontWeight: 500
                          }}>
                            Metacritic {Number(movie.metacriticRating).toFixed(0)}
                          </Typography>
                        </>
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
                      Elenco Principal
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
                      O que a Crítica diz?
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => setActiveTab('awards')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 0,
                        borderBottom: activeTab === 'awards' ? '2px solid #1976d2' : 'none',
                        color: activeTab === 'awards' ? '#1976d2' : 'text.secondary',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        bgcolor: 'transparent'
                      }}
                    >
                      Premiações
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
                      Filmes Relacionados
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
                    {/* Elenco Principal */}
                    {movie.mainCast && movie.mainCast.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                          Elenco Principal
                    </Typography>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                          gap: 2 
                        }}>
                          {movie.mainCast.map((actor, index) => (
                            <Box key={index} sx={{ 
                              p: 2.5, 
                              border: mode === 'dark' ? '1px solid' : '2px solid',
                              borderColor: mode === 'dark' ? 'grey.200' : '#1976d2',
                              borderRadius: mode === 'dark' ? 1 : 2,
                              bgcolor: mode === 'dark' ? 'background.paper' : 'rgba(25, 118, 210, 0.02)'
                            }}>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                                fontSize: { xs: '1rem', md: '1.05rem' }
                              }}>
                                {actor.actorName}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: 'text.secondary',
                                fontSize: { xs: '0.85rem', md: '0.9rem' },
                                mt: 0.5,
                                fontStyle: 'italic'
                              }}>
                                como {actor.characterName}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Botão Ver mais... */}
                        {filteredFullCast && filteredFullCast.length > 0 && (
                          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              onClick={() => setShowFullCast(!showFullCast)}
                              sx={{
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                px: 3,
                                py: 1,
                                '&:hover': {
                                  borderColor: '#1565c0',
                                  color: '#1565c0',
                                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                                }
                              }}
                            >
                              {showFullCast ? 'Ver menos...' : 'Ver mais...'}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Elenco Completo - Expandível */}
                    {filteredFullCast && filteredFullCast.length > 0 && showFullCast && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                          Elenco Completo
                        </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2 
                      }}>
                          {filteredFullCast.map((actor, index) => (
                          <Box key={index} sx={{ 
                            p: 2, 
                              border: mode === 'dark' ? '1px solid' : '1.5px solid',
                              borderColor: mode === 'dark' ? 'grey.200' : '#1976d240',
                              borderRadius: mode === 'dark' ? 1 : 2,
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
                      </Box>
                    )}

                    {/* Mensagem quando não há elenco completo */}
                    {(!filteredFullCast || filteredFullCast.length === 0) && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontStyle: 'italic' }}>
                          Informações do elenco completo em breve...
                      </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {activeTab === 'reviews' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      O que a Crítica diz?
                    </Typography>
                    {movie.quotes && movie.quotes.length > 0 ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1.5 
                      }}>
                        {movie.quotes.map((quote) => (
                          <Box 
                            key={quote.id} 
                            component="blockquote"
                            sx={{ 
                              p: 2, 
                              border: mode === 'dark' ? '1px solid' : '1.5px solid',
                              borderColor: mode === 'dark' ? 'grey.200' : '#1976d240',
                              borderRadius: mode === 'dark' ? 1 : 2,
                              bgcolor: 'background.paper',
                              margin: 0,
                              fontStyle: 'italic',
                              position: 'relative'
                            }}
                          >
                            <Typography variant="body2" sx={{ 
                              fontSize: '0.9rem', 
                              lineHeight: 1.5,
                              color: 'text.secondary',
                              mb: 1
                            }}>
                              "{quote.text}"
                    </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 500, 
                              fontSize: '0.8rem', 
                              color: 'text.primary',
                              fontStyle: 'normal'
                            }}>
                              {quote.author ? `— ${quote.author}` : ''}
                              {quote.vehicle && quote.url ? (
                                <span>
                                  ,{' '}
                                  <a 
                                    href={quote.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                      color: '#1976d2', 
                                      textDecoration: 'underline',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {quote.vehicle}
                                  </a>
                                </span>
                              ) : quote.vehicle ? (
                                `, ${quote.vehicle}`
                              ) : ''}
                          </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Nenhuma crítica encontrada no momento.
                      </Typography>
                    )}
                  </Box>
                )}

                {activeTab === 'awards' && (
                  <Box>
                    <Typography variant="h3" component="h3" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                      Premiações e Reconhecimento
                    </Typography>
                    
                    {movie.oscarAwards ? (
                      // Se tem dados estruturados do Oscar, mostrar componente especializado
                      <Box sx={{ mb: 3 }}>
                        <OscarRecognition 
                          movieTitle={movie.title}
                          oscarAwards={movie.oscarAwards}
                        />
                      </Box>
                    ) : movie.awardsSummary && movie.awardsSummary.trim() !== '' ? (
                      // Se não tem Oscar mas tem texto de premiações gerais
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr' },
                        gap: 2
                      }}>
                        <Box sx={{ 
                          p: 3, 
                          border: mode === 'dark' ? '1px solid' : '2px solid',
                          borderColor: mode === 'dark' ? 'grey.200' : '#1976d2',
                          borderRadius: mode === 'dark' ? 1 : 2,
                          bgcolor: mode === 'dark' ? 'background.paper' : 'rgba(25, 118, 210, 0.02)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Ícone de prêmio */}
                          <Box sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            opacity: 0.1,
                            fontSize: '2rem'
                          }}>
                            🏆
                          </Box>
                          
                          <Typography variant="h4" component="h4" sx={{ 
                            mb: 2, 
                            fontSize: '1.1rem', 
                            fontWeight: 600, 
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <span>🏆</span>
                            Reconhecimento e Premiações
                          </Typography>
                          
                          {(() => {
                            const { firstLine, secondLine } = formatAwardsForDisplay(movie.awardsSummary!);
                            return (
                              <Box>
                                <Typography variant="body1" sx={{ 
                                  fontSize: { xs: '1rem', md: '1.1rem' },
                                  lineHeight: 1.6,
                                  color: 'text.primary',
                                  fontWeight: 500,
                                  mb: secondLine ? 2 : 0
                                }}>
                                  {firstLine}
                                </Typography>
                                {secondLine && (
                                  <Typography variant="body1" sx={{ 
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    lineHeight: 1.6,
                                    color: 'text.secondary',
                                    fontStyle: 'italic'
                                  }}>
                                    {secondLine}
                                  </Typography>
                                )}
                              </Box>
                            );
                          })()}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 6,
                        px: 3,
                        textAlign: 'center',
                        border: mode === 'dark' ? '1px dashed' : '2px dashed',
                        borderColor: mode === 'dark' ? 'grey.300' : '#1976d240',
                        borderRadius: 2,
                        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(25, 118, 210, 0.02)'
                      }}>
                        <Box sx={{ 
                          fontSize: '3rem', 
                          mb: 2, 
                          opacity: 0.3 
                        }}>
                          🏆
                        </Box>
                        <Typography variant="h6" sx={{ 
                          mb: 1, 
                          color: 'text.secondary',
                          fontWeight: 500
                        }}>
                          Premiações não disponíveis
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          maxWidth: '400px',
                          lineHeight: 1.5
                        }}>
                          Este filme pode não ter recebido grandes premiações ou os dados ainda não foram catalogados.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {activeTab === 'similar' && (
                  <Box>
                    {/* Título e CTA na mesma linha */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'space-between' },
                      mb: 2,
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 2, md: 0 }
                    }}>
                      <Typography variant="h3" component="h3" sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 600, 
                        color: 'text.primary',
                        margin: 0
                      }}>
                        {getDynamicTitle(movie, similarMovies)}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/')}
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

export default MovieDetail;