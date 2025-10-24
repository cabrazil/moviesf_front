import { api } from './api';
import { TMDB_CONFIG, TMDBImageSize, TMDBLogoSizes } from '../config/tmdb.config';

export interface StreamingPlatform {
  id: number;
  name: string;
  category: 'SUBSCRIPTION_PRIMARY' | 'HYBRID' | 'RENTAL_PURCHASE_PRIMARY' | 'FREE_PRIMARY';
  showFilter: 'PRIORITY' | 'SECONDARY' | 'HIDDEN';
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

export const getPlatformLogoUrl = (logoPath: string | null, size: TMDBImageSize = TMDB_CONFIG.IMAGE_SIZE as TMDBImageSize, platformName?: string): string => {
  if (!logoPath) {
    throw new Error('Logo path não pode ser null ou vazio');
  }
  
  // Fallback: Se for YouTube, sempre usar logo local
  if (platformName && platformName.toLowerCase().includes('youtube')) {
    return '/platforms/youtube.png';
  }
  
  // Se já é uma URL completa, retorna como está
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // Se é um path relativo do TMDB (contém extensão de imagem e não é um path local)
  if (logoPath.startsWith('/') && (logoPath.includes('.jpg') || logoPath.includes('.png') || logoPath.includes('.jpeg'))) {
    // Verificar se é um path local (como /platforms/...)
    if (logoPath.startsWith('/platforms/')) {
      // Para paths locais, retornar como está (será resolvido pelo servidor)
      return logoPath;
    }
    // Se é um path do TMDB, constrói a URL completa
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${logoPath}`;
  }
  
  // Se é um path local, retorna como está
  return logoPath;
};

// Função auxiliar para diferentes tamanhos usando constantes
export const getPlatformLogoUrlWithSize = (logoPath: string | null, size: TMDBLogoSizes = TMDB_CONFIG.LOGO_SIZES.MEDIUM, platformName?: string): string => {
  return getPlatformLogoUrl(logoPath, size, platformName);
};

// Funções específicas para diferentes tamanhos
export const getPlatformLogoUrlSmall = (logoPath: string | null, platformName?: string): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.SMALL, platformName);
};

export const getPlatformLogoUrlMedium = (logoPath: string | null, platformName?: string): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.MEDIUM, platformName);
};

export const getPlatformLogoUrlLarge = (logoPath: string | null, platformName?: string): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.LARGE, platformName);
};

export const getPlatformLogoUrlOriginal = (logoPath: string | null, platformName?: string): string => {
  return getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.ORIGINAL, platformName);
};
