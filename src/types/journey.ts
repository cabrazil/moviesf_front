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
}

export interface JourneyStepFlow {
  id: number;
  journeyFlowId: number;
  stepId: string;
  order: number;
  question: string;
  options: JourneyOptionFlow[];
}

export interface JourneyOptionFlow {
  id: number;
  journeyStepFlowId: number;
  optionId: string;
  text: string;
  nextStepId: string | null;
  isEndState: boolean;
  movieSuggestions: MovieSuggestionFlow[];
}

export interface MovieSuggestionFlow {
  id: number;
  journeyOptionFlowId: number;
  movieId: string;
  reason: string;
  relevance: number;
  movie: Movie;
}

export interface Movie {
  id: string;
  title: string;
  year?: number;
  director?: string;
  description?: string;
  genres: string[];
  streamingPlatforms: string[];
  thumbnail?: string;
  original_title?: string;
  runtime?: number;
  imdbRating?: number;
  rottenTomatoesRating?: number;
  metacriticRating?: number;
} 