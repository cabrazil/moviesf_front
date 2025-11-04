import { Helmet } from 'react-helmet-async';

interface MovieMetaTagsProps {
  movie: {
    title: string;
    year?: number;
    description?: string;
    director?: string;
    vote_average?: number;
    vote_count?: number;
    genres?: string[];
    thumbnail?: string;
    targetAudienceForLP?: string;
    landingPageHook?: string;
  };
  platforms: Array<{
    name: string;
    accessType: string;
  }>;
  rentalPurchasePlatforms?: Array<{
    name: string;
    accessType: string;
  }>;
}

export const MovieMetaTags: React.FC<MovieMetaTagsProps> = ({ movie, platforms, rentalPurchasePlatforms = [] }) => {
  const title = movie.title;
  const year = movie.year;
  const description = movie.description;
  const director = movie.director;
  const rating = movie.vote_average;
  const genres = movie.genres?.join(', ') || '';
  const thumbnail = movie.thumbnail;

  // Gerar descrição otimizada para SEO
  const generateDescription = () => {
    const baseDesc = `Descubra onde assistir ${title}${year ? ` (${year})` : ''} online`;
    
    // Determinar tipos de acesso disponíveis
    const hasSubscription = platforms.some(p => p.accessType === 'INCLUDED_WITH_SUBSCRIPTION');
    const hasRentalPurchase = rentalPurchasePlatforms.length > 0;
    
    let availabilityText = '';
    if (hasSubscription && hasRentalPurchase) {
      availabilityText = ' Disponível em streaming e aluguel/compra.';
    } else if (hasSubscription) {
      availabilityText = ' Disponível em plataformas de streaming (teste gratuito para novos usuários).';
    } else if (hasRentalPurchase) {
      availabilityText = ' Disponível para aluguel e compra digital.';
    } else {
      availabilityText = ' Consulte as plataformas para disponibilidade.';
    }
    
    // Priorizar targetAudienceForLP (conteúdo emocional da melhor curadoria)
    if (movie.targetAudienceForLP) {
      const emotionalDesc = movie.targetAudienceForLP.length > 120 
        ? `${movie.targetAudienceForLP.substring(0, 120)}...` 
        : movie.targetAudienceForLP;
      return `${baseDesc}. ${emotionalDesc}${availabilityText}`;
    }
    
    // Fallback para description tradicional
    const movieDesc = description ? ` ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}` : '';
    const journeyDesc = ` Encontre o filme perfeito para sua vibe.`;
    
    return `${baseDesc}${movieDesc}${journeyDesc}${availabilityText}`;
  };

  // Gerar título otimizado para SEO
  const generateTitle = () => {
    const baseTitle = `Onde Assistir ${title}`;
    const yearTitle = year ? ` (${year})` : '';
    const platformTitle = platforms.length > 0 ? ` - Streaming Online` : '';
    
    return `${baseTitle}${yearTitle}${platformTitle} | vibesfilm`;
  };

  // Gerar URL canônica
  const generateCanonicalUrl = () => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `https://vibesfilm.com/onde-assistir/${slug}`;
  };

  // Gerar Schema.org markup
  const generateSchemaMarkup = () => {
    const allPlatforms = [...platforms, ...rentalPurchasePlatforms];
    const offers = allPlatforms.map(platform => ({
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "url": `https://${platform.name.toLowerCase().replace(/\s+/g, '')}.com`,
      "name": platform.name,
      "description": `Assistir ${title} no ${platform.name}`
    }));

    // Validar vote_count antes de incluir AggregateRating
    // Google Rich Results REQUER ratingCount quando aggregateRating existe
    let voteCount: number | null = null;
    
    if (movie.vote_count != null && movie.vote_count !== undefined) {
      let parsed: number;
      
      if (typeof movie.vote_count === 'string') {
        parsed = parseInt(movie.vote_count, 10);
      } else if (typeof movie.vote_count === 'number') {
        parsed = movie.vote_count;
      } else {
        parsed = Number(movie.vote_count);
      }
      
      // Validar se é um número válido e > 0
      if (!isNaN(parsed) && Number.isFinite(parsed) && parsed > 0) {
        voteCount = parsed;
      }
    }

    // Só incluir AggregateRating se tiver vote_average E vote_count válido
    const aggregateRating = (rating && voteCount && voteCount > 0 && !isNaN(voteCount)) ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": 10,
      "worstRating": 0,
      "ratingCount": voteCount
    } : undefined;

    // Remover campos undefined antes de serializar
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "Movie",
      "name": title,
      "description": description,
      "image": thumbnail,
      "dateCreated": year ? `${year}-01-01` : undefined,
      "director": director ? {
        "@type": "Person",
        "name": director
      } : undefined,
      "genre": genres,
      "aggregateRating": aggregateRating,
      "offers": offers.length > 0 ? offers : undefined
    };

    // Remover campos undefined recursivamente
    const removeUndefined = (obj: any): any => {
      if (obj === null || obj === undefined) return undefined;
      if (Array.isArray(obj)) return obj.map(removeUndefined).filter(item => item !== undefined);
      if (typeof obj !== 'object') return obj;
      
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = removeUndefined(value);
        }
      }
      return cleaned;
    };

    return removeUndefined(schema);
  };

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{generateTitle()}</title>
      <meta name="description" content={generateDescription()} />
      <meta name="keywords" content={`${title}, streaming, onde assistir, ${genres}, filmes online`} />
      
      {/* URL canônica */}
      <link rel="canonical" href={generateCanonicalUrl()} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={generateTitle()} />
      <meta property="og:description" content={generateDescription()} />
      <meta property="og:image" content={thumbnail} />
      <meta property="og:url" content={generateCanonicalUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="vibesfilm" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={generateTitle()} />
      <meta name="twitter:description" content={generateDescription()} />
      <meta name="twitter:image" content={thumbnail} />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaMarkup())}
      </script>
      
      {/* Meta tags adicionais */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="vibesfilm" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};
