import React from 'react';
import { getBlogImageUrl, getFeaturedImageUrl, getThumbnailImageUrl, getContentImageUrl, getCardImageUrl } from '../../utils/blogImages';

interface BlogImageProps {
  src: string;
  alt: string;
  type?: 'featured' | 'thumbnail' | 'content' | 'card' | 'custom';
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function BlogImage({
  src,
  alt,
  type = 'content',
  width,
  height,
  quality,
  format,
  className = '',
  style = {},
  loading = 'lazy',
  onLoad,
  onError
}: BlogImageProps) {
  // Gera URL otimizada baseada no tipo
  const getOptimizedUrl = () => {
    const config = {
      width,
      height,
      quality,
      format
    };

    switch (type) {
      case 'featured':
        return getFeaturedImageUrl(src);
      case 'thumbnail':
        return getThumbnailImageUrl(src);
      case 'card':
        return getCardImageUrl(src);
      case 'custom':
        return getBlogImageUrl(src, config);
      default:
        return getContentImageUrl(src);
    }
  };

  const optimizedUrl = getOptimizedUrl();

  return (
    <img
      src={optimizedUrl}
      alt={alt}
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        ...style
      }}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// Componentes especializados para diferentes tipos de imagem
export function FeaturedImage(props: Omit<BlogImageProps, 'type'>) {
  return <BlogImage {...props} type="featured" />;
}

export function ThumbnailImage(props: Omit<BlogImageProps, 'type'>) {
  return <BlogImage {...props} type="thumbnail" />;
}

export function ContentImage(props: Omit<BlogImageProps, 'type'>) {
  return <BlogImage {...props} type="content" />;
}

export function CardImage(props: Omit<BlogImageProps, 'type'>) {
  return <BlogImage {...props} type="card" />;
}
