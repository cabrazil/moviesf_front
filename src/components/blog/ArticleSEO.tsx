import { Helmet } from 'react-helmet-async';
import { generateOpenGraphImage, generateArticleStructuredData, BlogArticleSEO } from '../../utils/blogSEO';

interface ArticleSEOProps {
  article: BlogArticleSEO;
  featuredImage: string;
  baseUrl?: string;
}

export function ArticleSEO({ 
  article, 
  featuredImage, 
  baseUrl = 'https://vibesfilm.com' 
}: ArticleSEOProps) {
  const ogTags = generateOpenGraphImage(article, featuredImage, baseUrl);
  const structuredData = generateArticleStructuredData(article, featuredImage, baseUrl);
  
  const canonicalUrl = `${baseUrl}/blog/artigo/${article.slug}`;
  const imageUrl = `${baseUrl}/${featuredImage}`;

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{article.title}</title>
      <meta name="description" content={article.description} />
      <meta name="keywords" content={article.keywords.join(', ')} />
      <meta name="author" content={article.author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="VibesFilm" />
      <meta property="og:image" content={ogTags['og:image']} />
      <meta property="og:image:width" content={ogTags['og:image:width']} />
      <meta property="og:image:height" content={ogTags['og:image:height']} />
      <meta property="og:image:type" content={ogTags['og:image:type']} />
      <meta property="og:image:alt" content={ogTags['og:image:alt']} />
      <meta property="article:author" content={article.author} />
      <meta property="article:published_time" content={article.publishedAt} />
      {article.modifiedAt && (
        <meta property="article:modified_time" content={article.modifiedAt} />
      )}
      <meta property="article:section" content={article.category} />
      {article.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={ogTags['twitter:card']} />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.description} />
      <meta name="twitter:image" content={ogTags['twitter:image']} />
      <meta name="twitter:image:alt" content={ogTags['twitter:image:alt']} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Meta tags adicionais para SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Preload da imagem principal */}
      <link 
        rel="preload" 
        as="image" 
        href={imageUrl}
        fetchPriority="high"
      />
      
      {/* Meta tags para performance */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#2EC4B6" />
    </Helmet>
  );
}
