import axios from 'axios';
import { Movie } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://moviesf-back.vercel.app'),
});

export interface MainSentiment {
  id: number;
  name: string;
  description: string;
  keywords: string[];
  journeyFlow?: JourneyFlow;
}

export interface JourneyFlow {
  id: number;
  mainSentimentId: number;
  steps: JourneyStepFlow[];
  isComplete: boolean;
  currentQuestion: string;
  options: any[];
  emotionalStateId?: number;
}

export interface EmotionalState {
  name: string;
  description: string;
  mainSentimentId: number;
  isActive: boolean;
  journeySteps: any[];
}

export const getEmotionalState = async (id: number): Promise<EmotionalState> => {
  console.log(id);
  return new Promise(resolve => resolve({} as EmotionalState));
}

export const createEmotionalState = async (data: any): Promise<any> => {
  console.log(data);
  return new Promise(resolve => resolve({}));
}

export const updateEmotionalState = async (id: number, data: any): Promise<any> => {
  console.log(id, data);
  return new Promise(resolve => resolve({}));
}

export const getEmotionalFlow = async (path: any): Promise<JourneyFlow> => {
  console.log(path);
  return new Promise(resolve => resolve({} as JourneyFlow));
}

export const getMovieSuggestions = async (id: number, path: any): Promise<any> => {
  console.log(id, path);
  return new Promise(resolve => resolve([]));
}

export interface JourneyStepFlow {
  id: number;
  stepId: string;
  order: number;
  question: string;
  options: JourneyOptionFlow[];
  priority?: number;
  customQuestion?: string;
  contextualHint?: string;
  isRequired?: boolean;
}

export interface JourneyOptionFlow {
  id: number;
  text: string;
  description?: string;
  nextStepId: string | null;
  isEndState: boolean;
  movieSuggestions?: MovieSuggestionFlow[];
}

export interface MovieSuggestionFlow {
  id: number;
  movie: Movie;
  reason: string;
}

// Novos tipos para intenções emocionais
export interface EmotionalIntention {
  id: number;
  type: 'PROCESS' | 'TRANSFORM' | 'MAINTAIN' | 'EXPLORE';
  description: string;
  preferredGenres: string[];
  avoidGenres: string[];
  emotionalTone: string;
}

export interface EmotionalIntentionsResponse {
  sentimentId: number;
  sentimentName: string;
  intentions: EmotionalIntention[];
}

export interface EmotionalRecommendationRequest {
  mainSentimentId: number;
  intentionType: 'PROCESS' | 'TRANSFORM' | 'MAINTAIN' | 'EXPLORE';
  userId?: string;
  contextData?: any;
}

export interface EmotionalRecommendationResponse {
  success: boolean;
  data: {
    sessionId: string;
    recommendations: {
      movieId: string;
      movie: Movie;
      personalizedReason: string;
      relevanceScore: number;
      intentionAlignment: number;
    }[];
  };
}

// Nova interface para jornada personalizada
export interface PersonalizedJourneyFlow {
  id: number;
  mainSentimentId: number;
  emotionalIntentionId: number;
  steps: JourneyStepFlow[];
}

export const getMainSentiments = async (): Promise<MainSentiment[]> => {
  try {
    const response = await api.get('/main-sentiments');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sentimentos principais:', error);
    throw error;
  }
};

export const getJourneyFlow = async (mainSentimentId: number): Promise<JourneyFlow> => {
  try {
    const response = await api.get(`/main-sentiments/${mainSentimentId}/journey-flow`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fluxo da jornada:', error);
    throw error;
  }
};

// Nova função para buscar jornada personalizada baseada na intenção emocional
export const getPersonalizedJourneyFlow = async (
  mainSentimentId: number, 
  emotionalIntentionId: number
): Promise<PersonalizedJourneyFlow> => {
  try {
    // Usar novo endpoint que funciona
    const response = await api.get(`/api/personalized-flow/${mainSentimentId}/${emotionalIntentionId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jornada personalizada:', error);
    // Fallback para endpoint antigo se necessário
    try {
      const fallbackResponse = await api.get(`/api/personalized-journey/${mainSentimentId}/${emotionalIntentionId}`);
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);
      throw error;
    }
  }
};

// Novas funções para intenções emocionais
export const getEmotionalIntentions = async (sentimentId: number): Promise<EmotionalIntentionsResponse> => {
  try {
    const response = await api.get(`/api/emotional-intentions/${sentimentId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar intenções emocionais:', error);
    throw error;
  }
};

export const startEmotionalRecommendation = async (request: EmotionalRecommendationRequest): Promise<EmotionalRecommendationResponse> => {
  try {
    const response = await api.post('/api/emotional-recommendations', request);
    return response.data;
  } catch (error) {
    console.error('Erro ao iniciar recomendação emocional:', error);
    throw error;
  }
};

export const recordFeedback = async (sessionId: string, movieId: string, wasViewed: boolean, wasAccepted: boolean, feedback?: string): Promise<void> => {
  try {
    await api.post(`/api/emotional-recommendations/${sessionId}/feedback`, {
      movieId,
      wasViewed,
      wasAccepted,
      feedback
    });
  } catch (error) {
    console.error('Erro ao registrar feedback:', error);
    throw error;
  }
};

export const completeSession = async (sessionId: string): Promise<void> => {
  try {
    await api.post(`/api/emotional-recommendations/${sessionId}/complete`);
  } catch (error) {
    console.error('Erro ao finalizar sessão:', error);
    throw error;
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  const response = await api.get('/movies');
  return response.data;
};

export const getMovie = async (id: string): Promise<Movie> => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movie: Movie): Promise<Movie> => {
  try {
    const response = await api.post<Movie>('/movies', movie);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    throw error;
  }
};

export const updateMovie = async (id: string, movie: Partial<Movie>): Promise<Movie> => {
  const response = await api.put(`/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await api.delete(`/movies/${id}`);
};

// Interfaces para rastreamento de jornadas
export interface MovieJourneyPath {
  step: {
    id: number;
    stepId: string;
    order: number;
    question: string;
  };
  option: {
    id: number;
    optionId: string;
    text: string;
    nextStepId: string | null;
    isEndState: boolean;
  };
  suggestion: {
    id: number;
    reason: string;
    relevance: number;
  };
}

export interface MovieJourneyStep {
  id: number;
  stepId: string;
  order: number;
  question: string;
  options: {
    id: number;
    optionId: string;
    text: string;
    nextStepId: string | null;
    isEndState: boolean;
    hasMovieSuggestion: boolean;
  }[];
  emotionalIntentions: EmotionalIntention[];
  contextualHint?: string;
  isRequired?: boolean;
  isVirtual?: boolean;
}

export interface MovieJourney {
  mainSentiment: {
    id: number;
    name: string;
    description: string;
  };
  journeyFlow?: {
    id: number;
    mainSentimentId: number;
  };
  emotionalIntention?: {
    id: number;
    type: string;
    description: string;
    preferredGenres: string[];
    avoidGenres: string[];
    emotionalTone: string;
  };
  journeyType?: string;
  paths: MovieJourneyPath[];
  fullPath: MovieJourneyStep[];
}

export interface MovieJourneysResponse {
  movie: Movie;
  totalJourneys: number;
  journeys: MovieJourney[];
}

// Buscar todas as jornadas que levam a um filme específico
export const getMovieJourneys = async (movieId: string): Promise<MovieJourneysResponse> => {
  try {
    const response = await api.get(`/admin/movie-journeys/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jornadas do filme:', error);
    throw error;
  }
};

export default api; 