import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  articleUrl?: string;
  publishedAt?: string;
  authorName?: string;
  categoryName?: string;
  tags?: string[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  articleUrl,
  publishedAt,
  authorName,
  categoryName,
  tags = []
}) => {
  // Gerar URL canônica
  const generateCanonicalUrl = () => {
    if (articleUrl) return articleUrl;
    return window.location.href;
  };

  // Gerar Schema.org markup para artigo
  const generateSchemaMarkup = () => {
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": authorName || "VibesFilm Blog",
        "url": "https://vibesfilm.com/blog"
      },
      "publisher": {
        "@type": "Organization",
        "name": "VibesFilm",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vibesfilm.com/logo.png"
        }
      }
    };

    if (imageUrl) {
      schema.image = {
        "@type": "ImageObject",
        "url": imageUrl,
        "caption": imageAlt || title
      };
    }

    if (publishedAt) {
      schema.datePublished = publishedAt;
      schema.dateModified = publishedAt;
    }

    if (categoryName) {
      schema.articleSection = categoryName;
    }

    if (tags.length > 0) {
      schema.keywords = tags.join(", ");
    }

    return schema;
  };

  // Limitar descrição para SEO
  const seoDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  // Limitar título para SEO
  const seoTitle = title.length > 60 
    ? `${title.substring(0, 57)}...` 
    : title;

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{seoTitle} | VibesFilm Blog</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={`${title}, ${categoryName || ''}, cinema, filmes, blog, ${tags.join(', ')}`} />
      
      {/* URL canônica */}
      <link rel="canonical" href={generateCanonicalUrl()} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={generateCanonicalUrl()} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="VibesFilm Blog" />
      
      {/* Article specific Open Graph tags */}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {authorName && <meta property="article:author" content={authorName} />}
      {categoryName && <meta property="article:section" content={categoryName} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@vibesfilm" />
      <meta name="twitter:creator" content="@vibesfilm" />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaMarkup())}
      </script>
      
      {/* Meta tags adicionais */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={authorName || "VibesFilm Blog"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Meta tags específicas para artigos */}
      <meta name="article:author" content={authorName || "VibesFilm Blog"} />
      {categoryName && <meta name="article:section" content={categoryName} />}
      {publishedAt && <meta name="article:published_time" content={publishedAt} />}
    </Helmet>
  );
};
