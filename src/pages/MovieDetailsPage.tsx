import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Chip, Divider, Stack, Paper, Button } from '@mui/material';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import tmdbLogo from '../assets/themoviedb.svg';
import imdbLogo from '../assets/imdb.png';
import rtLogo from '../assets/rottentomatoes.png';
import metacriticLogo from '../assets/metascore.svg';
import { getPlatformLogoUrlMedium } from '../services/streaming.service';

const MovieDetailsPage: React.FC = () => {
  const { mode } = useThemeManager();
  const location = useLocation();
  const { identifier } = useParams();
  const movieId = identifier; // Usar o novo parâmetro unificado
  const state = location.state || {};
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
          : 'http://localhost:3001'
        
        // Detectar se é UUID ou slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
        
        // Usar rota diferente baseada no tipo de identificador
        const endpoint = isUUID ? 'details' : 'hero';
        const response = await fetch(`${baseURL}/api/movie/${movieId}/${endpoint}`);
        
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
        title: "Por que assistir este filme?",
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
      title: "Por que assistir este filme?",
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

          {/* Informações Técnicas - Visíveis apenas em desktop */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' },
            width: '100%'
          }}>
            {/* Diretor */}
            {movie.director && (
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: 'text.secondary',
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '0.9rem', md: '0.95rem' }
              }}>
                Diretor: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.director}</span>
              </Typography>
            )}

            {/* Duração e Classificação */}
            {(movie.runtime || movie.certification) && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 0.5,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
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
                  <Chip label={movie.certification} size="small" sx={{ bgcolor: themeColor, color: '#fff', fontSize: '0.85rem', height: 22 }} />
                )}
              </Box>
            )}

            {/* Avaliações */}
            {(typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
            (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
            (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
            (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null) ? (
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
            ) : null}
          </Box>

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
                    label={genre} 
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
          {/* Título e ano - H1 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'baseline', 
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
                label={movie.year} 
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

          {/* Informações Técnicas - Visíveis apenas em mobile */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            mb: 2
          }}>
            {/* Diretor */}
            {movie.director && (
              <Typography variant="body2" sx={{ 
                mb: 0.5, 
                color: 'text.secondary',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                Diretor: <span style={{ color: themeColor, fontWeight: 500 }}>{movie.director}</span>
              </Typography>
            )}

            {/* Duração e Classificação */}
            {(movie.runtime || movie.certification) && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 0.5,
                justifyContent: 'center'
              }}>
                {movie.runtime && (
                  <>
                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                    </Typography>
                    {movie.certification && (
                      <Typography variant="body2" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                    )}
                  </>
                )}
                {movie.certification && (
                  <Chip label={movie.certification} size="small" sx={{ bgcolor: themeColor, color: '#fff', fontSize: '0.85rem', height: 22 }} />
                )}
              </Box>
            )}

            {/* Avaliações */}
            {(typeof movie.vote_average !== 'undefined' && movie.vote_average !== null) ||
            (typeof movie.imdbRating !== 'undefined' && movie.imdbRating !== null) ||
            (typeof movie.rottenTomatoesRating !== 'undefined' && movie.rottenTomatoesRating !== null) ||
            (typeof movie.metacriticRating !== 'undefined' && movie.metacriticRating !== null) ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mt: 1,
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
            ) : null}
          </Box>

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
                    label={genre} 
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

          {/* Por que assistir este filme? */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 0.5, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600
            }}>{personalizedContent.title}</Typography>
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

          {/* Linha horizontal na cor do sentimento */}
          <Divider sx={{ borderColor: themeColor, opacity: 0.7, mb: 1.2, width: '100%' }} />

          {/* Para quem pode ser recomendado esse filme? */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 0.5, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600
            }}>Por que recomendamos este filme?</Typography>
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
                `Este filme foi cuidadosamente selecionado para oferecer uma experiência cinematográfica única.`
              }
              
              {/* Tags Emocionais */}
              {movie.emotionalTags && movie.emotionalTags.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: mode === 'light' ? '#1976d2' : themeColor,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    Tags Emocionais Chave:
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {movie.emotionalTags.slice(0, 6).map((tag: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.8rem', 
                          height: 24,
                          bgcolor: mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : `${themeColor}15`,
                          color: mode === 'light' ? '#1976d2' : themeColor,
                          border: `1px solid ${mode === 'light' ? 'rgba(25, 118, 210, 0.3)' : `${themeColor}30`}`,
                          '& .MuiChip-label': { px: 1 }
                        }} 
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
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

          {/* Disponível em */}
          <Box sx={{ mb: 1.2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 0.5, 
              color: mode === 'light' ? '#1976d2' : '#fff', 
              textAlign: { xs: 'center', md: 'left' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600
            }}>Disponível em:</Typography>
            
            {movieData?.subscriptionPlatforms && movieData.subscriptionPlatforms.length > 0 ? (
              <Stack direction="row" spacing={1} sx={{ 
                flexWrap: 'wrap', 
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 1
              }}>
                {movieData.subscriptionPlatforms.map((platform: any, index: number) => {
                  try {
                    const logoUrl = getPlatformLogoUrlMedium(platform.logoPath);
                    return (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 65,
                        height: 65,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
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
                            // Fallback para texto se a imagem falhar
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
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 65,
                        height: 65,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
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
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: { xs: 'center', md: 'left' } }}>
                Nenhuma plataforma disponível no momento.
              </Typography>
            )}
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
