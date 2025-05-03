import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export interface MainSentiment {
  id: number;
  name: string;
  description: string;
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
  nextStepId?: number;
  movieSuggestions?: MovieSuggestionFlow[];
}

export interface MovieSuggestionFlow {
  id: number;
  movie: Movie;
  reason: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
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
  try {
    const response = await api.get<Movie[]>('/movies');
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    throw error;
  }
};

export const getMovie = async (id: string): Promise<Movie> => {
  try {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao carregar filme:', error);
    throw error;
  }
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

export const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
  try {
    const response = await api.put<Movie>(`/movies/${id}`, movie);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    throw error;
  }
};

export const deleteMovie = async (id: string): Promise<void> => {
  try {
    await api.delete(`/movies/${id}`);
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    throw error;
  }
};

export default api; 