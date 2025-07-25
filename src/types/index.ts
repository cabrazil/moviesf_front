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

export interface MovieSentiment {
  mainSentimentId: number;
  subSentimentId: number;
}

export interface MovieSuggestion {
  movie: Movie;
  reason: string;
  relevance: number;
  emotionalStateId: number;
  journeyOptionId: number;
}

export interface MovieSuggestionFlow {
  journeyOptionFlowId: number;
  reason: string;
  relevance: number;
}

export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  description: string;
  year: number;
  director: string;
  genres: string[];
  thumbnail?: string;
  streamingPlatforms: string[];
  runtime?: number;
  movieSentiments?: MovieSentiment[];
  movieSuggestions?: MovieSuggestion[];
  movieSuggestionFlows?: MovieSuggestionFlow[];
  imdbRating?: number;
  rottenTomatoesRating?: number;
  metacriticRating?: number;
} 