import { MovieSuggestionFlow } from '../../services/api';
import { lightSentimentColors, darkSentimentColors } from '../../styles/themes';

/**
 * Funções auxiliares memoizadas para processamento de dados de filmes
 * Estas funções são movidas para fora do componente para evitar recriação
 */

// Função para calcular score de diversidade (memoizada)
export const getDiversityScore = (suggestion: MovieSuggestionFlow): number => {
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

// Função para obter cor do sentimento (memoizada)
export const getSentimentColor = (
  journeyContext: any,
  locationState: any,
  currentSentimentColors: typeof lightSentimentColors | typeof darkSentimentColors
): string => {
  // Verificar se temos o journeyContext com sentimento
  if (journeyContext?.selectedSentiment?.id) {
    return currentSentimentColors[journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
  }
  
  // Verificar se temos o sentimento diretamente no state da localização
  if (locationState?.sentimentId) {
    return currentSentimentColors[locationState.sentimentId as keyof typeof currentSentimentColors] || '#1976d2';
  }
  
  // Verificar se temos o sentimento no journeyContext do state
  if (locationState?.journeyContext?.selectedSentiment?.id) {
    return currentSentimentColors[locationState.journeyContext.selectedSentiment.id as keyof typeof currentSentimentColors] || '#1976d2';
  }
  
  // Verificar se temos o sentimento no journeyContext do state (estrutura alternativa)
  if (locationState?.journeyContext?.selectedSentiment) {
    const sentimentId = locationState.journeyContext.selectedSentiment.id || locationState.journeyContext.selectedSentiment;
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

// Função para gerar cor com opacidade (memoizada)
export const getSentimentColorWithOpacity = (
  baseColor: string,
  opacity: string
): string => {
  return `${baseColor}${opacity}`;
};

// Função para obter texto da opção selecionada (memoizada)
export const getSelectedOptionText = (locationState: any, journeyContext: any): string => {
  // Primeiro, tentar usar o selectedOptionText que vem da página de filtros
  if (locationState?.selectedOptionText) {
    return locationState.selectedOptionText;
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

