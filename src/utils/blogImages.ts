/**
 * Utilitários para gerenciar imagens do blog
 */

import { getBlogImageUrl as getOptimizedBlogImageUrl } from '../lib/blog-images';

// Tipos para imagens do blog
export interface BlogImageConfig {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

// Configurações padrão para diferentes tipos de imagem
export const BLOG_IMAGE_CONFIGS = {
  // Imagem destacada do artigo
  FEATURED: {
    width: 1200,
    height: 675, // 16:9 ratio
    quality: 85,
    format: 'webp' as const
  },
  // Miniaturas para listagem
  THUMBNAIL: {
    width: 400,
    height: 225,
    quality: 80,
    format: 'webp' as const
  },
  // Imagens no conteúdo do artigo
  CONTENT: {
    width: 800,
    height: 600, // Aumentado para melhor qualidade
    quality: 85,
    format: 'webp' as const
  },
  // Imagens compactas para cards
  CARD: {
    width: 300,
    height: 200,
    quality: 75,
    format: 'webp' as const
  }
} as const;

/**
 * Gera URL para imagem do blog baseada no caminho
 * @param imagePath - Caminho da imagem (ex: "blog/articles/2024/janeiro/filme.jpg")
 * @param config - Configuração de otimização
 * @returns URL otimizada da imagem
 */
export function getBlogImageUrl(
  imagePath: string,
  config: BlogImageConfig = BLOG_IMAGE_CONFIGS.CONTENT
): string {
  // Se vazio ou inválido, retorna placeholder
  if (!imagePath || imagePath.trim() === '') {
    return `data:image/svg+xml,%3Csvg width='800' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23011627'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%233B82F6'%3EImagem não disponível%3C/text%3E%3C/svg%3E`;
  }

  // Se for uma URL externa (http/https), retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Se já começa com /images, retorna como está
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }

  // Tentar usar o sistema otimizado primeiro
  try {
    const optimizedUrl = getOptimizedBlogImageUrl(imagePath);
    if (optimizedUrl && optimizedUrl !== imagePath) {
      return optimizedUrl;
    }
  } catch (error) {
    // Fallback para sistema antigo
  }

  // Se já começa com images/, adiciona apenas a barra inicial
  if (imagePath.startsWith('images/')) {
    return `/${imagePath}`;
  }

  // Para imagens do blog (caminhos relativos como "blog/articles/..."), adiciona prefixo /images/
  if (imagePath.startsWith('blog/')) {
    return `/images/${imagePath}`;
  }

  // Remove barra inicial se existir
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Para imagens locais, adiciona prefixo de otimização se necessário
  const baseUrl = import.meta.env.VITE_BLOG_IMAGES_BASE_URL || '/images';

  // Em produção, você pode usar um serviço de otimização como Cloudinary
  if (import.meta.env.PROD && import.meta.env.VITE_IMAGE_OPTIMIZATION_SERVICE) {
    const serviceUrl = import.meta.env.VITE_IMAGE_OPTIMIZATION_SERVICE;
    const params = new URLSearchParams({
      url: `${baseUrl}/${cleanPath}`,
      w: config.width?.toString() || '800',
      h: config.height?.toString() || '450',
      q: config.quality?.toString() || '85',
      f: config.format || 'webp'
    });
    return `${serviceUrl}?${params.toString()}`;
  }

  // Em desenvolvimento, retorna caminho direto
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Gera URL para imagem destacada do artigo
 */
export function getFeaturedImageUrl(imagePath: string): string {
  return getBlogImageUrl(imagePath, BLOG_IMAGE_CONFIGS.FEATURED);
}

/**
 * Gera URL para miniatura do artigo
 */
export function getThumbnailImageUrl(imagePath: string): string {
  return getBlogImageUrl(imagePath, BLOG_IMAGE_CONFIGS.THUMBNAIL);
}

/**
 * Gera URL para imagem de conteúdo do artigo
 */
export function getContentImageUrl(imagePath: string): string {
  return getBlogImageUrl(imagePath, BLOG_IMAGE_CONFIGS.CONTENT);
}

/**
 * Gera URL para imagem de card
 */
export function getCardImageUrl(imagePath: string): string {
  return getBlogImageUrl(imagePath, BLOG_IMAGE_CONFIGS.CARD);
}

/**
 * Gera caminho organizado para nova imagem do blog
 * @param articleSlug - Slug do artigo
 * @param imageName - Nome da imagem
 * @param year - Ano (padrão: ano atual - 2025)
 * @param month - Mês (padrão: mês atual)
 */
export function generateBlogImagePath(
  articleSlug: string,
  imageName: string,
  year?: number,
  month?: number
): string {
  const currentDate = new Date();
  const targetYear = year || 2025; // Ano atual
  const targetMonth = month || (currentDate.getMonth() + 1);

  const monthNames = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const monthName = monthNames[targetMonth - 1];

  // Remove extensão se existir e adiciona .webp
  const cleanName = imageName.replace(/\.[^/.]+$/, '');
  const fileName = `${cleanName}.webp`;

  return `blog/articles/${targetYear}/${monthName}/${articleSlug}/${fileName}`;
}

/**
 * Valida se uma imagem é válida para o blog
 */
export function validateBlogImage(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Máximo 5MB.'
    };
  }

  return { valid: true };
}

/**
 * Processa imagens locais no conteúdo HTML do artigo
 * Converte caminhos locais para URLs corretas
 */
export function processContentImages(htmlContent: string): string {
  // Regex para encontrar tags img com src locais
  const imgRegex = /<img([^>]*)\s+src=["']([^"']+)["']([^>]*)>/gi;

  return htmlContent.replace(imgRegex, (match, before, src, after) => {
    // Se já é uma URL externa, não processa
    if (src.startsWith('http') || src.startsWith('//')) {
      return match;
    }

    // Se é um caminho local do blog, processa
    if (src.startsWith('/images/') || src.startsWith('images/') || src.startsWith('blog/')) {
      // Remove prefixo /images/ se existir
      const cleanPath = src.replace(/^\/?images\//, '');
      const optimizedUrl = getContentImageUrl(cleanPath);

      return `<img${before} src="${optimizedUrl}"${after}>`;
    }

    // Se é um caminho relativo simples, assume que está em blog/
    if (!src.startsWith('/') && !src.startsWith('http')) {
      const optimizedUrl = getContentImageUrl(`blog/${src}`);
      return `<img${before} src="${optimizedUrl}"${after}>`;
    }

    return match;
  });
}

/**
 * Otimiza imagem para web (reduz tamanho mantendo qualidade)
 */
export function optimizeImageForWeb(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcula dimensões otimizadas
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Desenha imagem otimizada
      ctx?.drawImage(img, 0, 0, width, height);

      // Converte para WebP com qualidade otimizada
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao otimizar imagem'));
          }
        },
        'image/webp',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}
