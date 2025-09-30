/**
 * Utilitários para SEO de imagens do blog
 */

export interface BlogImageSEO {
  alt: string;
  title: string;
  width: number;
  height: number;
  format: 'webp' | 'jpg' | 'png';
  quality: number;
  loading: 'lazy' | 'eager';
  fetchpriority: 'high' | 'low' | 'auto';
}

export interface BlogArticleSEO {
  title: string;
  description: string;
  keywords: string[];
  featuredImage: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  category: string;
  tags: string[];
  slug: string;
  movieTitle?: string;
}

/**
 * Gera alt text otimizado para SEO
 */
export function generateSEOAltText(
  articleTitle: string,
  imageDescription?: string,
  movieTitle?: string
): string {
  // Remove caracteres especiais e normaliza
  const cleanTitle = articleTitle
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Se tem descrição específica da imagem, usa ela
  if (imageDescription) {
    return `${imageDescription} - ${cleanTitle}`;
  }

  // Se é sobre um filme específico
  if (movieTitle) {
    return `Imagem do filme ${movieTitle} - ${cleanTitle}`;
  }

  // Alt text genérico otimizado
  return `Imagem ilustrativa do artigo: ${cleanTitle}`;
}

/**
 * Gera title otimizado para SEO
 */
export function generateSEOTitle(
  articleTitle: string,
  movieTitle?: string
): string {
  if (movieTitle) {
    return `${articleTitle} - ${movieTitle}`;
  }
  
  return articleTitle;
}

/**
 * Gera dimensões otimizadas para SEO
 */
export function getSEOImageDimensions(type: 'featured' | 'content' | 'thumbnail' = 'featured') {
  const dimensions = {
    featured: { width: 1200, height: 630 }, // Open Graph padrão
    content: { width: 800, height: 450 },
    thumbnail: { width: 400, height: 225 }
  };

  return dimensions[type];
}

/**
 * Gera configuração SEO completa para imagem
 */
export function generateImageSEO(
  article: BlogArticleSEO,
  _imagePath: string,
  type: 'featured' | 'content' | 'thumbnail' = 'featured'
): BlogImageSEO {
  const dimensions = getSEOImageDimensions(type);
  
  return {
    alt: generateSEOAltText(article.title, undefined, article.movieTitle),
    title: generateSEOTitle(article.title, article.movieTitle),
    width: dimensions.width,
    height: dimensions.height,
    format: 'webp',
    quality: type === 'featured' ? 90 : 85,
    loading: type === 'featured' ? 'eager' : 'lazy',
    fetchpriority: type === 'featured' ? 'high' : 'auto'
  };
}

/**
 * Gera meta tags Open Graph para imagens
 */
export function generateOpenGraphImage(
  article: BlogArticleSEO,
  _imagePath: string,
  baseUrl: string = 'https://vibesfilm.com'
) {
  const fullImageUrl = `${baseUrl}/${_imagePath}`;
  const dimensions = getSEOImageDimensions('featured');
  
  return {
    'og:image': fullImageUrl,
    'og:image:width': dimensions.width.toString(),
    'og:image:height': dimensions.height.toString(),
    'og:image:type': 'image/webp',
    'og:image:alt': generateSEOAltText(article.title, undefined, article.movieTitle),
    'twitter:image': fullImageUrl,
    'twitter:image:alt': generateSEOAltText(article.title, undefined, article.movieTitle),
    'twitter:card': 'summary_large_image'
  };
}

/**
 * Gera structured data (JSON-LD) para artigo
 */
export function generateArticleStructuredData(
  article: BlogArticleSEO,
  imagePath: string,
  baseUrl: string = 'https://vibesfilm.com'
) {
  const fullImageUrl = `${baseUrl}/${imagePath}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: fullImageUrl,
      width: 1200,
      height: 630,
      alt: generateSEOAltText(article.title, undefined, article.movieTitle)
    },
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'VibesFilm',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.png`
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/artigo/${article.slug}`
    },
    keywords: article.keywords.join(', '),
    articleSection: article.category,
    about: article.tags.map(tag => ({
      '@type': 'Thing',
      name: tag
    }))
  };
}

/**
 * Valida se imagem está otimizada para SEO
 */
export function validateSEOImage(image: {
  width: number;
  height: number;
  format: string;
  size: number;
}): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Verifica dimensões mínimas
  if (image.width < 1200 || image.height < 630) {
    issues.push('Imagem muito pequena para Open Graph (mín. 1200x630)');
  }
  
  // Verifica formato
  if (!['webp', 'jpg', 'jpeg'].includes(image.format.toLowerCase())) {
    issues.push('Formato não otimizado (recomendado: WebP)');
  }
  
  // Verifica tamanho do arquivo
  if (image.size > 5 * 1024 * 1024) { // 5MB
    issues.push('Arquivo muito grande (máx. 5MB)');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Gera sitemap para imagens do blog
 */
export function generateImageSitemap(
  articles: Array<{
    slug: string;
    featuredImage: string;
    lastModified: string;
  }>,
  baseUrl: string = 'https://vibesfilm.com'
) {
  return articles.map(article => ({
    loc: `${baseUrl}/blog/artigo/${article.slug}`,
    lastmod: article.lastModified,
    image: {
      loc: `${baseUrl}/${article.featuredImage}`,
      title: `Imagem do artigo: ${article.slug}`,
      caption: `Capa do artigo ${article.slug}`
    }
  }));
}

/**
 * Gera robots.txt otimizado para imagens
 */
export function generateRobotsTxt(baseUrl: string = 'https://vibesfilm.com') {
  return `User-agent: *
Allow: /images/blog/
Allow: /images/blog/articles/
Allow: /images/blog/featured/
Allow: /images/blog/thumbnails/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-images.xml

# Crawl-delay para imagens
Crawl-delay: 1`;
}
