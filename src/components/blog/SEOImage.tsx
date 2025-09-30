import React from 'react';
import { generateImageSEO, generateOpenGraphImage, generateArticleStructuredData, BlogArticleSEO } from '../../utils/blogSEO';

interface SEOImageProps {
  article: BlogArticleSEO;
  imagePath: string;
  type?: 'featured' | 'content' | 'thumbnail';
  className?: string;
  style?: React.CSSProperties;
  baseUrl?: string;
}

export function SEOImage({ 
  article, 
  imagePath, 
  type = 'featured',
  className = '',
  style = {},
  baseUrl = 'https://vibesfilm.com'
}: SEOImageProps) {
  const seoConfig = generateImageSEO(article, imagePath, type);
  const ogTags = generateOpenGraphImage(article, imagePath, baseUrl);
  const structuredData = generateArticleStructuredData(article, imagePath, baseUrl);

  return (
    <>
      {/* Imagem otimizada para SEO */}
      <img
        src={imagePath}
        alt={seoConfig.alt}
        title={seoConfig.title}
        width={seoConfig.width}
        height={seoConfig.height}
        loading={seoConfig.loading}
        fetchPriority={seoConfig.fetchpriority}
        className={className}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          ...style
        }}
      />

      {/* Meta tags Open Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Meta tags para redes sociais */}
      <meta property="og:image" content={ogTags['og:image']} />
      <meta property="og:image:width" content={ogTags['og:image:width']} />
      <meta property="og:image:height" content={ogTags['og:image:height']} />
      <meta property="og:image:type" content={ogTags['og:image:type']} />
      <meta property="og:image:alt" content={ogTags['og:image:alt']} />
      
      <meta name="twitter:image" content={ogTags['twitter:image']} />
      <meta name="twitter:image:alt" content={ogTags['twitter:image:alt']} />
      <meta name="twitter:card" content={ogTags['twitter:card']} />
    </>
  );
}

/**
 * Componente especializado para imagem de capa
 */
export function FeaturedSEOImage(props: Omit<SEOImageProps, 'type'>) {
  return <SEOImage {...props} type="featured" />;
}

/**
 * Componente especializado para imagem de conteúdo
 */
export function ContentSEOImage(props: Omit<SEOImageProps, 'type'>) {
  return <SEOImage {...props} type="content" />;
}

/**
 * Componente especializado para miniatura
 */
export function ThumbnailSEOImage(props: Omit<SEOImageProps, 'type'>) {
  return <SEOImage {...props} type="thumbnail" />;
}
