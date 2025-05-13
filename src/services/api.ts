import axios from 'axios';
import { Movie } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export interface MainSentiment {
  id: number;
  name: string;
  description: string;
  journeyFlow?: JourneyFlow;
}

export interface JourneyFlow {
  id: number;
  mainSentimentId: number;
  steps: JourneyStepFlow[];
}

export interface JourneyStepFlow {
  id: number;
  stepId: string;
  order: number;
  question: string;
  options: JourneyOptionFlow[];
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

export default api; 