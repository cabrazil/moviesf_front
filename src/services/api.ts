import axios from 'axios';
import { EmotionalFlow } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MainSentiment {
  id: number;
  name: string;
  description: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  subSentiments: SubSentiment[];
}

export interface SubSentiment {
  id: number;
  name: string;
  description: string | null;
  keywords: string[];
  mainSentimentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyOption {
  id: number;
  journeyStepId: number;
  text: string;
  nextStepId: number | null;
  isEndState: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyStep {
  id: number;
  emotionalStateId: number;
  question: string;
  options: JourneyOption[];
  createdAt: string;
  updatedAt: string;
}

export interface EmotionalState {
  id: number;
  name: string;
  description: string;
  mainSentimentId: number;
  mainSentiment: MainSentiment;
  journeySteps: JourneyStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getMainSentiments = async (): Promise<MainSentiment[]> => {
  try {
    const response = await api.get<MainSentiment[]>('/main-sentiments');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sentimentos principais:', error);
    throw error;
  }
};

export const getEmotionalFlow = async (currentPath?: string): Promise<EmotionalFlow> => {
  const response = await api.get('/emotions/flow', {
    params: currentPath ? { currentPath } : undefined
  });
  return response.data;
};

export const getMovieSuggestionsByEmotionalState = async (emotionalStateId: number, path: string[]): Promise<MovieSuggestion[]> => {
  const response = await api.get('/movies/suggestions', {
    params: {
      emotionalStateId,
      path
    }
  });
  return response.data;
};

export interface Movie {
  id: string;
  title: string;
  year?: number;
  director?: string;
  description?: string;
  genres: string[];
  streamingPlatforms: string[];
}

export interface MovieSuggestion {
  id: string;
  movieId: string;
  emotionalStateId: string;
  reason: string;
}

export interface MovieSentiment {
  id: string;
  movieId: string;
  sentimentId: string;
  intensity: number;
}

// Funções para manipulação de filmes
export const getMovies = async (): Promise<Movie[]> => {
  const response = await fetch('/api/movies');
  if (!response.ok) {
    throw new Error('Erro ao carregar filmes');
  }
  return response.json();
};

export const getMovie = async (id: string): Promise<Movie> => {
  const response = await fetch(`/api/movies/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar filme');
  }
  return response.json();
};

export const createMovie = async (movie: Movie): Promise<Movie> => {
  const response = await fetch('/api/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movie),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar filme');
  }
  return response.json();
};

export const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
  const response = await fetch(`/api/movies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movie),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar filme');
  }
  return response.json();
};

export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`/api/movies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar filme');
  }
};

// Funções para manipulação de estados emocionais
export const getEmotionalStates = async (): Promise<EmotionalState[]> => {
  try {
    const response = await api.get<EmotionalState[]>('/emotions/states');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estados emocionais:', error);
    throw error;
  }
};

export const getEmotionalState = async (id: number): Promise<EmotionalState> => {
  try {
    const response = await api.get<EmotionalState>(`/emotions/states/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estado emocional:', error);
    throw error;
  }
};

export const createEmotionalState = async (data: {
  name: string;
  description: string;
  mainSentimentId: number;
  journeySteps: {
    question: string;
    options: {
      text: string;
      nextStepId: number | null;
      isEndState: boolean;
    }[];
  }[];
}): Promise<EmotionalState> => {
  try {
    const response = await api.post<EmotionalState>('/emotions/states', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar estado emocional:', error);
    throw error;
  }
};

export const updateEmotionalState = async (id: number, data: {
  name?: string;
  description?: string;
  mainSentimentId?: number;
  journeySteps?: {
    question: string;
    options: {
      text: string;
      nextStepId: number | null;
      isEndState: boolean;
    }[];
  }[];
}): Promise<EmotionalState> => {
  try {
    const response = await api.put<EmotionalState>(`/emotions/states/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar estado emocional:', error);
    throw error;
  }
};

export const deleteEmotionalState = async (id: number): Promise<void> => {
  try {
    await api.delete(`/emotions/states/${id}`);
  } catch (error) {
    console.error('Erro ao excluir estado emocional:', error);
    throw error;
  }
};

// Funções para manipulação de sugestões de filmes
export const getMovieSuggestions = async (): Promise<MovieSuggestion[]> => {
  const response = await fetch('/api/movie-suggestions');
  if (!response.ok) {
    throw new Error('Erro ao carregar sugestões de filmes');
  }
  return response.json();
};

export const getMovieSuggestion = async (id: string): Promise<MovieSuggestion> => {
  const response = await fetch(`/api/movie-suggestions/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar sugestão de filme');
  }
  return response.json();
};

export const createMovieSuggestion = async (suggestion: MovieSuggestion): Promise<MovieSuggestion> => {
  const response = await fetch('/api/movie-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(suggestion),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar sugestão de filme');
  }
  return response.json();
};

export const updateMovieSuggestion = async (id: string, suggestion: MovieSuggestion): Promise<MovieSuggestion> => {
  const response = await fetch(`/api/movie-suggestions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(suggestion),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar sugestão de filme');
  }
  return response.json();
};

export const deleteMovieSuggestion = async (id: string): Promise<void> => {
  const response = await fetch(`/api/movie-suggestions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar sugestão de filme');
  }
};

// Funções para manipulação de sentimentos de filmes
export const getMovieSentiments = async (): Promise<MovieSentiment[]> => {
  const response = await fetch('/api/movie-sentiments');
  if (!response.ok) {
    throw new Error('Erro ao carregar sentimentos de filmes');
  }
  return response.json();
};

export const getMovieSentiment = async (id: string): Promise<MovieSentiment> => {
  const response = await fetch(`/api/movie-sentiments/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar sentimento de filme');
  }
  return response.json();
};

export const createMovieSentiment = async (sentiment: MovieSentiment): Promise<MovieSentiment> => {
  const response = await fetch('/api/movie-sentiments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sentiment),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar sentimento de filme');
  }
  return response.json();
};

export const updateMovieSentiment = async (id: string, sentiment: MovieSentiment): Promise<MovieSentiment> => {
  const response = await fetch(`/api/movie-sentiments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sentiment),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar sentimento de filme');
  }
  return response.json();
};

export const deleteMovieSentiment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/movie-sentiments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar sentimento de filme');
  }
};

// Funções para manipulação de sentimentos principais
export const getMainSentiment = async (id: number): Promise<MainSentiment> => {
  try {
    const response = await api.get<MainSentiment>(`/main-sentiments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sentimento principal:', error);
    throw error;
  }
};

export const createMainSentiment = async (data: {
  name: string;
  description: string;
  keywords: string[];
}): Promise<MainSentiment> => {
  try {
    const response = await api.post<MainSentiment>('/main-sentiments', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar sentimento principal:', error);
    throw error;
  }
};

export const updateMainSentiment = async (id: number, data: {
  name?: string;
  description?: string;
  keywords?: string[];
}): Promise<MainSentiment> => {
  try {
    const response = await api.put<MainSentiment>(`/main-sentiments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar sentimento principal:', error);
    throw error;
  }
};

export const deleteMainSentiment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/main-sentiments/${id}`);
  } catch (error) {
    console.error('Erro ao excluir sentimento principal:', error);
    throw error;
  }
};

export default api; 