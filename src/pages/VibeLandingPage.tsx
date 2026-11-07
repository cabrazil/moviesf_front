import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
 
  Film, 
  Clock, 
  Star, 
  Share2, 
  Check, 
  ArrowRight, 
  Tv, 
  Compass,
  Heart
} from 'lucide-react';
import { vibeApi, type VibeLandingData } from '../services/vibeApi';
import { getBlogImageUrl } from '../utils/blogImages';
import { getPlatformLogoUrlSmall } from '../services/streaming.service';

export function VibeLandingPage() {
  const { slug } = useParams<{ slug: string }>();

  const [data, setData] = useState<VibeLandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Carregar dados da Vibe
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchVibeData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await vibeApi.getVibeData(slug, 12);

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Vibe não encontrada ou sem filmes curados.');
        }
      } catch (err) {
        console.error('Erro ao buscar dados da vibe:', err);
        setError('Ocorreu um erro ao carregar os filmes desta vibe.');
      } finally {
        setLoading(false);
      }
    };

    fetchVibeData();
  }, [slug]);

  // Formatar duração
  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Cor do Patamar
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Ouro': return '#F59E0B';
      case 'Prata': return '#94A3B8';
      case 'Bronze': return '#D97706';
      default: return '#60A5FA';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTop: '3px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#E0E0E0', fontSize: '1.1rem' }}>Carregando seleção de filmes...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FDFFFC',
            marginBottom: '16px'
          }}>
            Vibe não encontrada
          </h1>
          <p style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: '1.6' }}>
            {error || 'Não conseguimos encontrar recomendações para este caminho emocional no momento.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/blog"
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Ver Blog & Artigos
            </Link>
            <Link
              to="/app"
              style={{
                backgroundColor: '#FF6B35',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)'
              }}
            >
              🎯 Descobrir Minha Vibe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { vibe, movies } = data;
  const canonicalUrl = `https://vibesfilm.com/filmes-para/${vibe.slug}`;

  // JSON-LD ItemList para Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: vibe.title,
    description: vibe.seo.description,
    numberOfItems: movies.length,
    itemListElement: movies.map((m, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: m.title,
        dateCreated: m.year ? String(m.year) : undefined,
        image: m.thumbnail ? getBlogImageUrl(m.thumbnail) : undefined,
        director: m.director ? { '@type': 'Person', name: m.director } : undefined,
        aggregateRating: m.imdbRating ? {
          '@type': 'AggregateRating',
          ratingValue: m.imdbRating,
          bestRating: 10,
          worstRating: 1,
          ratingCount: 100
        } : undefined
      }
    }))
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#FDFFFC',
      paddingBottom: '80px'
    }}>
      {/* SEO Tags */}
      <Helmet>
        <title>{vibe.seo.title}</title>
        <meta name="description" content={vibe.seo.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={vibe.seo.title} />
        <meta property="og:description" content={vibe.seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        {movies[0]?.thumbnail && (
          <meta property="og:image" content={getBlogImageUrl(movies[0].thumbnail)} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={vibe.seo.title} />
        <meta name="twitter:description" content={vibe.seo.description} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Top Bar / Navigation */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '20px 16px 0' : '36px 32px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94A3B8',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#3B82F6'}
          onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
        >
          <ArrowLeft size={16} />
          <span>Explorar mais no Blog</span>
        </Link>

        {/* Botão Compartilhar Coleção */}
        <button
          onClick={async () => {
            const shareTitle = `${vibe.title} | VibesFilm`;
            const shareText = `🎬 Filmes selecionados para: "${vibe.title}"\n\nVeja a lista com sinopses e onde assistir:\n${canonicalUrl}`;
            
            if (navigator.share) {
              try {
                await navigator.share({ title: shareTitle, text: shareText });
                return;
              } catch { /* cancelado */ }
            }
            try {
              await navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            } catch (e) {
              console.error(e);
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: copied ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${copied ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '8px',
            color: copied ? '#60A5FA' : '#E2E8F0',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? <Check size={14} color="#60A5FA" /> : <Share2 size={14} />}
          <span>{copied ? 'Link Copiado!' : 'Compartilhar Coleção'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <header style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '24px 16px 36px' : '36px 32px 48px',
        textAlign: 'center'
      }}>
        {/* H1 Principal */}
        <h1 style={{
          fontSize: isMobile ? '1.85rem' : '2.85rem',
          fontWeight: 800,
          color: '#FDFFFC',
          marginBottom: '16px',
          lineHeight: '1.15',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}>
          {vibe.title}
        </h1>

        {/* Subtítulo / Pergunta da Jornada */}
        {vibe.optionText && (
          <p style={{
            color: '#94A3B8',
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            maxWidth: '750px',
            margin: '0 auto 20px',
            lineHeight: '1.5',
            fontStyle: 'italic'
          }}>
            "{vibe.optionText}"
          </p>
        )}

        {/* Contador */}
        <p style={{
          color: '#E2E8F0',
          fontSize: isMobile ? '0.9rem' : '1rem',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Film size={15} color="#3B82F6" />
          <span>{movies.length} {movies.length === 1 ? 'filme selecionado' : 'filmes selecionados a dedo'}</span>
        </p>
      </header>

      {/* Movies List (Layout de Cards do Blog) */}
      <main style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '0 16px 40px' : '0 32px 48px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
          {movies.map((movie, index) => {
            const tierColor = getTierColor(movie.tier);

            return (
              <article
                key={movie.id}
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(2, 44, 73, 0.35)',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.3s ease',
                  padding: isMobile ? '16px' : '20px',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '16px' : '24px',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.55)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Coluna 1: Poster do Filme */}
                <div style={{
                  width: isMobile ? '100%' : '170px',
                  flexShrink: 0
                }}>
                  <Link
                    to={`/filme/${movie.slug}`}
                    style={{
                      display: 'block',
                      position: 'relative',
                      aspectRatio: '2/3',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {movie.thumbnail ? (
                      <img
                        src={getBlogImageUrl(movie.thumbnail)}
                        alt={movie.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Film size={36} color="#64748B" />
                      </div>
                    )}

                    {/* Tag de Posição / Relevância */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(1, 22, 39, 0.85)',
                      color: tierColor,
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${tierColor}40`
                    }}>
                      #{index + 1} • ★ {movie.relevanceScore.toFixed(1)}
                    </div>
                  </Link>
                </div>

                {/* Coluna 2: Informações e Racional da Curadoria */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    {/* Linha de Metadados e Badges Emocionais */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {movie.badges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60A5FA',
                              border: '1px solid rgba(59, 130, 246, 0.25)'
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#94A3B8',
                        fontSize: '13px'
                      }}>
                        {movie.year && <span>{movie.year}</span>}
                        {movie.runtime && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#F59E0B" />
                            {formatRuntime(movie.runtime)}
                          </span>
                        )}
                        {movie.imdbRating && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#FCD34D' }}>
                            <Star size={12} fill="#FCD34D" color="#FCD34D" />
                            {movie.imdbRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Título do Filme */}
                    <h2 style={{
                      fontSize: isMobile ? '1.25rem' : '1.45rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      lineHeight: '1.25'
                    }}>
                      <Link
                        to={`/filme/${movie.slug}`}
                        style={{
                          color: '#FDFFFC',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#60A5FA'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#FDFFFC'}
                      >
                        {movie.title}
                      </Link>
                    </h2>

                    {/* Diretor e Gêneros */}
                    <p style={{
                      color: '#94A3B8',
                      fontSize: '13px',
                      marginBottom: '12px'
                    }}>
                      {movie.director && <span>Direção: <strong>{movie.director}</strong> • </span>}
                      <span>{movie.genres.join(', ')}</span>
                    </p>

                    {/* Racional da Curadoria (Texto Emocional da JOF) */}
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: '3px solid #3B82F6',
                      borderRadius: '0 8px 8px 0',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#60A5FA',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}>
                        <Heart size={12} />
                        <span>Por que assistir nesta vibe</span>
                      </div>
                      <p style={{
                        color: '#E2E8F0',
                        fontSize: '13.5px',
                        lineHeight: '1.55',
                        margin: 0
                      }}>
                        {movie.reason}
                      </p>
                    </div>

                    {/* Chamado Especial de Artigo Dedicado no Blog */}
                    {movie.blogArticle && (
                      <div style={{
                        marginTop: '10px',
                        marginBottom: '12px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.12) 0%, rgba(255, 107, 53, 0.04) 100%)',
                        border: '1px solid rgba(255, 107, 53, 0.35)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
                          <span style={{ fontSize: '20px' }}>📖</span>
                          <div>
                            <div style={{
                              fontSize: '11px',
                              color: '#FF6B35',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '2px'
                            }}>
                              Análise Especial no Blog
                            </div>
                            <div style={{
                              fontSize: '13.5px',
                              color: '#FDFFFC',
                              fontWeight: 600,
                              lineHeight: '1.3'
                            }}>
                              {movie.blogArticle.title}
                            </div>
                          </div>
                        </div>

                        <Link
                          to={movie.blogArticle.url}
                          style={{
                            backgroundColor: '#FF6B35',
                            color: '#FFFFFF',
                            padding: '7px 16px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.35)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#E55A2B';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF6B35';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Ler Análise →
                        </Link>
                      </div>
                    )}

                    {/* Onde Assistir (Plataformas de Streaming) */}
                    {movie.streamingPlatforms.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginBottom: '6px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#94A3B8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Tv size={13} />
                          Onde assistir:
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {movie.streamingPlatforms.map((p) => {
                            const logoUrl = getPlatformLogoUrlSmall(p.logoPath || null, p.name);

                            return (
                              <div
                                key={p.id}
                                title={p.name}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  fontSize: '12px',
                                  color: '#FDFFFC'
                                }}
                              >
                                {logoUrl ? (
                                  <img
                                    src={logoUrl}
                                    alt={p.name}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      borderRadius: '3px',
                                      objectFit: 'contain'
                                    }}
                                  />
                                ) : (
                                  <Tv size={12} color="#60A5FA" />
                                )}
                                <span>{p.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rodapé do Card: Ação para Ficha Completa */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <Link
                      to={`/filme/${movie.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#60A5FA',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'gap 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#93C5FD';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#60A5FA';
                      }}
                    >
                      <span>Ver ficha completa & trailer</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Laranja idêntico ao BlogHero */}
        <section style={{
          marginTop: '56px',
          padding: isMobile ? '28px 20px' : '40px 40px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(2, 44, 73, 0.8) 0%, rgba(1, 22, 39, 0.95) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.25)',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 107, 53, 0.15)',
            color: '#FF6B35',
            marginBottom: '16px'
          }}>
            <Compass size={24} />
          </div>

          <h3 style={{
            fontSize: isMobile ? '1.4rem' : '1.85rem',
            fontWeight: 800,
            color: '#FDFFFC',
            marginBottom: '10px'
          }}>
            Descubra filmes que combinam com o seu momento.
          </h3>

          <p style={{
            color: '#E0E0E0',
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            maxWidth: '620px',
            margin: '0 auto 28px',
            lineHeight: '1.6'
          }}>
            O Vibesfilm foi construído para encontrar o filme que conversa exatamente com seu estado de espírito atual em menos de 2 minutos.
          </p>

          <a
            href="/app"
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#E55A2B';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 107, 53, 0.4)';
            }}
          >
            🎯 Descobrir Minha Vibe
          </a>
        </section>
      </main>
    </div>
  );
}
