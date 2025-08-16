// Configurações da API TMDB
export const TMDB_CONFIG = {
  // Base URL para imagens do TMDB
  IMAGE_BASE_URL: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  
  // Tamanho padrão das imagens
  IMAGE_SIZE: import.meta.env.VITE_TMDB_IMAGE_SIZE || 'original',
  
  // Tamanhos disponíveis para logos de plataformas
  LOGO_SIZES: {
    SMALL: 'w92',      // 92px - para listas compactas
    MEDIUM: 'w185',    // 185px - tamanho padrão recomendado
    LARGE: 'w300',     // 300px - para destaque
    ORIGINAL: 'original' // Tamanho original
  }
} as const;

// Tipos para os tamanhos de imagem
export type TMDBImageSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type TMDBLogoSizes = typeof TMDB_CONFIG.LOGO_SIZES[keyof typeof TMDB_CONFIG.LOGO_SIZES];
