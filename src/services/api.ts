import axios from 'axios';
import { Movie } from '../types';
import { isValidUrl, logSecurityEvent, rateLimiter, generateCSRFToken } from '../utils/security';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://moviesf-back.vercel.app' 
    : 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Log da URL base para debug
console.log('🌐 API Base URL:', api.defaults.baseURL);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Rate limiting
    const clientId = getClientIdentifier();
    if (!rateLimiter.isAllowed(clientId)) {
      logSecurityEvent('Rate limit exceeded', { clientId, url: config.url });
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }

    // Adicionar token CSRF apenas em produção
    if (process.env.NODE_ENV === 'production') {
      const csrfToken = generateCSRFToken();
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Validar URLs de destino
    if (config.url && !isValidUrl(`${config.baseURL}${config.url}`)) {
      logSecurityEvent('Invalid URL request', { url: config.url });
      return Promise.reject(new Error('Invalid request URL'));
    }

    return config;
  },
  (error) => {
    logSecurityEvent('API Request Error', { error: error.message });
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    // Validar resposta
    if (response.data && typeof response.data === 'object') {
      // Sanitizar dados de resposta se necessário
      response.data = sanitizeResponseData(response.data);
    }

    return response;
  },
  (error) => {
    // Tratamento de erros de segurança
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      logSecurityEvent('Authentication failed', { 
        status: error.response.status,
        url: error.config?.url 
      });
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      logSecurityEvent('Access forbidden', { 
        status: error.response.status,
        url: error.config?.url 
      });
    } else if (error.response?.status === 429) {
      logSecurityEvent('Rate limit exceeded', { 
        status: error.response.status,
        url: error.config?.url 
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Gera um identificador único para o cliente
 */
function getClientIdentifier(): string {
  // Usar uma combinação de user agent e timestamp
  const userAgent = navigator.userAgent;
  const timestamp = Math.floor(Date.now() / (1000 * 60)); // Minuto atual
  return btoa(`${userAgent}-${timestamp}`).substring(0, 16);
}

/**
 * Sanitiza dados de resposta para prevenir XSS
 */
function sanitizeResponseData(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/[<>]/g, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponseData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeResponseData(value);
    }
    return sanitized;
  }
  
  return data;
}

export { api };

export interface MainSentiment {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
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
    const response = await api.get(`/api/personalized-journey/${mainSentimentId}/${emotionalIntentionId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jornada personalizada:', error);
    throw error;
  }
};

// Novas funções para intenções emocionais
export const getEmotionalIntentions = async (sentimentId: number): Promise<EmotionalIntentionsResponse> => {
  try {
    console.log('🌐 Fazendo requisição para intenções emocionais, sentimento ID:', sentimentId);
    
    // Validar parâmetro de entrada
    if (!sentimentId || typeof sentimentId !== 'number' || sentimentId <= 0) {
      throw new Error(`ID de sentimento inválido: ${sentimentId}`);
    }
    
    const response = await api.get(`/api/emotional-intentions/${sentimentId}`);
    
    // Validar resposta
    if (!response.data) {
      throw new Error('Resposta vazia da API de intenções emocionais');
    }
    
    if (!response.data.intentions || !Array.isArray(response.data.intentions)) {
      throw new Error('Formato de resposta inválido: intentions não é um array');
    }
    
    console.log('✅ Intenções emocionais carregadas com sucesso:', response.data.intentions.length, 'intenções');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar intenções emocionais:', error);
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

 
