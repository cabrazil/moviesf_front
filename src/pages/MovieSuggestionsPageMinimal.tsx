import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Chip, Grid, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import MovieCard from '../components/movie-suggestions/MovieCard';
import {
  getDiversityScore,
  getSentimentColor,
  getSelectedOptionText
} from '../components/movie-suggestions/movieHelpers';

const MovieSuggestionsPageMinimal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const journeyContext = location.state?.journeyContext;
  const streamingFilters = location.state?.streamingFilters;
  const [currentPage, setCurrentPage] = useState(0);
  const [sortType, setSortType] = useState<'smart' | 'rating' | 'year' | 'relevance'>('relevance');
  const [relevanceSeed, setRelevanceSeed] = useState(0);
  const [mobileDisplayLimit, setMobileDisplayLimit] = useState(12);

  const { mode } = useThemeManager();
  const currentSentimentColors = useMemo(() =>
    mode === 'dark' ? darkSentimentColors : lightSentimentColors,
    [mode]
  );

  // Memoizar cor do sentimento
  const sentimentColor = useMemo(() =>
    getSentimentColor(journeyContext, location.state, currentSentimentColors),
    [journeyContext, location.state, currentSentimentColors]
  );

  // Memoizar texto da opção selecionada
  const selectedOptionText = useMemo(() =>
    getSelectedOptionText(location.state, journeyContext),
    [location.state, journeyContext]
  );

  // Scroll para o topo quando o componente for carregado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset da página quando os filtros ou ordenação mudarem
  useEffect(() => {
    if (!isMobile) {
      setCurrentPage(0);
    } else {
      setMobileDisplayLimit(12);
    }
  }, [sortType, isMobile]);

  // Salvar journeyContext no localStorage como backup
  useEffect(() => {
    if (journeyContext) {
      localStorage.setItem('journeyContext', JSON.stringify(journeyContext));
      if (process.env.NODE_ENV === 'development') {
        console.log('💾 JourneyContext salvo no localStorage:', journeyContext);
      }
    }
  }, [journeyContext]);

  const MOVIES_PER_PAGE = 4;

  // Filtrar filmes baseado em plataformas de streaming (memoizado)
  const filteredSuggestions = useMemo((): MovieSuggestionFlow[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Filtros aplicados:', {
        isMobile,
        streamingFilters,
        movieSuggestionsCount: movieSuggestions.length,
      });
    }

    const result = movieSuggestions.filter(suggestion => {
      // Filtro por plataformas de streaming (se aplicável)
      if (streamingFilters) {
        const hasNoFilters = streamingFilters.subscriptionPlatforms.length === 0;

        if (hasNoFilters) {
          return true;
        }

        const movieStreamingPlatforms = (suggestion.movie as any).platforms || [];

        if (movieStreamingPlatforms.length === 0) return false;

        const hasSelectedPlatform = movieStreamingPlatforms.some((platform: any) => {
          const platformName = platform.streamingPlatform?.name || '';
          const accessType = platform.accessType || '';

          // Verificar plataformas de assinatura
          if (streamingFilters.subscriptionPlatforms.length > 0) {
            const selectedPlatformInfo = (streamingFilters.subscriptionPlatforms as any[]).find((p: any) => {
              const platformData = typeof p === 'string' ? { name: p, category: '' } : p;
              const cleanSelectedPlatform = platformData.name.toLowerCase().trim();
              const cleanPlatformName = platformName.toLowerCase().trim();
              return cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
            });

            if (selectedPlatformInfo) {
              const moviePlatformCategory = (platform.streamingPlatform?.category || '').toUpperCase().trim();
              const filterPlatformCategory = (typeof selectedPlatformInfo === 'object' ? (selectedPlatformInfo as any).category : '').toUpperCase().trim();
              const platformName = (platform.streamingPlatform?.name || '').toLowerCase().trim();
              
              const isKnownRentalPlatform = 
                platformName.includes('mercado') || 
                platformName.includes('apple tv');

              const isRentalPurchasePlatform = 
                moviePlatformCategory === 'FREE_PRIMARY' || 
                moviePlatformCategory === 'RENTAL_PURCHASE_PRIMARY' ||
                filterPlatformCategory === 'FREE_PRIMARY' ||
                filterPlatformCategory === 'RENTAL_PURCHASE_PRIMARY' ||
                isKnownRentalPlatform;
              
              if (accessType === 'INCLUDED_WITH_SUBSCRIPTION' || 
                  accessType === 'FREE_WITH_ADS' ||
                  (isRentalPurchasePlatform && (accessType === 'RENTAL' || accessType === 'PURCHASE'))) {
                return true;
              }
            }
          }

          // Verificar plataformas de aluguel/compra
          if (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0) {
            const isRentalPurchasePlatform = streamingFilters.rentalPurchasePlatforms.some((selectedPlatform: string) => {
              const cleanSelectedPlatform = selectedPlatform
                .replace(' (Aluguel/Compra)', '')
                .replace(' (Aluguel/Compra/Gratuito)', '')
                .toLowerCase()
                .trim();
              const cleanPlatformName = platformName.toLowerCase().trim();

              return cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
            });

            if (isRentalPurchasePlatform && (accessType === 'PURCHASE' || accessType === 'RENTAL')) {
              return true;
            }
          }

          return false;
        });

        return hasSelectedPlatform;
      }

      return true;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Resultado dos filtros:', {
        isMobile,
        totalMovies: movieSuggestions.length,
        filteredMovies: result.length,
        streamingFiltersApplied: !!streamingFilters
      });
    }

    return result;
  }, [movieSuggestions, streamingFilters, isMobile]);

  // 1. Ordenar e preparar sugestões (incluindo Rotação e Shuffle de Elite)
  const sortedSuggestions = useMemo(() => {
    // 1. Aplicar pontuações base de relevância e recência
    const baseSuggestions = filteredSuggestions.map(suggestion => {
      let finalScore = (suggestion as any).relevanceScore ? Number((suggestion as any).relevanceScore) : 0;
      
      // Boost de Recência (gradativo 2013-2025)
      const year = suggestion.movie.year || 0;
      if (year >= 2022) finalScore += 0.30;
      else if (year >= 2018) finalScore += 0.15;
      else if (year >= 2013) finalScore += 0.05;
      
      // Aplicar Jitter determinístico baseado no Seed (0.0 a 0.5)
      // Usamos o ID do filme como base para que o jitter seja consistente na mesma "rodada"
      const movieHash = suggestion.movie.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const jitterFactor = ((movieHash + relevanceSeed) % 100) / 200; // Máximo 0.5
      finalScore += jitterFactor;

      return { ...suggestion, finalCalculatedScore: finalScore };
    });

    // 2. Ordenação Primária
    if (sortType === 'relevance') {
      // Agrupar por SubSentimento principal para o Round-Robin
      const groups: Record<string, typeof baseSuggestions> = {};
      
      baseSuggestions.forEach(s => {
        // Pega o SubSentiment mais relevante (o primeiro da lista retornada pelo backend)
        const primarySub = s.movie.movieSentiments?.[0]?.subSentiment?.name || 'Geral';
        if (!groups[primarySub]) groups[primarySub] = [];
        groups[primarySub].push(s);
      });

      // Ordenar dentro de cada grupo por score
      Object.values(groups).forEach(group => {
        group.sort((a, b) => (b as any).finalCalculatedScore - (a as any).finalCalculatedScore);
      });

      // Algoritmo Smart Round-Robin para Diversidade
      const result: typeof baseSuggestions = [];
      const subNames = Object.keys(groups).sort((a, b) => {
        const scoreA = groups[a][0].finalCalculatedScore;
        const scoreB = groups[b][0].finalCalculatedScore;
        return scoreB - scoreA;
      });

      let hasMore = true;
      let depth = 0;
      while (hasMore) {
        hasMore = false;
        subNames.forEach(name => {
          if (groups[name][depth]) {
            result.push(groups[name][depth]);
            hasMore = true;
          }
        });
        depth++;
      }
      return result;
    }

    // Outros tipos de ordenação (Legado/Tradicional)
    const sorted = [...baseSuggestions].sort((a, b) => {
      switch (sortType) {
        case 'smart':
          const scoreA = getDiversityScore(a);
          const scoreB = getDiversityScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          break;

        case 'rating':
          const aRating = a.movie.imdbRating !== null && a.movie.imdbRating !== undefined ? Number(a.movie.imdbRating) : -Infinity;
          const bRating = b.movie.imdbRating !== null && b.movie.imdbRating !== undefined ? Number(b.movie.imdbRating) : -Infinity;
          if (bRating !== aRating) return bRating - aRating;
          break;

        case 'year':
          const aYear = a.movie.year || 0;
          const bYear = b.movie.year || 0;
          if (bYear !== aYear) return bYear - aYear;
          break;
      }
      return a.movie.title.localeCompare(b.movie.title, 'pt-BR');
    });

    return sorted;
  }, [filteredSuggestions, isMobile, sortType, relevanceSeed]);

  // 2. Paginar sugestões para exibição
  const { totalPages, displaySuggestions } = useMemo(() => {
    if (isMobile) {
      return {
        totalPages: 1,
        displaySuggestions: sortedSuggestions.slice(0, mobileDisplayLimit)
      };
    }

    const total = Math.ceil(sortedSuggestions.length / MOVIES_PER_PAGE);
    const start = currentPage * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;
    const display = sortedSuggestions.slice(start, end);

    return {
      totalPages: total,
      displaySuggestions: display
    };
  }, [sortedSuggestions, isMobile, mobileDisplayLimit, currentPage]);

  // Callbacks memoizados
  const handleRestart = useCallback(() => {
    navigate('/app');
  }, [navigate]);

  const handleBack = useCallback(() => {
    const hasOriginalMovies = movieSuggestions.length > 0;

    if (!hasOriginalMovies) {
      navigate('/');
      return;
    }

    const hasStreamingFilters = streamingFilters && (
      streamingFilters.subscriptionPlatforms.length > 0 ||
      (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0)
    );

    if (hasStreamingFilters) {
      navigate('/filters', {
        state: {
          ...location.state,
          journeyContext: journeyContext || location.state?.journeyContext
        }
      });
      return;
    }

    let contextToPass = journeyContext || location.state?.journeyContext;

    if (!contextToPass) {
      try {
        const savedContext = localStorage.getItem('journeyContext');
        if (savedContext) {
          const parsedContext = JSON.parse(savedContext);
          const isValidContext = parsedContext &&
            parsedContext.selectedSentiment &&
            parsedContext.selectedSentiment.id &&
            parsedContext.selectedIntention &&
            parsedContext.selectedIntention.id &&
            typeof parsedContext.selectedSentiment.id === 'number' &&
            typeof parsedContext.selectedIntention.id === 'number';

          if (isValidContext) {
            contextToPass = parsedContext;
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Erro ao recuperar contexto do localStorage:', error);
        }
      }
    }

    if (contextToPass) {
      navigate('/intro', {
        state: {
          restoreJourney: true,
          selectedSentiment: contextToPass.selectedSentiment,
          selectedIntention: contextToPass.selectedIntention,
          journeyType: contextToPass.journeyType
        }
      });
    } else {
      navigate('/intro');
    }
  }, [navigate, movieSuggestions.length, streamingFilters, journeyContext, location.state]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const handleSortChange = useCallback((newSortType: 'smart' | 'rating' | 'year' | 'relevance') => {
    if (newSortType === 'relevance' && sortType === 'relevance') {
      // Incrementar o seed para forçar um novo jitter se o usuário clicar de novo em Recomendado
      setRelevanceSeed(prev => prev + 1);
    }
    setSortType(newSortType);
  }, [sortType]);


  if (!displaySuggestions.length) {
    const hasOriginalMovies = movieSuggestions.length > 0;
    const hasStreamingFilters = streamingFilters && (
      streamingFilters.subscriptionPlatforms.length > 0 ||
      (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0)
    );

    return (
      <Container maxWidth="lg">
        <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {hasOriginalMovies && (!hasStreamingFilters)
              ? 'Nenhum filme encontrado com os filtros atuais.'
              : 'Nenhuma sugestão de filme encontrada.'
            }
          </Typography>

          {hasOriginalMovies && (!hasStreamingFilters) ? (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {'Tente ajustar os filtros de plataformas de streaming para ver mais filmes.'}
            </Typography>
          ) : null}

          <Button
            variant="contained"
            onClick={hasOriginalMovies ? handleBack : handleRestart}
            sx={{ mt: 4 }}
          >
            {hasOriginalMovies ? 'Voltar' : 'Voltar ao Início'}
          </Button>
        </Box>
      </Container>
    );
  }

  const hasActiveFilters = streamingFilters && (
    streamingFilters.subscriptionPlatforms.length > 0 ||
    (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0)
  );

  const totalPlatforms = hasActiveFilters ? (
    streamingFilters.subscriptionPlatforms.length +
    (streamingFilters.includeRentalPurchase ? streamingFilters.rentalPurchasePlatforms.length : 0)
  ) : 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '80vh', py: 2 }}>
        {/* Header Reorganizado */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          {/* Lado Esquerdo: Título + Badge */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1,
            flex: 1,
            minWidth: 0,
            mr: { md: 2 }
          }}>
            <Typography variant="h5" sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
              lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
              textAlign: { xs: 'center', md: 'left' },
              wordBreak: 'break-word',
              overflow: 'hidden'
            }}>
              Filmes sugeridos para: {selectedOptionText}
            </Typography>

            {hasActiveFilters && (
              <Chip
                label={`🎬 Filtros de streaming ativos: ${totalPlatforms} plataforma(s)`}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.8rem' }}
              />
            )}
          </Box>

          {/* Lado Direito: Ordenação + Paginação */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-end' },
            gap: 1,
            flexShrink: 0,
            minWidth: { md: '280px' }
          }}>
            {/* Seletor de Ordenação */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: { xs: 'center', md: 'flex-end' } }}>
              <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1, fontSize: '0.7rem' }}>
                Ordenar por
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'nowrap',
                justifyContent: { xs: 'center', md: 'flex-end' },
                minWidth: 'fit-content'
              }}>
                <Tooltip title="Curadoria emocional do Vibesfilm com rotação diária dos top filmes" arrow>
                  <Chip
                    label="Recomendado"
                    onClick={() => handleSortChange('relevance')}
                    variant={sortType === 'relevance' || sortType === 'smart' ? "filled" : "outlined"}
                    color={sortType === 'relevance' || sortType === 'smart' ? "primary" : "default"}
                    size="small"
                    icon={<span style={{ fontSize: 14, lineHeight: 0 }}>🎯</span>}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      height: 28,
                      transition: 'all 0.2s ease',
                      '& .MuiChip-icon': { fontSize: 16 },
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2
                      }
                    }}
                  />
                </Tooltip>
                <Tooltip title="Ordena do maior para o menor rating (IMDb + TMDB)" arrow>
                  <Chip
                    label="Rating"
                    onClick={() => handleSortChange('rating')}
                    variant={sortType === 'rating' ? "filled" : "outlined"}
                    color={sortType === 'rating' ? "primary" : "default"}
                    size="small"
                    icon={<span style={{ fontSize: 14, lineHeight: 0, color: '#F5C518' }}>★</span>}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      height: 28,
                      transition: 'all 0.2s ease',
                      '& .MuiChip-icon': { fontSize: 16 },
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2
                      }
                    }}
                  />
                </Tooltip>
                <Tooltip title="Mais recentes primeiro" arrow>
                  <Chip
                    label="Ano"
                    onClick={() => handleSortChange('year')}
                    variant={sortType === 'year' ? "filled" : "outlined"}
                    color={sortType === 'year' ? "primary" : "default"}
                    size="small"
                    icon={<span style={{ fontSize: 14, lineHeight: 0 }}>📅</span>}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      height: 28,
                      transition: 'all 0.2s ease',
                      '& .MuiChip-icon': { fontSize: 16 },
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2
                      }
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>

            {/* Informações de Paginação */}
            {!isMobile && totalPages > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                Página {currentPage + 1} de {totalPages} • {filteredSuggestions.length} {filteredSuggestions.length === 1 ? 'filme encontrado' : 'filmes'}
              </Typography>
            )}

            {isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {filteredSuggestions.length} {filteredSuggestions.length === 1 ? 'filme encontrado' : 'filmes'}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Grid de Filmes */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {displaySuggestions.map((suggestion) => (
            <Grid item xs={12} md={6} key={suggestion.movie.id}>
              <MovieCard
                suggestion={suggestion}
                journeyContext={journeyContext}
                streamingFilters={streamingFilters}
                mode={mode}
                sentimentColor={sentimentColor}
              />
            </Grid>
          ))}
        </Grid>

        {isMobile &&
          (sortType === 'relevance' || sortType === 'smart') && (
            <Box sx={{ mt: 3, mb: 2, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                {displaySuggestions.length < filteredSuggestions.length
                  ? `Top ${displaySuggestions.length} selecionados. Para ver todos, ordene por Ano ou Rating.`
                  : displaySuggestions.length === filteredSuggestions.length
                    ? `${displaySuggestions.length} filmes disponíveis com os filtros atuais.`
                    : 'Top 12 selecionados. Para ver todos, ordene por Ano ou Rating.'
                }
              </Typography>
            </Box>
          )}

        {isMobile &&
          (sortType !== 'relevance' && sortType !== 'smart') &&
          displaySuggestions.length < filteredSuggestions.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setMobileDisplayLimit(prev => prev + 12)}
                sx={{ px: 3, py: 1 }}
              >
                Ver mais
              </Button>
            </Box>
          )}

        {/* Footer com Paginação e Navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ px: 3, py: 1 }}
          >
            Voltar
          </Button>

          <Button
            variant="outlined"
            onClick={handleRestart}
            sx={{
              px: 3,
              py: 1,
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
              textAlign: 'center'
            }}
          >
            Nova Jornada
          </Button>

          {!isMobile && totalPages > 1 && (
            <>
              <Box sx={{ width: 1, height: 20, bgcolor: 'divider', mx: 2 }} />
              <Button
                variant="outlined"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                sx={{ px: 2, py: 1 }}
              >
                Anterior
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mx: 1, whiteSpace: 'nowrap' }}>
                {currentPage + 1} de {totalPages}
              </Typography>

              <Button
                variant="outlined"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                sx={{ px: 2, py: 1 }}
              >
                Próximo
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MovieSuggestionsPageMinimal;

