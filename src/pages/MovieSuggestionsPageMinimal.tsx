import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Stack, Chip, Grid, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import { MovieSuggestionFlow } from '../services/api';
import { Person, ChevronRight, AccessTime, Favorite } from '@mui/icons-material';
import { useThemeManager } from '../contexts/ThemeContext';
import { lightSentimentColors, darkSentimentColors } from '../styles/themes';
import tmdbLogo from '../assets/themoviedb.svg';
import imdbLogo from '../assets/imdb.png';
import rtLogo from '../assets/rottentomatoes.png';
import metacriticLogo from '../assets/metascore.svg';

const MovieSuggestionsPageMinimal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const movieSuggestions: MovieSuggestionFlow[] = location.state?.movieSuggestions || [];
  const journeyContext = location.state?.journeyContext;
  const streamingFilters = location.state?.streamingFilters;
  const [currentPage, setCurrentPage] = useState(0);
  const [showPre1990, setShowPre1990] = useState(true);
  const [showPost1990, setShowPost1990] = useState(true);
  const [sortType, setSortType] = useState<'smart' | 'rating' | 'year' | 'relevance'>('smart');

  // Lógica de rotação automática dos filtros
  useEffect(() => {
    const availableFilters: ('smart' | 'rating' | 'year')[] = ['smart', 'rating', 'year'];
    
    // Usar uma combinação de timestamp e dados da sessão para maior variabilidade
    const timestamp = Date.now();
    const sessionData = JSON.stringify(movieSuggestions.length + journeyContext?.selectedSentiment?.id?.length || 0);
    const hash = sessionData.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const filterIndex = Math.abs(timestamp + hash) % availableFilters.length;
    const selectedFilter = availableFilters[filterIndex];
    
    setSortType(selectedFilter);
    console.log(`🎲 Filtro automático selecionado: ${selectedFilter} (índice: ${filterIndex})`);
  }, []); // Executa apenas uma vez quando o componente é montado

  // Scroll para o topo quando o componente for carregado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset da página quando os filtros ou ordenação mudarem (apenas se não for mobile)
  useEffect(() => {
    if (!isMobile) {
      setCurrentPage(0);
    }
  }, [showPre1990, showPost1990, sortType, isMobile]);
  
  const { mode } = useThemeManager();
  const currentSentimentColors = mode === 'dark' ? darkSentimentColors : lightSentimentColors;

  // Função para obter o texto da opção selecionada
  const getSelectedOptionText = () => {
    // Primeiro, tentar usar o selectedOptionText que vem da página de filtros
    if (location.state?.selectedOptionText) {
      return location.state.selectedOptionText;
    }
    
    // Fallback: tentar extrair do journeyContext
    if (journeyContext?.selectedIntention?.text) {
      return journeyContext.selectedIntention.text;
    }
    if (journeyContext?.selectedIntention?.displayTitle) {
      return journeyContext.selectedIntention.displayTitle;
    }
    
    return 'sua jornada emocional';
  };

  // Debug inicial do componente
  console.log('🎬 MovieSuggestionsPageMinimal carregado:', {
    movieSuggestions: movieSuggestions.length,
    journeyContext,
    locationState: location.state,
    mode,
    isMobile,
    userAgent: navigator.userAgent,
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
             navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'
  });



  // Debug: Verificar campos do primeiro filme sempre que o componente for carregado
  if (movieSuggestions.length > 0) {
    console.log('🔍 Campos do primeiro filme:', {
      title: movieSuggestions[0].movie.title,
      imdbRating: movieSuggestions[0].movie.imdbRating,
      vote_average: (movieSuggestions[0].movie as any).vote_average,
      rottenTomatoesRating: movieSuggestions[0].movie.rottenTomatoesRating,
      metacriticRating: movieSuggestions[0].movie.metacriticRating
    });
  }

  // Salvar journeyContext no localStorage como backup
  useEffect(() => {
    if (journeyContext) {
      localStorage.setItem('journeyContext', JSON.stringify(journeyContext));
      console.log('💾 JourneyContext salvo no localStorage:', journeyContext);
    }
  }, [journeyContext]);

  const MOVIES_PER_PAGE = 4;

  // Filtrar filmes baseado no ano e plataformas de streaming
  const filteredSuggestions = useMemo((): MovieSuggestionFlow[] => {
    console.log('🔍 Filtros aplicados:', {
      isMobile,
      streamingFilters,
      movieSuggestionsCount: movieSuggestions.length,
      showPre1990,
      showPost1990
    });
    
    const result = movieSuggestions.filter(suggestion => {
      // Filtro por ano
      const year = suggestion.movie.year;
      if (year) {
        if (year < 1990 && !showPre1990) return false;
        if (year >= 1990 && !showPost1990) return false;
      }
      
            // Filtro por plataformas de streaming (se aplicável)
      if (streamingFilters) {
        // Se não há filtros selecionados, mostrar todos os filmes
        const hasNoFilters = streamingFilters.subscriptionPlatforms.length === 0 && 
          (!streamingFilters.includeRentalPurchase || streamingFilters.rentalPurchasePlatforms.length === 0);
        
        if (hasNoFilters) {
          return true;
        }

        const movieStreamingPlatforms = (suggestion.movie as any).platforms || [];
        

        
        // Se não há plataformas de streaming no filme, não deve aparecer quando há filtros ativos
        if (movieStreamingPlatforms.length === 0) return false;
        
        // Verificar se o filme tem pelo menos uma das plataformas selecionadas
        const hasSelectedPlatform = movieStreamingPlatforms.some((platform: any) => {
          const platformName = platform.streamingPlatform?.name || '';
          const accessType = platform.accessType || '';
          

          
          // Verificar plataformas de assinatura
          if (streamingFilters.subscriptionPlatforms.length > 0) {
            const isSubscriptionPlatform = streamingFilters.subscriptionPlatforms.some((selectedPlatform: string) => {
              // Se for o marcador especial para "Outras Plataformas"
              if (selectedPlatform === '__OTHER_PLATFORMS__') {
                // Verificar se a plataforma NÃO está nas principais
                const mainPlatforms = [
                  'prime video', 'netflix', 'disney+', 'hbo max', 'globoplay', 
                  'apple tv+', 'claro video'
                ];
                const isMainPlatform = mainPlatforms.some(main => 
                  platformName.toLowerCase().includes(main)
                );
                // Retornar true se NÃO for uma plataforma principal
                return !isMainPlatform;
              }
              
              // Normalizar nomes para comparação
              const cleanSelectedPlatform = selectedPlatform.toLowerCase().trim();
              const cleanPlatformName = platformName.toLowerCase().trim();
              
              // Verificação exata ou contém
              return cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
            });
            
            if (isSubscriptionPlatform && accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
              return true;
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
              
              // Verificação exata ou contém
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
    
    console.log('🔍 Resultado dos filtros:', {
      isMobile,
      totalMovies: movieSuggestions.length,
      filteredMovies: result.length,
      streamingFiltersApplied: !!streamingFilters
    });
    
    return result;
  }, [movieSuggestions, showPre1990, showPost1990, streamingFilters]);

  // Função para obter a cor do sentimento atual
  const getSentimentColor = () => {
    // Verificar se temos o journeyContext com sentimento
    if (journeyContext?.selectedSentiment?.id) {
      return currentSentimentColors[journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
    }
    
    // Verificar se temos o sentimento diretamente no state da localização
    const state = location.state;
    if (state?.sentimentId) {
      return currentSentimentColors[state.sentimentId as keyof typeof currentSentimentColors] || '#1976d2';
    }
    
    // Verificar se temos o sentimento no journeyContext do state
    if (state?.journeyContext?.selectedSentiment?.id) {
      return currentSentimentColors[state.journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
    }
    
    // Verificar se temos o sentimento no journeyContext do state (estrutura alternativa)
    if (state?.journeyContext?.selectedSentiment) {
      const sentimentId = state.journeyContext.selectedSentiment.id || state.journeyContext.selectedSentiment;
      return currentSentimentColors[sentimentId as keyof typeof currentSentimentColors] || '#1976d2';
    }
    
    // Verificar localStorage como último recurso
    try {
      const savedContext = localStorage.getItem('journeyContext');
      if (savedContext) {
        const parsedContext = JSON.parse(savedContext);
        if (parsedContext?.selectedSentiment?.id) {
          return currentSentimentColors[parsedContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao ler journeyContext do localStorage:', error);
    }
    
    return '#1976d2'; // Cor padrão se não houver sentimento
  };

  // Função auxiliar para gerar cores com transparência
  const getSentimentColorWithOpacity = (opacity: string) => {
    const baseColor = getSentimentColor();
    return `${baseColor}${opacity}`;
  };

  // Ordenar e paginar sugestões
  const { totalPages, displaySuggestions } = useMemo(() => {
    const sorted = [...filteredSuggestions].sort((a, b) => {
      switch (sortType) {
        case 'smart':
          // ESTRATÉGIA DE ORDENAÇÃO VARIADA - Score de diversidade
          const getDiversityScore = (suggestion: MovieSuggestionFlow) => {
            const movie = suggestion.movie;
            
            // Fator 1: Rating (peso 40%)
            const imdbRating = movie.imdbRating !== null && movie.imdbRating !== undefined ? Number(movie.imdbRating) : 0;
            const voteAverage = (movie as any).vote_average !== null && (movie as any).vote_average !== undefined ? Number((movie as any).vote_average) : 0;
            const ratingScore = (imdbRating * 0.6) + (voteAverage * 0.4);
            
            // Fator 2: Relevância da sugestão (peso 30%) - usar relevanceScore
            const relevanceScore = (suggestion as any).relevanceScore ? Number((suggestion as any).relevanceScore) : 0;
            
            // Fator 3: Ano do filme (peso 15%) - favorecer filmes mais recentes levemente
            const yearScore = movie.year ? (movie.year - 1900) / 100 : 0;
            
            // Fator 4: Diversidade por título (peso 15%) - usar hash do título para distribuição
            const titleHash = movie.title.split('').reduce((hash, char) => {
              return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
            }, 0);
            const titleScore = (titleHash % 100) / 100;
            
            // Score final ponderado
            return (ratingScore * 0.4) + (relevanceScore * 0.3) + (yearScore * 0.15) + (titleScore * 0.15);
          };
          
          const scoreA = getDiversityScore(a);
          const scoreB = getDiversityScore(b);
          
          if (scoreB !== scoreA) return scoreB - scoreA;
          break;
          
        case 'rating':
          // Ordenação por rating (IMDb + TMDB)
          const aRating = a.movie.imdbRating !== null && a.movie.imdbRating !== undefined ? Number(a.movie.imdbRating) : -Infinity;
          const bRating = b.movie.imdbRating !== null && b.movie.imdbRating !== undefined ? Number(b.movie.imdbRating) : -Infinity;
          
          if (bRating !== aRating) return bRating - aRating;
          
          const aVoteAverage = (a.movie as any).vote_average !== null && (a.movie as any).vote_average !== undefined ? Number((a.movie as any).vote_average) : -Infinity;
          const bVoteAverage = (b.movie as any).vote_average !== null && (b.movie as any).vote_average !== undefined ? Number((b.movie as any).vote_average) : -Infinity;
          if (bVoteAverage !== aVoteAverage) return bVoteAverage - aVoteAverage;
          break;
          
        case 'year':
          // Ordenação por ano (mais recentes primeiro)
          const aYear = a.movie.year || 0;
          const bYear = b.movie.year || 0;
          if (bYear !== aYear) return bYear - aYear;
          break;
          
        case 'relevance':
          // Ordenação por relevância (baseada no relevanceScore)
          const aRelevance = (a as any).relevanceScore ? Number((a as any).relevanceScore) : 0;
          const bRelevance = (b as any).relevanceScore ? Number((b as any).relevanceScore) : 0;
          if (bRelevance !== aRelevance) return bRelevance - aRelevance;
          break;
      }
      
      // Critério secundário: ordenar por título
      return a.movie.title.localeCompare(b.movie.title, 'pt-BR');
    });
    
    // Em mobile, mostrar todos os filmes sem paginação
    if (isMobile) {
      return {
        totalPages: 1,
        displaySuggestions: sorted
      };
    }
    
    // Em desktop, manter paginação
    const total = Math.ceil(sorted.length / MOVIES_PER_PAGE);
    const start = currentPage * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;
    const display = sorted.slice(start, end);
    
    return {
      totalPages: total,
      displaySuggestions: display
    };
  }, [filteredSuggestions, currentPage, isMobile, sortType]);

  const handleRestart = () => {
    navigate('/app');
  };

  const handleBack = () => {
    // Determinar se temos filmes originais para decidir o comportamento
    const hasOriginalMovies = movieSuggestions.length > 0;
    
    // Se não há filmes originais, ir direto para início
    if (!hasOriginalMovies) {
      navigate('/');
      return;
    }
    
    // Se há filtros de streaming ativos e filmes originais, voltar para a tela de filtros
    const hasStreamingFilters = streamingFilters && (
      streamingFilters.subscriptionPlatforms.length > 0 || 
      (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0)
    );
    
    if (hasStreamingFilters) {
      // Voltar para a tela de filtros com o contexto da jornada
      navigate('/filters', { 
        state: { 
          ...location.state,
          journeyContext: journeyContext || location.state?.journeyContext
        } 
      });
      return;
    }
    
    // Caso contrário, voltar para a tela de introdução (comportamento original)
    let contextToPass = journeyContext || location.state?.journeyContext;
    
    // Se não temos contexto, tentar recuperar do localStorage
    if (!contextToPass) {
      try {
        const savedContext = localStorage.getItem('journeyContext');
        if (savedContext) {
          const parsedContext = JSON.parse(savedContext);
          
          // Validar se o contexto recuperado é válido
          const isValidContext = parsedContext && 
            parsedContext.selectedSentiment && 
            parsedContext.selectedSentiment.id &&
            parsedContext.selectedIntention &&
            parsedContext.selectedIntention.id &&
            typeof parsedContext.selectedSentiment.id === 'number' &&
            typeof parsedContext.selectedIntention.id === 'number';
          
          if (isValidContext) {
            contextToPass = parsedContext;
            console.log('🔄 Contexto válido recuperado do localStorage:', contextToPass);
          } else {
            console.warn('⚠️ Contexto do localStorage inválido:', parsedContext);
          }
        }
      } catch (error) {
        console.warn('⚠️ Erro ao recuperar contexto do localStorage:', error);
      }
    }
    
    console.log('🔄 Navegando de volta...', {
      journeyContext,
      locationState: location.state,
      contextToPass,
      hasOriginalMovies,
      hasStreamingFilters
    });
    
    if (contextToPass) {
      // Voltar para /intro com o contexto da jornada para restaurar o estado
      navigate('/intro', { 
        state: { 
          restoreJourney: true,
          selectedSentiment: contextToPass.selectedSentiment,
          selectedIntention: contextToPass.selectedIntention,
          journeyType: contextToPass.journeyType
        } 
      });
    } else {
      // Fallback para /intro sem contexto
      navigate('/intro');
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  

  // Componentes de ícone para ratings
  const RatingIcon: React.FC<{ src: string; alt: string; size?: number; colorFilter?: string }> = ({ src, alt, size = 18, colorFilter }) => (
    <img src={src} alt={alt} style={{ width: size, height: size, objectFit: 'contain', verticalAlign: 'middle', marginRight: 2, filter: colorFilter || undefined }} />
  );


  if (!displaySuggestions.length) {
    // Verificar se é porque não há filmes originais ou porque os filtros estão desmarcados
    const hasOriginalMovies = movieSuggestions.length > 0;
    const hasActiveFilters = showPre1990 || showPost1990;
    const hasStreamingFilters = streamingFilters && (
      streamingFilters.subscriptionPlatforms.length > 0 || 
      (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0)
    );
    
    return (
      <Container maxWidth="lg">
        <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {hasOriginalMovies && (!hasActiveFilters || !hasStreamingFilters)
              ? 'Nenhum filme encontrado com os filtros atuais.' 
              : 'Nenhuma sugestão de filme encontrada.'
            }
          </Typography>
          
          {hasOriginalMovies && (!hasActiveFilters || !hasStreamingFilters) ? (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {!hasActiveFilters 
                ? 'Tente marcar pelo menos um dos filtros de ano para ver os filmes.'
                : 'Tente ajustar os filtros de plataformas de streaming para ver mais filmes.'
              }
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
            gap: 1
          }}>
            <Typography variant="h5" sx={{ 
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Filmes sugeridos para opção: {getSelectedOptionText()}
            </Typography>
            
            {/* Indicador de Filtros de Streaming - Só exibe se há filtros ativos */}
            {streamingFilters && (
              (() => {
                const hasActiveFilters = streamingFilters.subscriptionPlatforms.length > 0 || 
                  (streamingFilters.includeRentalPurchase && streamingFilters.rentalPurchasePlatforms.length > 0);
                
                if (!hasActiveFilters) return null;
                
                const totalPlatforms = streamingFilters.subscriptionPlatforms.length + 
                  (streamingFilters.includeRentalPurchase ? streamingFilters.rentalPurchasePlatforms.length : 0);
                
                return (
              <Chip
                    label={`🎬 Filtros de streaming ativos: ${totalPlatforms} plataforma(s)`}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.8rem' }}
              />
                );
              })()
            )}
          </Box>

          {/* Lado Direito: Filtros + Paginação */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-end' },
            gap: 1
          }}>
            {/* Filtro de Ano */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="Filmes Pré-1990"
                onClick={() => setShowPre1990(!showPre1990)}
                variant={showPre1990 ? "filled" : "outlined"}
                color={showPre1990 ? "primary" : "default"}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  height: 28,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              />
              <Chip
                label="Filmes Pós-1990"
                onClick={() => setShowPost1990(!showPost1990)}
                variant={showPost1990 ? "filled" : "outlined"}
                color={showPost1990 ? "primary" : "default"}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  height: 28,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              />
            </Box>

            {/* Seletor de Ordenação */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Chip
                label="Inteligente"
                onClick={() => setSortType('smart')}
                variant={sortType === 'smart' ? "filled" : "outlined"}
                color={sortType === 'smart' ? "primary" : "default"}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  height: 28,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              />
              <Chip
                label="Rating"
                onClick={() => setSortType('rating')}
                variant={sortType === 'rating' ? "filled" : "outlined"}
                color={sortType === 'rating' ? "primary" : "default"}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  height: 28,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              />
              <Chip
                label="Ano"
                onClick={() => setSortType('year')}
                variant={sortType === 'year' ? "filled" : "outlined"}
                color={sortType === 'year' ? "primary" : "default"}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  height: 28,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              />
              {/* Filtro "Relevância" removido - redundante com "Inteligente" que já inclui relevância (30% do peso) */}
              {/* Mantido apenas 3 filtros para interface mais limpa e menos confusa para o usuário */}
            </Box>

            {/* Informações de Paginação (apenas em desktop) */}
            {!isMobile && totalPages > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                Página {currentPage + 1} de {totalPages} • {filteredSuggestions.length} {filteredSuggestions.length === 1 ? 'filme encontrado' : 'filmes'}
              </Typography>
            )}
            
            {/* Contador simples em mobile */}
            {isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {filteredSuggestions.length} {filteredSuggestions.length === 1 ? 'filme encontrado' : 'filmes'}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Grid de Filmes */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {displaySuggestions.map((suggestion) => {
            const reason = suggestion.reason || '';
            
            return (
              <Grid item xs={12} md={6} key={suggestion.movie.id}>
                <Card 
                  elevation={3}
                  onClick={() => {
                    navigate(`/onde-assistir/${suggestion.movie.id}`, {
                      state: {
                        movie: suggestion.movie,
                        reason: suggestion.reason,
                        sentimentId: journeyContext?.selectedSentiment?.id,
                        intentionType: journeyContext?.selectedIntention?.type
                      }
                    });
                  }}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backgroundColor: mode === 'light' ? '#f5f5f5' : undefined,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header com thumbnail e título */}
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      {suggestion.movie.thumbnail && (
                        <Box sx={{ flexShrink: 0 }}>
                          <img 
                            src={suggestion.movie.thumbnail} 
                            alt={suggestion.movie.title}
                            style={{
                              width: '90px',
                              height: '135px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.75, lineHeight: 1.2, fontSize: '1rem' }}>
                          {suggestion.movie.title}
                        </Typography>
                        
                          {/* Plataformas de Streaming */}
                          {(() => {
                            const platforms = (suggestion.movie as any).platforms || [];
                            
                            // Se não há plataformas disponíveis, mostrar "não disponível no momento"
                            if (platforms.length === 0) {
                              return (
                                <Chip
                                  label="não disponível no momento"
                                  size="small"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '22px',
                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                    color: '#ff9800',
                                    border: '1px solid rgba(255, 152, 0, 0.3)',
                                    fontWeight: 500,
                                    '& .MuiChip-label': {
                                      px: 1.2
                                    }
                                  }}
                                />
                              );
                            }
                            
                            // Se há plataformas, mostrar normalmente
                            return (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                              {(() => {
                                // Se há filtros ativos, mostrar apenas plataformas que correspondem aos filtros
                                if (streamingFilters && streamingFilters.subscriptionPlatforms.length > 0) {
                                  const filteredPlatforms = (suggestion.movie as any).platforms.filter((platform: any) => {
                                    const platformName = platform.streamingPlatform?.name || '';
                                    const accessType = platform.accessType || '';
                                    
                                    console.log('🔍 Debug filtro de plataformas:', {
                                      platformName,
                                      accessType,
                                      selectedPlatforms: streamingFilters.subscriptionPlatforms,
                                      includeRentalPurchase: streamingFilters.includeRentalPurchase,
                                      rentalPlatforms: streamingFilters.rentalPurchasePlatforms
                                    });
                                    
                                    // Verificar se a plataforma corresponde aos filtros selecionados
                                    const matchesSubscription = streamingFilters.subscriptionPlatforms.length === 0 || 
                                      streamingFilters.subscriptionPlatforms.some((selectedPlatform: string) => {
                                        if (selectedPlatform === '__OTHER_PLATFORMS__') {
                                          const mainPlatforms = [
                                            'prime video', 'netflix', 'disney+', 'hbo max', 'globoplay', 
                                            'apple tv+', 'claro video'
                                          ];
                                          const isMainPlatform = mainPlatforms.some(main => 
                                            platformName.toLowerCase().includes(main)
                                          );
                                          return !isMainPlatform;
                                        }
                                        
                                        const cleanSelectedPlatform = selectedPlatform.toLowerCase().trim();
                                        const cleanPlatformName = platformName.toLowerCase().trim();
                                        const matches = cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
                                        
                                        console.log('🔍 Comparação de plataformas:', {
                                          selectedPlatform,
                                          cleanSelectedPlatform,
                                          platformName,
                                          cleanPlatformName,
                                          matches
                                        });
                                        
                                        return matches;
                                      });
                                    
                                    // Lógica simplificada: só permitir assinaturas que correspondem aos filtros
                                    if (accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
                                      return matchesSubscription;
                                    }
                                    
                                    return false;
                                  });
                                  
                                  console.log('🔍 Resultado do filtro:', {
                                    originalPlatforms: (suggestion.movie as any).platforms.length,
                                    filteredPlatforms: filteredPlatforms.length,
                                    filteredPlatformNames: filteredPlatforms.map((p: any) => p.streamingPlatform?.name || p.name)
                                  });
                                  
                                  return filteredPlatforms
                                    .sort((a: any, b: any) => {
                                      const aIsSubscription = a.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
                                      const bIsSubscription = b.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
                                      if (aIsSubscription && !bIsSubscription) return -1;
                                      if (!aIsSubscription && bIsSubscription) return 1;
                                      return 0;
                                    })
                                    .slice(0, 3).map((platform: any, index: number) => {
                                      const isSubscription = platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
                                      return (
                                        <Chip
                                          key={index}
                                          label={platform.streamingPlatform?.name || platform.name || 'Plataforma'}
                                          size="small"
                                          sx={{
                                            fontSize: '0.7rem',
                                            height: '22px',
                                            backgroundColor: isSubscription 
                                              ? getSentimentColorWithOpacity('15') 
                                              : 'rgba(25, 118, 210, 0.1)',
                                            color: isSubscription ? getSentimentColor() : '#1976d2',
                                            border: isSubscription 
                                              ? `1px solid ${getSentimentColorWithOpacity('40')}` 
                                              : '1px solid rgba(25, 118, 210, 0.3)',
                                            fontWeight: isSubscription ? 600 : 500,
                                            '& .MuiChip-label': {
                                              px: 1.2
                                            }
                                          }}
                                        />
                                      );
                                    });
                                } else {
                                  // Sem filtros ativos, mostrar até 3 plataformas de assinatura + "ver mais" se há aluguel/compra
                                  const subscriptionPlatforms = (suggestion.movie as any).platforms.filter((platform: any) => 
                                    platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION'
                                  );
                                  
                                  // Mostrar até 3 plataformas de assinatura
                                  const platformsToShow = subscriptionPlatforms.slice(0, 3);
                                  
                                  return platformsToShow.map((platform: any, index: number) => (
                                    <Chip
                                      key={index}
                                      label={platform.streamingPlatform?.name || platform.name || 'Plataforma'}
                                      size="small"
                                      sx={{
                                        fontSize: '0.7rem',
                                        height: '22px',
                                        backgroundColor: getSentimentColorWithOpacity('15'),
                                        color: getSentimentColor(),
                                        border: `1px solid ${getSentimentColorWithOpacity('40')}`,
                                        fontWeight: 600,
                                        '& .MuiChip-label': {
                                          px: 1.2
                                        }
                                      }}
                                    />
                                  ));
                                }
                              })()}
                              {(() => {
                                // Se há filtros ativos, usar o número de plataformas filtradas
                                if (streamingFilters && streamingFilters.subscriptionPlatforms.length > 0) {
                                  const filteredPlatforms = (suggestion.movie as any).platforms.filter((platform: any) => {
                                    const platformName = platform.streamingPlatform?.name || '';
                                    const accessType = platform.accessType || '';
                                    
                                    const matchesSubscription = streamingFilters.subscriptionPlatforms.length === 0 || 
                                      streamingFilters.subscriptionPlatforms.some((selectedPlatform: string) => {
                                        if (selectedPlatform === '__OTHER_PLATFORMS__') {
                                          const mainPlatforms = [
                                            'prime video', 'netflix', 'disney+', 'hbo max', 'globoplay', 
                                            'apple tv+', 'claro video'
                                          ];
                                          const isMainPlatform = mainPlatforms.some(main => 
                                            platformName.toLowerCase().includes(main)
                                          );
                                          return !isMainPlatform;
                                        }
                                        
                                        const cleanSelectedPlatform = selectedPlatform.toLowerCase().trim();
                                        const cleanPlatformName = platformName.toLowerCase().trim();
                                        return cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
                                      });
                                    
                                    // Lógica simplificada: só permitir assinaturas que correspondem aos filtros
                                    if (accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
                                      return matchesSubscription;
                                    }
                                    
                                    return false;
                                  });
                                  
                                  const totalFilteredPlatforms = filteredPlatforms.length;
                                  // Contar todas as plataformas disponíveis (assinatura + aluguel/compra)
                                  const totalAllPlatforms = (suggestion.movie as any).platforms.length;
                                  
                                  // Se há mais plataformas disponíveis além das filtradas, mostrar "ver mais"
                                  if (totalAllPlatforms > totalFilteredPlatforms) {
                                    return (
                                      <Chip
                                        label="ver mais"
                                        size="small"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: '22px',
                                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                          color: '#4caf50',
                                          border: '1px solid rgba(76, 175, 80, 0.3)',
                                          fontWeight: 500,
                                          '& .MuiChip-label': {
                                            px: 1.2
                                          }
                                        }}
                                      />
                                    );
                                  }
                                  
                                  // Se há mais de 3 plataformas filtradas, mostrar contador
                                  if (totalFilteredPlatforms > 3) {
                                    return (
                                      <Chip
                                        label={`+${totalFilteredPlatforms - 3}`}
                                        size="small"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: '22px',
                                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                          color: 'text.secondary',
                                          border: '1px solid rgba(0, 0, 0, 0.2)',
                                          '& .MuiChip-label': {
                                            px: 1.2
                                          }
                                        }}
                                      />
                                    );
                                  }
                                  return null;
                                } else {
                                  // Sem filtros ativos, mostrar "ver mais" se há aluguel/compra ou muitas assinaturas
                                  const subscriptionPlatforms = (suggestion.movie as any).platforms.filter((platform: any) => 
                                    platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION'
                                  );
                                  
                                  const rentalPurchasePlatforms = (suggestion.movie as any).platforms.filter((platform: any) => 
                                    platform.accessType === 'PURCHASE' || platform.accessType === 'RENTAL'
                                  );
                                  
                                  const hasRentalPurchase = rentalPurchasePlatforms.length > 0;
                                  const hasManySubscriptions = subscriptionPlatforms.length > 3;
                                  
                                  // Mostrar "ver mais" se há aluguel/compra ou muitas assinaturas
                                  if (hasRentalPurchase || hasManySubscriptions) {
                                    return (
                                      <Chip
                                        label="ver mais"
                                        size="small"
                                        sx={{
                                          fontSize: '0.7rem',
                                          height: '22px',
                                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                          color: '#4caf50',
                                          border: '1px solid rgba(76, 175, 80, 0.3)',
                                          fontWeight: 500,
                                          '& .MuiChip-label': {
                                            px: 1.2
                                          }
                                        }}
                                      />
                                    );
                                  }
                                  
                                  return null;
                                }
                              })()}
                            </Stack>
                            );
                          })()}
                        </Box>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                          {suggestion.movie.year && (
                            <Chip 
                              label={suggestion.movie.year} 
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                          {suggestion.movie.director && (
                            <Chip 
                              icon={<Person />} 
                              label={suggestion.movie.director} 
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Stack>

                        {/* Informações do filme: Ratings, Duração e Classificação */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                          {/* TMDB */}
                          {typeof (suggestion.movie as any).vote_average !== 'undefined' && (suggestion.movie as any).vote_average !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RatingIcon src={tmdbLogo} alt="TMDB" size={24} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {Number((suggestion.movie as any).vote_average).toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                          {/* IMDb */}
                          {typeof suggestion.movie.imdbRating !== 'undefined' && suggestion.movie.imdbRating !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RatingIcon src={imdbLogo} alt="IMDb" size={20} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {Number(suggestion.movie.imdbRating).toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                          {/* Rotten Tomatoes */}
                          {typeof suggestion.movie.rottenTomatoesRating !== 'undefined' && suggestion.movie.rottenTomatoesRating !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RatingIcon src={rtLogo} alt="Rotten Tomatoes" size={20} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {Number(suggestion.movie.rottenTomatoesRating).toFixed(0)}%
                              </Typography>
                            </Box>
                          )}
                          {/* Metacritic */}
                          {typeof suggestion.movie.metacriticRating !== 'undefined' && suggestion.movie.metacriticRating !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <RatingIcon src={metacriticLogo} alt="Metacritic" size={20} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {Number(suggestion.movie.metacriticRating).toFixed(0)}
                              </Typography>
                            </Box>
                          )}
                          {/* Barra vertical de separação */}
                          {(typeof (suggestion.movie as any).vote_average !== 'undefined' && (suggestion.movie as any).vote_average !== null) ||
                           (typeof suggestion.movie.imdbRating !== 'undefined' && suggestion.movie.imdbRating !== null) ||
                           (typeof suggestion.movie.rottenTomatoesRating !== 'undefined' && suggestion.movie.rottenTomatoesRating !== null) ||
                           (typeof suggestion.movie.metacriticRating !== 'undefined' && suggestion.movie.metacriticRating !== null) ? (
                            <Typography variant="caption" sx={{ color: 'text.disabled', mx: 0.5 }}>|</Typography>
                          ) : null}
                          {/* Duração */}
                          {suggestion.movie.runtime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                                {suggestion.movie.runtime} min
                              </Typography>
                            </Box>
                          )}
                          {/* Classificação */}
                          {(suggestion.movie as any).certification && (
                            <Chip 
                              label={(suggestion.movie as any).certification} 
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: '20px',
                                backgroundColor: 'warning.light',
                                color: 'warning.contrastText',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Stack>

                        {/* Gêneros compactos */}
                        {suggestion.movie.genres && suggestion.movie.genres.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 0.75 }}>
                            {suggestion.movie.genres.slice(0, 3).map((genre: string) => (
                              <Chip 
                                key={genre} 
                                label={genre} 
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                            ))}
                            {suggestion.movie.genres.length > 3 && (
                              <Chip 
                                label={`+${suggestion.movie.genres.length - 3}`}
                                size="small"
                                color="default"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                            )}
                          </Stack>
                        )}

                        {/* Reason - Campo Principal com coração e seta */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 0.5,
                            p: 0.5,
                            mt: 0.5,
                            borderRadius: 1,
                            backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${getSentimentColor()}20`,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Favorite 
                            sx={{ 
                              fontSize: 16, 
                              color: getSentimentColor(),
                              mt: 0.2,
                              flexShrink: 0
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '0.75rem',
                              flex: 1
                            }}
                          >
                            {reason}
                          </Typography>
                          <ChevronRight 
                            sx={{ 
                              fontSize: 26, // tamanho aumentado
                              color: getSentimentColor(),
                              mt: 0.2,
                              flexShrink: 0
                            }} 
                          />
                        </Box>
                      </Box>
                    </Box>


                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Footer com Paginação e Navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3 }}>
          {/* Botões de Navegação */}
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

          {/* Separador visual (apenas em desktop) */}
          {!isMobile && totalPages > 1 && (
            <Box sx={{ width: 1, height: 20, bgcolor: 'divider', mx: 2 }} />
          )}

          {/* Controles de Paginação (apenas em desktop) */}
          {!isMobile && totalPages > 1 && (
            <>
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