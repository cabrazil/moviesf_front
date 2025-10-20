import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button, Modal, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import tmdbLogo from '../assets/themoviedb.svg';
import imdbLogo from '../assets/imdb.png';
import rtLogo from '../assets/rottentomatoes.png';
import metacriticLogo from '../assets/metascore.svg';
import { getPlatformLogoUrlMedium } from '../services/streaming.service';
import OscarRecognition from '../components/landing/OscarRecognition';
import { StreamingPlatformsCompact } from '../components/landing/StreamingPlatformsCompact';

// Função para formatar premiações para exibição
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

const MovieDetailsPage: React.FC = () => {
  const { mode } = useThemeManager();
  const location = useLocation();
  const navigate = useNavigate();
  const { identifier } = useParams();
  const movieId = identifier; // Usar o novo parâmetro unificado
  const state = location.state || {};
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  
  // Extrair valores do state uma vez para evitar recriação
  const sentimentId = state?.sentimentId;
  const intentionType = state?.intentionType;
  const reason = state?.reason;
  
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;
  const themeColor = currentSentimentColors[(sentimentId as keyof typeof currentSentimentColors)] || '#1976d2';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError('ID do filme não encontrado');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://moviesf-back.vercel.app' 
          : 'http://localhost:3333'
        
        // Para MovieDetailsPage, usar o endpoint details com UUID
        const response = await fetch(`${baseURL}/api/movie/${movieId}/details`);
        
        if (!response.ok) {
          throw new Error(`Filme não encontrado (${response.status})`);
        }
        
        const data = await response.json();
        setMovieData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do filme');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]); // Removido 'state' das dependências

  // Buscar filmes similares baseados em RelevanceScore
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movieData?.movie?.id) {
        return;
      }
      
      try {
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://moviesf-back.vercel.app' 
          : 'http://localhost:3333';
        
        const response = await fetch(`${baseURL}/api/movies/${movieData.movie.id}/similar`);
        
        if (response.ok) {
          const data = await response.json();
          setSimilarMovies(data.slice(0, 6)); // Limitar a 6 filmes
        } else {
          console.error('Erro ao buscar filmes similares:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('🔍 MovieDetailsPage - Erro ao buscar filmes similares:', error);
      }
    };

    fetchSimilarMovies();
  }, [movieData?.movie?.id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (error || !movieData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {error || 'Dados do filme não encontrados.'}
        </Typography>
      </Box>
    );
  }

  const movie = movieData?.movie;

  // Função para gerar conteúdo personalizado baseado na jornada emocional
  const getPersonalizedContent = (): { title: string; content: React.ReactNode } => {
    if (!sentimentId || !intentionType || !reason) {
      // Se não temos dados da jornada, usar conteúdo padrão
      return {
        title: "Por que assistir a este filme?",
        content: movie.landingPageHook ? 
          movie.landingPageHook.replace(/<[^>]*>/g, '') : 
          "Este filme oferece uma experiência cinematográfica única que vale a pena assistir."
      };
    }

    // Mapear sentimentos para nomes amigáveis (IDs corretos do banco)
    const sentimentNames: { [key: number]: string } = {
      13: "Feliz / Alegre",
      14: "Triste", 
      15: "Calmo(a)",
      16: "Ansioso(a)",
      17: "Animado(a)",
      18: "Cansado(a)"
    };

    // Mapear intenções para nomes amigáveis
    const intentionNames: { [key: string]: string } = {
      "PROCESS": "Processar",
      "MAINTAIN": "Manter",
      "TRANSFORM": "Transformar",
      "REPLACE": "Substituir",
      "EXPLORE": "Explorar"
    };

    const sentimentName = sentimentNames[sentimentId] || "emocional";
    const intentionName = intentionNames[intentionType] || "emocional";

    // Função para gerar conectores naturais baseados na intenção
    const getConnector = (intention: string) => {
      const connectors: { [key: string]: string } = {
        "PROCESS": "este filme traz",
        "MAINTAIN": "este filme oferece",
        "TRANSFORM": "este filme pode te ajudar através de",
        "REPLACE": "este filme é ideal com",
        "EXPLORE": "este filme oferece"
      };
      return connectors[intention] || "este filme oferece";
    };

    const connector = getConnector(intentionType);

    // Garantir que o reason comece com minúscula para fluidez
    const formattedReason = reason.charAt(0).toLowerCase() + reason.slice(1);

    return {
      title: "Por que assistir a este filme?",
      content: (
        <>
          Para quem está <strong className="text-blue-600 font-semibold">{sentimentName}</strong> e quer <strong className="text-purple-600 font-semibold">{intentionName}</strong>, {connector} {formattedReason}
        </>
      )
    };
  };

  const personalizedContent = getPersonalizedContent();

  // Debug: Verificar dados do elenco e streaming
  console.log('🎬 MovieDetailsPage - movie:', movie);
  console.log('🎬 MovieDetailsPage - mainCast:', movie?.mainCast);
  console.log('🎬 MovieDetailsPage - mainCast length:', movie?.mainCast?.length);
  console.log('🎬 MovieDetailsPage - movieData:', movieData);
  console.log('🎬 MovieDetailsPage - subscriptionPlatforms:', movieData?.subscriptionPlatforms);
  console.log('🎬 MovieDetailsPage - journey data:', { sentimentId, intentionType, reason });
  console.log('🎬 MovieDetailsPage - personalized content:', personalizedContent);
  
  // Debug: Verificar dados de premiações
  console.log('🏆 MovieDetailsPage - oscarAwards:', movie?.oscarAwards);

  // Preparar dados das plataformas para StreamingPlatformsCompact
  const subscriptionPlatforms = movieData?.subscriptionPlatforms
    ?.filter((p: any) => p.accessType === 'INCLUDED_WITH_SUBSCRIPTION')
    .map((p: any) => ({
      id: p.id || `${p.name}-${p.accessType}`,
      name: p.name,
      category: p.category || 'streaming',
      logoPath: p.logoPath,
      hasFreeTrial: p.hasFreeTrial || false,
      freeTrialDuration: p.freeTrialDuration || null,
      baseUrl: p.baseUrl || null,
      accessType: p.accessType
    })) || [];

  const rentalPurchasePlatforms = movieData?.subscriptionPlatforms
    ?.filter((p: any) => p.accessType === 'RENTAL' || p.accessType === 'PURCHASE')
    .map((p: any) => ({
      id: p.id || `${p.name}-${p.accessType}`,
      name: p.name,
      category: p.category || 'rental',
      logoPath: p.logoPath,
      hasFreeTrial: false,
      freeTrialDuration: null,
      baseUrl: p.baseUrl || null,
      accessType: p.accessType
    })) || [];
  console.log('🏆 MovieDetailsPage - awardsSummary:', movie?.awardsSummary);
  console.log('🏆 MovieDetailsPage - has oscarAwards:', !!movie?.oscarAwards);
  console.log('🏆 MovieDetailsPage - has awardsSummary:', !!movie?.awardsSummary);
  console.log('🏆 MovieDetailsPage - awardsSummary length:', movie?.awardsSummary?.length);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', pb: 8 }}>
      {/* Layout Híbrido - Conteúdo Principal Primeiro */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3, 
        alignItems: { xs: 'center', md: 'flex-start' },
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        pt: 3
      }}>
        
        {/* Coluna Esquerda - Pôster e Informações Complementares */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: { xs: 'center', md: 'flex-start' },
          width: { xs: '100%', md: '320px' },
          flexShrink: 0,
          order: { xs: 1, md: 1 } // Primeiro em mobile, primeiro em desktop
        }}>
          {/* Pôster do filme */}
          <Box sx={{ 
            position: 'relative', 
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            width: '100%',
            maxWidth: 280
          }}>
            <img 
              src={movie.thumbnail}
              alt={movie.title}
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block' 
              }}
            />
          </Box>

          {/* Avaliações - Visíveis apenas em desktop */}
          {(typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
          (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
          (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
          (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null) ? (
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' },
              width: '100%',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                fontWeight: 500,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '0.9rem', md: '0.95rem' }
              }}>Notas da Crítica:</Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mt: 1,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src={tmdbLogo} alt="TMDB" style={{ width: 16, height: 16 }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.vote_average).toFixed(1)}</Typography>
                  </Box>
                )}
                {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src={imdbLogo} alt="IMDB" style={{ width: 16, height: 16 }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
                  </Box>
                )}
                {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src={rtLogo} alt="Rotten Tomatoes" style={{ width: 16, height: 16 }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
                  </Box>
                )}
                {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img src={metacriticLogo} alt="Metacritic" style={{ width: 16, height: 16 }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}

          {/* Gêneros - Visíveis apenas em desktop */}
          {movie.genres && movie.genres.length > 0 && (
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' },
              width: '100%',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                fontWeight: 500,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '0.9rem', md: '0.95rem' }
              }}>Gêneros:</Typography>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {movie.genres && movie.genres.map((genre: string) => (
                  <Chip 
                    key={genre} 
                    label={String(genre)} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.8rem', 
                      height: 24,
                      bgcolor: 'transparent',
                      color: themeColor,
                      border: `1px solid ${themeColor}`,
                      '& .MuiChip-label': { px: 1 }
                    }} 
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Elenco Principal - Visível apenas em desktop */}
          {movie.mainCast && movie.mainCast.length > 0 && (
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' },
              width: '100%',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                fontWeight: 500,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '0.9rem', md: '0.95rem' }
              }}>Elenco Principal:</Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.3,
                width: '100%'
              }}>
                {movie.mainCast.slice(0, 5).map((actor: any, index: number) => (
                  <Typography 
                    key={index} 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.97rem',
                      lineHeight: 1.5,
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    <span style={{ color: 'text.secondary', fontWeight: 500 }}>{actor.actorName}</span>
                    {actor.characterName && (
                      <span style={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.85rem' }}> como {actor.characterName}</span>
                    )}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

        </Box>

        {/* Coluna Direita - Conteúdo Principal */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: { xs: 'center', md: 'flex-start' }, 
          maxWidth: { xs: '100%', md: 'calc(100% - 320px - 48px)' }, // 320px da coluna esquerda + 48px do gap
          order: { xs: 2, md: 2 } // Segundo em mobile, segundo em desktop
        }}>
          {/* Título - H1 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 1, 
            justifyContent: { xs: 'center', md: 'flex-start' } 
          }}>
            <Typography variant="h4" sx={{ 
              color: 'text.primary', 
              fontWeight: 600, 
              fontSize: { xs: '1.4rem', md: '1.6rem' }, 
              lineHeight: 1.2 
            }}>{movie.title}</Typography>
            {movie.year && (
              <Chip 
                label={String(movie.year)} 
                size="small" 
                sx={{ 
                  bgcolor: themeColor, 
                  color: '#fff', 
                  fontSize: '0.85rem', 
                  height: 24 
                }} 
              />
            )}
          </Box>

          {/* Informações Técnicas - Abaixo do título */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 0.5, sm: 1 },
            mb: 2,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            {/* Título original */}
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: '0.9rem',
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Título original: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.title}</span>
            </Typography>
            
            {/* Separador */}
            <Typography variant="body2" sx={{ 
              color: 'text.disabled', 
              display: { xs: 'none', sm: 'block' },
              fontSize: '0.9rem'
            }}>|</Typography>
            
            {/* Diretor */}
            {movie.director && (
              <>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  Diretor: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.director}</span>
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.disabled', 
                  display: { xs: 'none', sm: 'block' },
                  fontSize: '0.9rem'
                }}>|</Typography>
              </>
            )}
            
            {/* Duração */}
            {movie.runtime && (
              <>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </Typography>
                {movie.certification && (
                  <Typography variant="body2" sx={{ 
                    color: 'text.disabled', 
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '0.9rem'
                  }}>|</Typography>
                )}
              </>
            )}
            
            {/* Classificação */}
            {movie.certification && (
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                fontSize: '0.9rem',
                textAlign: { xs: 'center', md: 'left' }
              }}>
                Classificação: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.certification}</span>
              </Typography>
            )}
          </Box>

          {/* Botão Assistir Trailer */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            mb: 2
          }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => setTrailerModalOpen(true)}
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
                minWidth: { xs: '150px', md: '170px' }
              }}
            >
              Assistir Trailer
            </Button>
          </Box>

          {/* Onde assistir hoje */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600
            }}>Onde assistir hoje?</Typography>
            
            {movieData?.subscriptionPlatforms && movieData.subscriptionPlatforms.length > 0 ? (
              <StreamingPlatformsCompact 
                subscriptionPlatforms={subscriptionPlatforms}
                rentalPurchasePlatforms={rentalPurchasePlatforms}
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: { xs: 'center', md: 'flex-start' } }}>
                Nenhuma plataforma disponível no momento.
              </Typography>
            )}

            {/* Implementação manual antiga removida - substituída por StreamingPlatformsCompact */}
            {false && (
              <Box sx={{ width: '100%' }}>
                {/* Código antigo comentado para referência */}
                {(() => {
                  
                  return (
                    <>
                      {/* Plataformas de Assinatura */}
                      {subscriptionPlatforms.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            color: 'success.main',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}>
                            Assinatura
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ 
                            flexWrap: 'wrap', 
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            gap: 1
                          }}>
                            {subscriptionPlatforms.map((platform: any, index: number) => {
                              try {
                                const logoUrl = getPlatformLogoUrlMedium(platform.logoPath);
                                return (
                                  <Box key={`sub-${index}`} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: 65,
                                    height: 65,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'success.main',
                                    opacity: 0.9
                                  }}>
                                    <img 
                                      src={logoUrl} 
                                      alt={platform.name}
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        padding: '6px'
                                      }}
                                      onError={(e) => {
                                        console.error(`❌ Erro ao carregar logo de ${platform.name}:`, e);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.setAttribute('style', 'display: block');
                                      }}
                                    />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        display: 'none',
                                        fontSize: '0.7rem',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        px: 0.5
                                      }}
                                    >
                                      {platform.name}
                                    </Typography>
                                  </Box>
                                );
                              } catch (error) {
                                console.error(`❌ Erro ao processar logo de ${platform.name}:`, error);
                                return (
                                  <Box key={`sub-${index}`} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: 65,
                                    height: 65,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'success.main'
                                  }}>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontSize: '0.8rem',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        px: 0.5
                                      }}
                                    >
                                      {platform.name}
                                    </Typography>
                                  </Box>
                                );
                              }
                            })}
                          </Stack>
                        </Box>
                      )}

                      {/* Plataformas de Aluguel/Compra */}
                      {rentalPurchasePlatforms.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ 
                            mb: 1, 
                            color: 'warning.main',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}>
                            Aluguel/Compra
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ 
                            flexWrap: 'wrap', 
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            gap: 1
                          }}>
                            {rentalPurchasePlatforms.map((platform: any, index: number) => {
                              try {
                                const logoUrl = getPlatformLogoUrlMedium(platform.logoPath);
                                return (
                                  <Box key={`rental-${index}`} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: 65,
                                    height: 65,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'warning.main',
                                    opacity: 0.9
                                  }}>
                                    <img 
                                      src={logoUrl} 
                                      alt={platform.name}
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        padding: '6px'
                                      }}
                                      onError={(e) => {
                                        console.error(`❌ Erro ao carregar logo de ${platform.name}:`, e);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.setAttribute('style', 'display: block');
                                      }}
                                    />
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        display: 'none',
                                        fontSize: '0.7rem',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        px: 0.5
                                      }}
                                    >
                                      {platform.name}
                                    </Typography>
                                  </Box>
                                );
                              } catch (error) {
                                console.error(`❌ Erro ao processar logo de ${platform.name}:`, error);
                                return (
                                  <Box key={`rental-${index}`} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: 65,
                                    height: 65,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'warning.main'
                                  }}>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontSize: '0.8rem',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        px: 0.5
                                      }}
                                    >
                                      {platform.name}
                                    </Typography>
                                  </Box>
                                );
                              }
                            })}
                          </Stack>
                        </Box>
                      )}
                    </>
                  );
                })()}
              </Box>
            )}

            {/* Disclaimer */}
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              textAlign: { xs: 'center', md: 'left' },
              fontSize: '0.75rem',
              fontStyle: 'italic',
              mt: 1,
              display: 'block'
            }}>
              * Os períodos e termos de teste grátis podem variar. Consulte a plataforma para detalhes atualizados.
            </Typography>
          </Box>

          {/* Avaliações - Visíveis apenas em mobile */}
          {(typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
          (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
          (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
          (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null) ? (
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1.5, 
              mb: 2,
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                fontWeight: 500,
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>Notas da Crítica:</Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                justifyContent: 'center'
              }}>
                {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src={tmdbLogo} alt="TMDB" style={{ width: 16, height: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{Number(movie.vote_average).toFixed(1)}</Typography>
                </Box>
              )}
              {typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src={imdbLogo} alt="IMDB" style={{ width: 16, height: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{Number(movie.imdbRating).toFixed(1)}</Typography>
                </Box>
              )}
              {typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src={rtLogo} alt="Rotten Tomatoes" style={{ width: 16, height: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{Number(movie.rottenTomatoesRating).toFixed(0)}%</Typography>
                </Box>
              )}
              {typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src={metacriticLogo} alt="Metacritic" style={{ width: 16, height: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>{Number(movie.metacriticRating).toFixed(0)}</Typography>
                </Box>
              )}
              </Box>
            </Box>
          ) : null}

          {/* Gêneros - Visíveis apenas em mobile */}
          {movie.genres && movie.genres.length > 0 && (
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column', 
              alignItems: 'center',
              width: '100%',
              mb: 2
            }}>
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                fontWeight: 500,
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>Gêneros:</Typography>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                {movie.genres && movie.genres.map((genre: string) => (
                  <Chip 
                    key={genre} 
                    label={String(genre)} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.8rem', 
                      height: 24,
                      bgcolor: 'transparent',
                      color: themeColor,
                      border: `1px solid ${themeColor}`,
                      '& .MuiChip-label': { px: 1 }
                    }} 
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* A Análise Emocional do Vibesfilm */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              fontWeight: 700
            }}>A Análise Emocional do Vibesfilm</Typography>

            {/* Alerta de Conteúdo */}
            {movie?.contentWarnings && 
             movie.contentWarnings !== 'Atenção: nenhum alerta de conteúdo significativo.' && (
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="h6" component="h3" sx={{ 
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
                <Paper elevation={0} sx={{ 
                  bgcolor: 'rgba(255, 107, 53, 0.05)', 
                  color: 'text.primary',
                  p: 1.5, 
                  borderRadius: 2, 
                  border: '1px solid #ff6b3520',
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                  <span style={{ fontWeight: 600 }}>Atenção: </span>{movie.contentWarnings.replace('Atenção: ', '')}
                </Paper>
              </Box>
            )}

            {/* 1. A Vibe do Filme */}
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                color: mode === 'light' ? '#1976d2' : themeColor, 
                textAlign: { xs: 'center', md: 'left' }, 
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600
              }}>A Vibe do Filme</Typography>
              <Paper elevation={0} sx={{ 
                bgcolor: 'transparent', 
                color: 'text.secondary', 
                p: 1.5, 
                borderRadius: 2, 
                border: `1.5px solid ${themeColor}40`, 
                fontStyle: 'italic', 
                maxWidth: 700, 
                textAlign: { xs: 'center', md: 'left' }, 
                fontSize: '0.97rem' 
              }}>
                {movie.landingPageHook ? 
                  movie.landingPageHook.replace(/<[^>]*>/g, '') :
                  "Este filme oferece uma experiência cinematográfica única que vale a pena assistir."
                }
              </Paper>
            </Box>

            {/* 2. Para Quem Recomendamos? */}
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                color: mode === 'light' ? '#1976d2' : themeColor, 
                textAlign: { xs: 'center', md: 'left' }, 
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600
              }}>Para Quem Recomendamos?</Typography>
              <Paper elevation={0} sx={{ 
                bgcolor: 'transparent', 
                color: 'text.secondary', 
                p: 1.5, 
                borderRadius: 2, 
                border: `1.5px solid ${themeColor}40`, 
                fontStyle: 'italic', 
                maxWidth: 700, 
                textAlign: { xs: 'center', md: 'left' }, 
                fontSize: '0.97rem' 
              }}>
                {movie.targetAudienceForLP ? 
                  movie.targetAudienceForLP :
                  "Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única."
                }
              </Paper>
            </Box>

            {/* 3. Por que recomendamos para você? (só aparece se veio de uma jornada) */}
            {sentimentId && intentionType && reason && (
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1, 
                  color: mode === 'light' ? '#1976d2' : themeColor, 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600
                }}>
                  Por que recomendamos para <em>você</em>?
                </Typography>
                <Paper elevation={0} sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.secondary', 
                  p: 1.5, 
                  borderRadius: 2, 
                  border: `1.5px solid ${themeColor}40`, 
                  fontStyle: 'italic', 
                  maxWidth: 700, 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: '0.97rem' 
                }}>
                  {personalizedContent.content}
                </Paper>
              </Box>
            )}

            {/* 4. Tags Emocionais Chave */}
            {movie.emotionalTags && movie.emotionalTags.length > 0 && (
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1, 
                  color: mode === 'light' ? '#1976d2' : themeColor, 
                  textAlign: { xs: 'center', md: 'left' }, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600
                }}>Tags Emocionais Chave:</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  maxWidth: 700
                }}>
                  {movie.emotionalTags
                    .sort((a: any, b: any) => b.relevance - a.relevance) // Ordenar por relevância (maior para menor)
                    .slice(0, 4) // Pegar apenas as 4 mais relevantes
                    .map((tag: any, index: number) => (
                    <Box
                      key={index}
                      component="li"
                      sx={{
                        listStyle: 'none',
                        bgcolor: mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : `${themeColor}15`,
                        color: mode === 'light' ? '#1976d2' : themeColor,
                        border: `1px solid ${mode === 'light' ? 'rgba(25, 118, 210, 0.3)' : `${themeColor}30`}`,
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      {tag.subSentiment}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Sinopse */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 0.5, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600
            }}>Sinopse</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, textAlign: { xs: 'center', md: 'left' }, fontSize: '0.97rem', lineHeight: 1.5 }}>
              {movie.description || 'Sinopse não disponível.'}
            </Typography>
          </Box>

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Elenco Principal - Visível apenas em mobile */}
          {movie.mainCast && movie.mainCast.length > 0 && (
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column', 
              alignItems: 'center',
              width: '100%',
              mb: 1.2
            }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                textAlign: 'center', 
                fontSize: '1rem',
                fontWeight: 600
              }}>Elenco Principal</Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.3,
                width: '100%',
                maxWidth: 700
              }}>
                {movie.mainCast.slice(0, 5).map((actor: any, index: number) => (
                  <Typography 
                    key={index} 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.97rem',
                      lineHeight: 1.5,
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ color: 'text.secondary', fontWeight: 500 }}>{actor.actorName}</span>
                    {actor.characterName && (
                      <span style={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.85rem' }}> como {actor.characterName}</span>
                    )}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Premiações - Compacto */}
          {movie.oscarAwards && (movie.oscarAwards.totalWins > 0 || movie.oscarAwards.totalNominations > 0) && (
            <Box sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1.5, 
                color: mode === 'light' ? '#1976d2' : '#fff',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600
              }}>
                Premiações
              </Typography>
              <OscarRecognition 
                movieTitle={movie.title}
                oscarAwards={movie.oscarAwards}
              />
            </Box>
          )}
          
          {/* Fallback para awardsSummary se não tiver oscarAwards */}
          {!movie.oscarAwards && movie.awardsSummary && movie.awardsSummary.trim() !== '' && (
            // Se não tem Oscar mas tem awardsSummary, mostrar seção de Premiações
            <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 0.5, 
                color: mode === 'light' ? '#1976d2' : '#fff', 
                textAlign: 'center', 
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Premiações e Reconhecimento
              </Typography>
              <Box sx={{ textAlign: 'center', maxWidth: 700 }}>
                {(() => {
                  const { firstLine, secondLine } = formatAwardsForDisplay(movie.awardsSummary!);
                  return (
                    <Box>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.97rem',
                        lineHeight: 1.5,
                        textAlign: 'center'
                      }}>
                        {firstLine}
                      </Typography>
                      {secondLine && (
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.97rem',
                          lineHeight: 1.5,
                          textAlign: 'center'
                        }}>
                          {secondLine}
                        </Typography>
                      )}
                    </Box>
                  );
                })()}
              </Box>
            </Box>
          )}

          {/* Filmes com Vibe Similar */}
          {similarMovies.length > 0 && (
            <Box sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1.5, 
                color: mode === 'light' ? '#1976d2' : '#fff',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600
              }}>
                {similarMovies[0]?.displayTitle || 'Filmes com Vibe Similar'}
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 2, 
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}>
                Baseado na análise emocional, estes filmes têm uma vibe parecida:
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: 'repeat(3, 1fr)', 
                  sm: 'repeat(4, 1fr)', 
                  md: 'repeat(6, 1fr)' 
                }, 
                gap: 1.5,
                maxWidth: '100%'
              }}>
                {similarMovies.map((similarMovie) => (
                  <Box
                    key={similarMovie.id}
                    onClick={() => navigate(`/app/onde-assistir/${similarMovie.id}`)}
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
                          bgcolor: 'grey.300',
                          color: 'grey.500'
                        }}>
                          <Typography variant="caption">Sem imagem</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ 
                      p: 0.8, 
                      bgcolor: 'background.paper',
                      borderRadius: '0 0 4px 4px'
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                        mb: 0.2
                      }}>
                        {similarMovie.title}
                      </Typography>
                      {similarMovie.year && (
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.7rem'
                        }}>
                          {similarMovie.year}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

        </Box>
      </Box>

      {/* Barra de navegação fixa (botões padrão) */}
      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, bgcolor: 'background.paper', borderTop: `2px solid ${themeColor}`, py: 2, display: 'flex', justifyContent: 'center', gap: 2, zIndex: 10 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" sx={{ px: 4, borderWidth: 1 }} onClick={() => window.history.back()}>
            Filmes
          </Button>
          <Button variant="outlined" color="primary" sx={{ px: 4, borderWidth: 1 }} href="/app">
            Home
          </Button>
        </Stack>
      </Box>

      {/* Modal do Trailer */}
      <Modal
        open={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        aria-labelledby="trailer-modal-title"
        aria-describedby="trailer-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          position: 'relative',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '900px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden'
        }}>
          {/* Botão de fechar */}
          <IconButton
            onClick={() => setTrailerModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Container do vídeo */}
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
            {movie?.mainTrailer ? (
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
            ) : (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
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

          {/* Informações do trailer */}
          {movie?.mainTrailer && (
            <Box sx={{ 
              p: 2, 
              textAlign: 'center',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                {movie.mainTrailer.name} • {movie.mainTrailer.language === 'pt-BR' ? 'Dublado' : 
                  movie.mainTrailer.language === 'pt' ? 'Legendado' : 
                  movie.mainTrailer.language === 'en' ? 'Original' : movie.mainTrailer.language}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieDetailsPage; 
