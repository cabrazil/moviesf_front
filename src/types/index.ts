export interface EmotionalFlow {
  emotionalStateId: number;
  currentQuestion?: string;
  currentPath?: string[];
  options?: EmotionalOption[];
  isComplete: boolean;
}

export interface EmotionalOption {
  text: string;
  isEndState: boolean;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  director: string;
  genres: string[];
}

export interface MovieSuggestion {
  movie: Movie;
  reason: string;
  relevance: number;
} 