import { getApiUrl } from '../config/api.config';

export interface VibeMovieItem {
  id: string;
  title: string;
  year: number | null;
  slug: string;
  thumbnail: string | null;
  backdropUrl?: string | null;
  genres: string[];
  runtime: number | null;
  imdbRating: number | null;
  voteAverage: number | null;
  relevanceScore: number;
  tier: 'Ouro' | 'Prata' | 'Bronze' | 'Sem Bônus';
  reason: string;
  synopsis: string | null;
  director: string | null;
  contentWarnings: string | null;
  streamingPlatforms: Array<{
    id: number;
    name: string;
    category: string;
    logoPath?: string | null;
  }>;
  badges: string[];
  blogArticle: {
    title: string;
    slug: string;
    url: string;
  } | null;
}

export interface VibeLandingData {
  vibe: {
    id: number;
    slug: string;
    title: string;
    optionText: string;
    summary: string | null;
    mobileText: string | null;
    sentiment: {
      id: number;
      name: string;
    };
    intention: {
      type: string;
      description: string;
    };
    totalMovies: number;
    seo: {
      title: string;
      description: string;
      canonicalUrl: string;
    };
  };
  movies: VibeMovieItem[];
}

export interface VibeSummaryItem {
  id: number;
  slug: string;
  title: string;
  optionText: string;
  summary: string | null;
  sentiment: string;
  intention: string;
  movieCount: number;
  url: string;
}

export interface VibeApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  vibes?: VibeSummaryItem[];
  error?: string;
}

class VibeApiService {
  /**
   * Busca os dados da landing page de uma vibe específica
   */
  async getVibeData(identifier: string, limit = 12): Promise<VibeApiResponse<VibeLandingData>> {
    try {
      const url = getApiUrl(`/api/vibe/${encodeURIComponent(identifier)}?limit=${limit}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Vibe não encontrada ou ainda sem filmes curados.'
          };
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error(`❌ Erro ao buscar vibe "${identifier}":`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao conectar ao servidor.'
      };
    }
  }

  /**
   * Lista todas as vibes disponíveis
   */
  async getAllVibes(): Promise<VibeApiResponse<VibeSummaryItem[]>> {
    try {
      const url = getApiUrl('/api/vibe');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error('❌ Erro ao listar vibes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao listar vibes.'
      };
    }
  }
}

export const vibeApi = new VibeApiService();
