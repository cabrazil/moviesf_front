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
    // Retornar fallback local se o nome da plataforma for fornecido (ex: Youtube)
    if (platformName && platformName.toLowerCase().includes('youtube')) {
      return '/platforms/youtube.png';
    }
    return '';
  }

  // 1. Prioridade: URL Completa (Supabase, External, etc)
  if (logoPath.startsWith('http') || logoPath.startsWith('https://')) {
    return logoPath;
  }

  // 2. Fallback: Path Local (Legado ou estático)
  if (logoPath.startsWith('/platforms/')) {
    return logoPath;
  }

  // 3. Fallback: TMDB Path (Legado)
  // Apenas se parecer um path de imagem relativo e não for local
  if (logoPath.startsWith('/') && /\.(jpg|png|jpeg|svg)$/i.test(logoPath)) {
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${logoPath}`;
  }

  // Retorna como está se não casar com nada (pode ser dataURI ou relativo simples)
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
