import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  useTheme,
  Skeleton,
  IconButton
} from '@mui/material';
import { ArrowBack, Check } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStreamingPlatforms, getPlatformLogoUrl, StreamingPlatform } from '../services/streaming.service';
import { useThemeManager } from '../contexts/ThemeContext';

interface StreamingFiltersProps { }

export interface StreamingFilters {
  subscriptionPlatforms: Array<{ name: string, category: string }>;
}

// Helper para formatar nomes longos exatamente como no app iOS (movies_emotion)
const formatPlatformName = (name: string): string => {
  if (!name) return name;
  const lowerName = name.toLowerCase().trim();
  if (lowerName === 'globoplay' || lowerName === 'globo play') return 'Globo\nPlay';
  if (lowerName === 'paramount+') return 'Para\nmount+';
  if (lowerName === 'claro video') return 'Claro\nVideo';
  if (lowerName === 'apple tv+' || lowerName === 'apple tv') return 'Apple\nTV+';
  if (lowerName === 'prime video') return 'Prime\nVideo';
  if (lowerName === 'mercado play') return 'Mercado\nPlay';
  if (lowerName === 'hbo max' || lowerName === 'max') return 'HBO\nMax';
  return name;
};

const StreamingFilters: React.FC<StreamingFiltersProps> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectSentimentTheme } = useThemeManager();

  const [selectedSubscriptionPlatforms, setSelectedSubscriptionPlatforms] = useState<string[]>(() => {
    const existing = location.state?.streamingFilters?.subscriptionPlatforms;
    if (Array.isArray(existing) && existing.length > 0) {
      return existing.map((p: any) => (typeof p === 'string' ? p : p.name));
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [allPlatforms, setAllPlatforms] = useState<Array<{ name: string, id: number, category: string, logoPath: string | null }>>([]);
  const [platformMovieCounts, setPlatformMovieCounts] = useState<Record<number, number>>({});

  // Atualizar tema baseado no sentimento escolhido na jornada
  useEffect(() => {
    const sentimentId = location.state?.journeyContext?.selectedSentiment?.id;
    if (sentimentId) {
      selectSentimentTheme(sentimentId);
    }
  }, [location.state, selectSentimentTheme]);

  // Carregar plataformas dinâmicas da API seguindo exatamente as regras do app iOS
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const platforms: StreamingPlatform[] = await getStreamingPlatforms();
        const movieSuggestions = location.state?.movieSuggestions || [];

        // Regra do App iOS: Filtrar apenas plataformas de assinatura, híbridas e gratuitas (não-HIDDEN e sem marcas de loja/aluguel)
        const isRentalOrStore = (name: string, cat: string) => {
          const lowerName = (name || '').toLowerCase();
          const upperCat = (cat || '').toUpperCase();
          return (
            upperCat === 'RENTAL_PURCHASE_PRIMARY' ||
            lowerName.includes('(loja)') ||
            lowerName.includes('(aluguel)') ||
            lowerName.includes(' store')
          );
        };

        const subscriptionPlatforms = platforms.filter(
          p => (p.category === 'SUBSCRIPTION_PRIMARY' || p.category === 'HYBRID' || p.category === 'FREE_PRIMARY') &&
            p.showFilter !== 'HIDDEN' &&
            !isRentalOrStore(p.name, p.category)
        );

        const platformMap = new Map<string, { name: string, id: number, category: string, logoPath: string | null }>();

        subscriptionPlatforms.forEach(p => {
          const key = p.name.toLowerCase().trim();
          platformMap.set(key, {
            name: p.name,
            id: p.id,
            category: p.category,
            logoPath: p.logoPath
          });
        });

        // Garantir inclusão de plataformas presentes nos filmes da jornada ignorando plataformas de aluguel/loja pura
        movieSuggestions.forEach((suggestion: any) => {
          const moviePlatforms = suggestion.movie?.platforms || [];
          moviePlatforms.forEach((mp: any) => {
            const sp = mp.streamingPlatform;
            if (sp && sp.name) {
              const key = sp.name.toLowerCase().trim();
              if (!platformMap.has(key) && !isRentalOrStore(sp.name, sp.category)) {
                platformMap.set(key, {
                  name: sp.name,
                  id: sp.id || Math.floor(Math.random() * 100000) + 1000,
                  category: sp.category || 'SUBSCRIPTION_PRIMARY',
                  logoPath: sp.logoPath || null
                });
              }
            }
          });
        });

        setAllPlatforms(Array.from(platformMap.values()));
      } catch (error) {
        console.error('❌ Erro ao carregar plataformas:', error);
        setAllPlatforms([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlatforms();
  }, [location.state]);

  // Contar filmes por plataforma usando as regras do app iOS (fetchMovieCountsByPlatform)
  useEffect(() => {
    if (allPlatforms.length === 0) return;

    try {
      const movieSuggestions = location.state?.movieSuggestions;
      if (!movieSuggestions || movieSuggestions.length === 0) return;

      const counts: Record<number, number> = {};

      allPlatforms.forEach(platform => {
        let count = 0;
        const targetName = platform.name.toLowerCase().trim();
        const targetPlatformCategory = (platform.category || '').toUpperCase().trim();

        const isKnownRentalPlatform =
          targetName.includes('mercado') ||
          targetName.includes('apple tv');

        movieSuggestions.forEach((suggestion: any) => {
          const moviePlatforms = suggestion.movie?.platforms || [];
          if (moviePlatforms.length > 0) {
            const hasPlatform = moviePlatforms.some((moviePlatform: any) => {
              const platformName = (moviePlatform.streamingPlatform?.name || '').toLowerCase().trim();
              const moviePlatformCategory = (moviePlatform.streamingPlatform?.category || '').toUpperCase().trim();
              if (!platformName || !targetName) return false;

              const isNameMatch = platformName === targetName ||
                platformName.includes(targetName) ||
                targetName.includes(platformName);

              if (!isNameMatch) return false;

              const isRentalPurchasePlatform =
                moviePlatformCategory === 'FREE_PRIMARY' ||
                moviePlatformCategory === 'RENTAL_PURCHASE_PRIMARY' ||
                targetPlatformCategory === 'FREE_PRIMARY' ||
                targetPlatformCategory === 'RENTAL_PURCHASE_PRIMARY' ||
                isKnownRentalPlatform;

              const accessType = moviePlatform.accessType || '';

              return (
                accessType === 'INCLUDED_WITH_SUBSCRIPTION' ||
                accessType === 'FREE_WITH_ADS' ||
                (isRentalPurchasePlatform && (accessType === 'RENTAL' || accessType === 'PURCHASE'))
              );
            });

            if (hasPlatform) count++;
          }
        });

        counts[platform.id] = count;
      });

      setPlatformMovieCounts(counts);
    } catch (error) {
      console.error('❌ Erro ao contar filmes por plataforma:', error);
    }
  }, [allPlatforms, location.state]);

  // Filtrar e ordenar plataformas: APENAS plataformas com filmes disponíveis (count > 0), ordenadas decrescentemente por filmes
  const sortedPlatforms = useMemo(() => {
    return allPlatforms
      .filter(platform => (platformMovieCounts[platform.id] || 0) > 0)
      .sort((a, b) => {
        const countA = platformMovieCounts[a.id] || 0;
        const countB = platformMovieCounts[b.id] || 0;

        if (countA !== countB) return countB - countA;
        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [allPlatforms, platformMovieCounts]);

  const handleSubscriptionPlatformChange = (platformName: string) => {
    setSelectedSubscriptionPlatforms(prev =>
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleContinue = () => {
    const selectedPlatformsData = allPlatforms.filter(p => selectedSubscriptionPlatforms.includes(p.name));

    const filters: StreamingFilters = {
      subscriptionPlatforms: selectedPlatformsData.map(p => ({ name: p.name, category: p.category }))
    };

    const selectedOptionText = location.state?.selectedOptionText ||
      (location.state?.movieSuggestions?.length > 0 && location.state.movieSuggestions[0].journeyOptionFlow
        ? location.state.movieSuggestions[0].journeyOptionFlow.text
        : null);

    navigate('/suggestions', {
      state: {
        ...location.state,
        streamingFilters: filters,
        selectedOptionText: selectedOptionText
      }
    });
  };

  const handleSeeAllMovies = () => {
    const selectedOptionText = location.state?.selectedOptionText ||
      (location.state?.movieSuggestions?.length > 0 && location.state.movieSuggestions[0].journeyOptionFlow
        ? location.state.movieSuggestions[0].journeyOptionFlow.text
        : null);

    navigate('/suggestions', {
      state: {
        ...location.state,
        streamingFilters: { subscriptionPlatforms: [] },
        selectedOptionText: selectedOptionText
      }
    });
  };

  const handleBack = () => {
    const journeyContext = location.state?.journeyContext;

    if (journeyContext) {
      navigate('/intro', {
        state: {
          restoreJourney: true,
          selectedSentiment: journeyContext.selectedSentiment,
          selectedIntention: journeyContext.selectedIntention,
          journeyType: journeyContext.journeyType
        }
      });
    } else {
      navigate(-1);
    }
  };

  const selectedOptionText = location.state?.selectedOptionText ||
    (location.state?.movieSuggestions?.length > 0 && location.state.movieSuggestions[0].journeyOptionFlow
      ? location.state.movieSuggestions[0].journeyOptionFlow.text
      : null);

  const primaryColor = theme.palette.primary.main;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
      {/* Top Header com botão de voltar e título centralizado */}
      <Box sx={{ position: 'relative', mb: 2, textAlign: 'center' }}>
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            width: 38,
            height: 38,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.16)'
            }
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            pt: 0.5,
            fontSize: { xs: '1.2rem', sm: '1.4rem' },
            fontWeight: 700,
            color: '#FFFFFF'
          }}
        >
          Onde você assiste?
        </Typography>

        {selectedOptionText && (
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.3,
              px: 1
            }}
          >
            Sugestões para:{' '}
            <Box
              component="span"
              sx={{
                color: primaryColor,
                fontWeight: 600
              }}
            >
              "{selectedOptionText}"
            </Box>
          </Typography>
        )}
      </Box>

      {/* Grid de Plataformas (4 colunas no mobile xs={3}, 5 colunas no desktop sm={2.4}) */}
      <Box sx={{ mb: 3 }}>
        {isLoading ? (
          <Grid container spacing={1.2}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Grid item xs={3} sm={2.4} key={i}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: '12px',
                    aspectRatio: '1 / 1',
                    maxHeight: '90px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={1.2} justifyContent="center">
            {sortedPlatforms.map((platform) => {
              const movieCount = platformMovieCounts[platform.id] || 0;
              const hasMovies = movieCount > 0;
              const isSelected = selectedSubscriptionPlatforms.includes(platform.name);
              const logoUrl = getPlatformLogoUrl(platform.logoPath || null, 'w92', platform.name);

              return (
                <Grid item xs={3} sm={2.4} md={2.4} key={platform.id}>
                  <Box
                    onClick={() => hasMovies && handleSubscriptionPlatformChange(platform.name)}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      maxHeight: { xs: '85px', sm: '95px' },
                      mx: 'auto',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 0.8,
                      textAlign: 'center',
                      cursor: hasMovies ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: isSelected
                        ? `${primaryColor}22`
                        : hasMovies
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected
                        ? `2px solid ${primaryColor}`
                        : hasMovies
                          ? '1px solid rgba(255, 255, 255, 0.12)'
                          : '1px solid rgba(255, 255, 255, 0.04)',
                      opacity: hasMovies ? 1 : 0.35,
                      userSelect: 'none',
                      '&:hover': hasMovies ? {
                        transform: 'scale(1.03)',
                        borderColor: isSelected ? primaryColor : 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: isSelected ? `${primaryColor}30` : 'rgba(255, 255, 255, 0.08)'
                      } : {}
                    }}
                  >
                    {/* Badge com a contagem de filmes (no canto superior esquerdo) */}
                    {hasMovies && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 5,
                          left: 5,
                          backgroundColor: primaryColor,
                          color: '#000000',
                          borderRadius: '50%',
                          width: 19,
                          height: 19,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          zIndex: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {movieCount}
                      </Box>
                    )}

                    {/* Checkmark verde no canto superior direito quando selecionado */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: primaryColor,
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          width: 17,
                          height: 17,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2
                        }}
                      >
                        <Check sx={{ fontSize: 11 }} />
                      </Box>
                    )}

                    {/* Logo da plataforma se disponível */}
                    {logoUrl ? (
                      <Box
                        component="img"
                        src={logoUrl}
                        alt={platform.name}
                        sx={{
                          width: { xs: 40, sm: 34 },
                          height: { xs: 40, sm: 34 },
                          objectFit: 'contain',
                          mb: { xs: 0, sm: 0.4 },
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                        }}
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Nome da plataforma formatado (oculto no mobile quando há logo disponível) */}
                    <Typography
                      variant="body2"
                      sx={{
                        display: logoUrl ? { xs: 'none', sm: 'block' } : 'block',
                        fontSize: { xs: '0.65rem', sm: '0.725rem' },
                        fontWeight: isSelected ? 700 : 500,
                        color: hasMovies ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                        lineHeight: 1.1,
                        whiteSpace: 'pre-line',
                        textAlign: 'center'
                      }}
                    >
                      {formatPlatformName(platform.name)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Seção Inferior: Instrução / Status de Seleção + Botões */}
      <Box sx={{ textAlign: 'center', maxWidth: '440px', mx: 'auto' }}>
        <Typography
          variant="body2"
          sx={{
            color: selectedSubscriptionPlatforms.length > 0 ? primaryColor : 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.825rem', sm: '0.875rem' },
            mb: 1.5,
            fontWeight: selectedSubscriptionPlatforms.length > 0 ? 600 : 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5
          }}
        >
          {selectedSubscriptionPlatforms.length > 0 ? (
            <>
              <Check sx={{ fontSize: 15 }} />
              {`${selectedSubscriptionPlatforms.length} ${selectedSubscriptionPlatforms.length === 1 ? 'plataforma selecionada' : 'plataformas selecionadas'}`}
            </>
          ) : (
            'Selecione plataformas ou veja todos os filmes'
          )}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {/* Botão Secundário - Ver todos os filmes */}
          <Button
            variant="outlined"
            onClick={handleSeeAllMovies}
            fullWidth
            sx={{
              py: 1.1,
              borderRadius: '12px',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            Ver todos os filmes
          </Button>

          {/* Botão Principal - Ver Sugestões */}
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={selectedSubscriptionPlatforms.length === 0}
            fullWidth
            sx={{
              py: 1.1,
              borderRadius: '12px',
              backgroundColor: primaryColor,
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: selectedSubscriptionPlatforms.length > 0 ? `0 4px 14px ${primaryColor}40` : 'none',
              transition: 'all 0.2s ease',
              '&.Mui-disabled': {
                backgroundColor: primaryColor,
                opacity: 0.4,
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '&:hover': {
                backgroundColor: primaryColor,
                opacity: 0.9,
                boxShadow: `0 6px 18px ${primaryColor}60`
              }
            }}
          >
            {selectedSubscriptionPlatforms.length > 0
              ? `Ver Sugestões (${selectedSubscriptionPlatforms.length})`
              : 'Ver Sugestões'
            }
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StreamingFilters;