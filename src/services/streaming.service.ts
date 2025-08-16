import { api } from './api';
import { TMDB_CONFIG, TMDBImageSize, TMDBLogoSizes } from '../config/tmdb.config';

export interface StreamingPlatform {
  id: number;
  name: string;
  category: 'SUBSCRIPTION_PRIMARY' | 'HYBRID' | 'RENTAL_PURCHASE_PRIMARY' | 'FREE_PRIMARY';
  logoPath: string | null;
  baseUrl: string | null;
  hasFreeTrial: boolean;
  freeTrialDuration: string | null;
}

export const getStreamingPlatforms = async (): Promise<StreamingPlatform[]> => {
  try {
    const response = await api.get('/api/streaming-platforms');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar plataformas de streaming:', error);
    throw error;
  }
};

export const getPlatformLogoUrl = (logoPath: string | null, size: TMDBImageSize = TMDB_CONFIG.IMAGE_SIZE as TMDBImageSize): string => {
  if (!logoPath) {
    throw new Error('Logo path não pode ser null ou vazio');
  }
  
  // Se já é uma URL completa, retorna como está
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // Se é um path relativo do TMDB, constrói a URL completa
  if (logoPath.startsWith('/')) {
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${logoPath}`;
  }
  
  // Se é um path local, retorna como está
  return logoPath;
};

// Função auxiliar para diferentes tamanhos usando constantes
export const getPlatformLogoUrlWithSize = (logoPath: string | null, size: TMDBLogoSizes = TMDB_CONFIG.LOGO_SIZES.MEDIUM): string => {
  return getPlatformLogoUrl(logoPath, size);
};

// Funções específicas para diferentes tamanhos
export const getPlatformLogoUrlSmall = (logoPath: string | null): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.SMALL);
};

export const getPlatformLogoUrlMedium = (logoPath: string | null): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.MEDIUM);
};

export const getPlatformLogoUrlLarge = (logoPath: string | null): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.LARGE);
};

export const getPlatformLogoUrlOriginal = (logoPath: string | null): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.ORIGINAL);
};
