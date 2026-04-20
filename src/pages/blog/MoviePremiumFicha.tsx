import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Play } from 'lucide-react';
import { getPlatformLogoUrlMedium } from '../../services/streaming.service';
import { getBlogImageUrl } from '../../utils/blogImages';

interface MovieData {
  id: string;
  slug?: string;
  title: string;
  original_title: string;
  year: number;
  description: string;
  director: string;
  runtime: number;
  certification: string;
  thumbnail: string;
  genres?: string[];
  landingPageHook?: string;
  mainCast?: Array<{ actorName: string; characterName: string; order: number }>;
  oscarAwards?: {
    totalWins?: number;
    totalNominations?: number;
    wins?: Array<{ year?: number; category?: string }>;
    nominations?: Array<{ year?: number; category?: string }>;
  } | null;
  mainTrailer?: {
    key: string;
    site: string;
    name: string;
  } | null;
  emotionalTags?: Array<{
    mainSentiment: string;
    subSentiment: string;
    relevance: number;
  }>;
  contentWarnings?: string | null;
  movieSuggestionFlows?: Array<{
    reason: string;
    relevance: number;
    intentionType?: string | null;
    contextualHint?: string | null;
    journeyOptionFlow: {
      text: string;
      displayTitle: string;
      journeyStepFlow: {
        question: string;
        journeyFlow: {
          mainSentiment: {
            name: string;
          };
        };
      };
    };
  }>;
}

interface StreamingPlatform {
  id: string;
  name: string;
  logoPath: string;
  baseUrl?: string;
  accessType?: string;
}

const extractHookText = (landingPageHook?: string): string => {
  if (!landingPageHook) return '';

  try {
    const trimmed = landingPageHook.trim();
    const jsonEndIndex = trimmed.lastIndexOf('}');

    if (jsonEndIndex === -1) {
      return trimmed;
    }

    const textAfterJson = trimmed.substring(jsonEndIndex + 1).trim();
    return textAfterJson.replace(/\s+/g, ' ').trim() || trimmed;
  } catch (error) {
    console.error('Erro ao extrair texto do landingPageHook:', error);
    return landingPageHook;
  }
};

const normalizeMovieData = (rawMovie: MovieData | null | undefined): MovieData | null => {
  if (!rawMovie) return null;

  const oscarAwards = rawMovie.oscarAwards
    ? {
        ...rawMovie.oscarAwards,
        totalWins: rawMovie.oscarAwards.totalWins ?? rawMovie.oscarAwards.wins?.length ?? 0,
        totalNominations: rawMovie.oscarAwards.totalNominations ?? rawMovie.oscarAwards.nominations?.length ?? 0,
      }
    : null;

  return {
    ...rawMovie,
    genres: Array.isArray(rawMovie.genres) ? rawMovie.genres : [],
    emotionalTags: Array.isArray(rawMovie.emotionalTags) ? rawMovie.emotionalTags : [],
    mainCast: Array.isArray(rawMovie.mainCast) ? rawMovie.mainCast : [],
    movieSuggestionFlows: Array.isArray(rawMovie.movieSuggestionFlows) ? rawMovie.movieSuggestionFlows : [],
    oscarAwards,
  };
};

export function MoviePremiumFicha() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [subscriptionPlatforms, setSubscriptionPlatforms] = useState<StreamingPlatform[]>([]);
  const [rentalPlatforms, setRentalPlatforms] = useState<StreamingPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';
        const response = await fetch(`${baseURL}/api/movie/${slug}/hero`);
        if (!response.ok) throw new Error('Filme não encontrado');
        
        const data = await response.json();
        setMovie(normalizeMovieData(data.movie));
        setSubscriptionPlatforms(data.subscriptionPlatforms || []);
        setRentalPlatforms(data.rentalPurchasePlatforms || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchMovieData();
    }
  }, [slug]);

  useEffect(() => {
    if (loading) {
      document.body.setAttribute('data-movie-page-loaded', 'false');
      return;
    }

    document.body.setAttribute('data-movie-page-loaded', movie ? 'true' : 'not-found');

    return () => {
      document.body.removeAttribute('data-movie-page-loaded');
    };
  }, [loading, movie]);

  // SEO: atualiza <title> e meta tags via DOM diretamente (sem react-helmet)
  useEffect(() => {
    if (!movie) return;
    const fallbackDesc = `Curadoria e análise emocional do filme ${movie.title}`;
    const desc = movie.landingPageHook ||
      (movie.description?.trim() ? movie.description.substring(0, 155) + '...' : fallbackDesc);

    document.title = `${movie.title} (${movie.year}) - Análise e Onde Assistir | VibesFilm`;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}='${key}']`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'description', desc);
    setMeta('property', 'og:type', 'video.movie');
    setMeta('property', 'og:title', `${movie.title} (${movie.year}) - Análise e Onde Assistir`);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', getBlogImageUrl(movie.thumbnail));
    setMeta('property', 'og:url', `https://vibesfilm.com/filme/${movie.slug || movie.id}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', `${movie.title} (${movie.year}) - VibesFilm`);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', getBlogImageUrl(movie.thumbnail));

    // Schema.org JSON-LD
    const existingScript = document.querySelector('script[data-movie-schema]');
    if (existingScript) existingScript.remove();
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: movie.title,
      image: getBlogImageUrl(movie.thumbnail),
      dateCreated: `${movie.year}-01-01`,
      director: { '@type': 'Person', name: movie.director },
      description: movie.description,
      actor: movie.mainCast?.slice(0, 4).map(c => ({
        '@type': 'PerformanceRole',
        actor: { '@type': 'Person', name: c.actorName },
        characterName: c.characterName
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-movie-schema', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.querySelector('script[data-movie-schema]')?.remove();
    };
  }, [movie]);

  // Função para unificar plataformas com múltiplos accessTypes (ex: Apple TV Aluguel vs Compra)
  const unifyPlatforms = (platforms: StreamingPlatform[]) => {
    const platformMap = new Map<string, StreamingPlatform>();
    platforms.forEach(platform => {
      const existing = platformMap.get(platform.name);
      if (existing) {
        if (existing.accessType !== platform.accessType) {
          if ((existing.accessType === 'RENTAL' && platform.accessType === 'PURCHASE') ||
              (existing.accessType === 'PURCHASE' && platform.accessType === 'RENTAL')) {
            // Mantém um deles apenas
          } else {
            platformMap.set(platform.name, existing);
          }
        }
      } else {
        platformMap.set(platform.name, platform);
      }
    });
    return Array.from(platformMap.values());
  };

  const unifiedSubs = unifyPlatforms(subscriptionPlatforms);
  const unifiedRentals = unifyPlatforms(rentalPlatforms);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={32} color="#60A5FA" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
        <h2>Filme não encontrado</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          Voltar para Home
        </button>
      </div>
    );
  }

  const hookText = extractHookText(movie.landingPageHook);
  const awardWins = movie.oscarAwards?.totalWins ?? 0;
  const awardNominations = movie.oscarAwards?.totalNominations ?? 0;

  return (
    <>
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        color: '#fff',
        backgroundColor: '#050B14',
        paddingBottom: '80px',
        marginBottom: '-80px'
      }}>
      {/* 
        ======== FASE 1: O HERO DINÂMICO ======== 
        Fundo com a imagem do póster ultra borrada para criar a atmosfera ("Vignette")
      */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'end',
        paddingBottom: '40px',
        overflow: 'hidden'
      }}>
        
        {/* Layer 1: Imagem de Fundo Desfocada */}
        <div style={{
          position: 'absolute',
          top: -20, left: -20, right: -20, bottom: -20,
          backgroundImage: `url(${getBlogImageUrl(movie.thumbnail)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(35px) brightness(0.4) saturate(1.5)',
          zIndex: 1
        }} />

        {/* Layer 2: Gradiente suave para transição ao preto na base */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(5,11,20,0.1) 0%, rgba(5,11,20,0.7) 60%, rgba(5,11,20,1) 100%)',
          zIndex: 2
        }} />

        {/* Layer 3: O Conteúdo da Hero */}
        <div className="premium-hero-layer" style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '40px'
        }}>
          
          {/* Pôster Principal Límpido */}
          <img 
            src={getBlogImageUrl(movie.thumbnail)} 
            alt={movie.title}
            style={{
              width: '100%',
              maxWidth: '240px',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          />

          {/* Dados Vistosos (Título, Ano, etc) */}
          <div style={{ flex: 1, minWidth: '0', paddingBottom: '10px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '10px',
              wordBreak: 'break-word',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              {movie.title}
            </h1>
            
            <div className="premium-hero-metadata" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500,
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              {movie.original_title && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>Título original: {movie.original_title}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>●</span>
                </>
              )}
              <span style={{ color: '#fff' }}>{movie.year}</span>
              {typeof movie.runtime === 'number' && movie.runtime > 0 && (
                <>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>●</span>
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </>
              )}
              {movie.certification && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>●</span>
              )}
              {/* Badge de Classificação */}
              {movie.certification && (
                <span style={{
                  padding: '2px 8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {movie.certification}
                </span>
              )}
            </div>

            {/* Gêneros */}
            <div className="premium-hero-genres" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
              {movie.genres?.map(g => (
                <span key={g} style={{
                  padding: '6px 14px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {g}
                </span>
              ))}
            </div>

            {/* A Vibe do Filme (Landing Page Hook) */}
            {hookText && (
              <div className="premium-hero-vibe" style={{ 
                marginTop: '16px',
                marginBottom: '32px'
              }}>
                <h4 style={{ fontSize: '13px', color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 600 }}>A Vibe do Filme</h4>
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, fontWeight: 300, fontStyle: 'italic' }}>
                  "{hookText}"
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="premium-hero-actions" style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px',
                backgroundColor: '#FF6B35',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s, transform 0.2s',
                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)'
              }} onClick={() => {
                if (movie.mainTrailer?.key) {
                  setIsTrailerOpen(true);
                } else {
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer legendado')}`, '_blank');
                }
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                <Play fill="currentColor" size={20} />
                Assistir Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ======== FASE 2: A BENTO BOX ======== 
        Grid de cards translúcidos "Glassmorphism"
      */}
      <div style={{
        maxWidth: '1200px',
        margin: '-20px auto 60px',
        padding: '0 20px',
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Coluna Esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Onde Assistir (Streaming) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '28px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontWeight: 600 }}>
            Opções de Streaming
          </h3>
          
          {unifiedSubs.length > 0 || unifiedRentals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {unifiedSubs.length > 0 && (
                <div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Disponível para assinantes</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {unifiedSubs.map(platform => (
                      <a 
                        key={platform.id}
                        href={platform.baseUrl || '#'}
                        target={platform.baseUrl ? "_blank" : undefined}
                        rel={platform.baseUrl ? "noopener noreferrer" : undefined}
                        onClick={!platform.baseUrl ? (e) => e.preventDefault() : undefined}
                        style={{
                          display: 'block',
                          cursor: platform.baseUrl ? 'pointer' : 'default',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'none')}
                        title={platform.name}
                      >
                        <img 
                          src={getPlatformLogoUrlMedium(platform.logoPath, platform.name)} 
                          alt={platform.name}
                          style={{ 
                            width: '56px', height: '56px', 
                            borderRadius: '14px', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            opacity: platform.baseUrl ? 1 : 0.6
                          }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {unifiedRentals.length > 0 && (
                <div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Alugar ou Comprar</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {unifiedRentals.map(platform => (
                      <a
                        key={platform.id}
                        href={platform.baseUrl || '#'}
                        target={platform.baseUrl ? "_blank" : undefined}
                        rel={platform.baseUrl ? "noopener noreferrer" : undefined}
                        onClick={!platform.baseUrl ? (e) => e.preventDefault() : undefined}
                        style={{
                          display: 'block',
                          cursor: platform.baseUrl ? 'pointer' : 'default',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'none')}
                        title={platform.name}
                      >
                        <img 
                          src={getPlatformLogoUrlMedium(platform.logoPath, platform.name)} 
                          alt={platform.name}
                          style={{ 
                            width: '56px', height: '56px', 
                            borderRadius: '14px', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            opacity: platform.baseUrl ? 0.9 : 0.5 
                          }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
              Atualmente sem opções oficiais de streaming no Brasil.
            </p>
          )}
        </div>

          {/* Card: Alerta de Conteúdo */}
          {movie.contentWarnings && (() => {
            const hasWarning = !movie.contentWarnings!.toLowerCase().includes('nenhum alerta');
            const rawText = movie.contentWarnings!.replace(/^aten[çc][ãa]o:\s*/i, '').trim();
            const alertText = rawText.charAt(0).toUpperCase() + rawText.slice(1);
            return (
              <div style={{
                background: hasWarning
                  ? 'rgba(255, 183, 77, 0.05)'
                  : 'rgba(76, 175, 80, 0.05)',
                border: `1px solid ${hasWarning ? 'rgba(255, 183, 77, 0.25)' : 'rgba(76, 175, 80, 0.25)'}`,
                borderRadius: '16px',
                padding: '20px 24px',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>
                  {hasWarning ? '⚠️' : '✅'}
                </span>
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: hasWarning ? '#FFB74D' : '#66BB6A',
                    marginBottom: '8px',
                  }}>
                    {hasWarning ? 'Alerta de Conteúdo' : 'Verificação de Conteúdo'}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {alertText}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Card 4: Ressoa com quem busca (SubSentiments) */}
          {movie.emotionalTags && movie.emotionalTags.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '28px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontWeight: 600 }}>
                Este filme ressoa com quem busca:
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(() => {
                  const sortedTags = [...movie.emotionalTags].sort((a, b) => b.relevance - a.relevance);
                  const uniqueSubs = new Set<string>();
                  for (const tag of sortedTags) {
                    if (uniqueSubs.size < 4) {
                      uniqueSubs.add(tag.subSentiment);
                    }
                  }
                  return Array.from(uniqueSubs).map(sub => (
                    <div key={sub} style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      borderLeft: '3px solid rgba(59, 130, 246, 0.5)',
                      color: '#BFDBFE',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '15px',
                      fontWeight: 400,
                      letterSpacing: '0.3px'
                    }}>
                      {sub}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Card 2 e 3 (Coluna Direita se estiver no desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 2: Avaliação Emocional */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(25, 118, 210, 0.02) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '14px', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontWeight: 600 }}>
              Curadoria VibesFilm: Por que recomendamos?
            </h3>
            
            {movie.movieSuggestionFlows && movie.movieSuggestionFlows.length > 0 ? (() => {
              const topSuggestions = [...movie.movieSuggestionFlows].sort((a, b) => b.relevance - a.relevance).slice(0, 2);
              
              // Mapa tradutor do intentionType vindo do banco (IntentionType Enum)
              const mapIntention = (intention: string | null | undefined): string => {
                if (!intention) return 'Explorar';
                const i = intention.toUpperCase();
                if (i === 'EXPLORE') return 'Explorar';
                if (i === 'TRANSFORM') return 'Transformar';
                if (i === 'MAINTAIN') return 'Manter';
                if (i === 'PROCESS') return 'Processar';
                return 'Explorar';
              };

              // Helper minimalista de fallback
              const inferVerb = (text: string) => {
                const lower = text.toLowerCase();
                if (lower.includes('transform')) return 'Transformar';
                if (lower.includes('mant')) return 'Manter';
                if (lower.includes('process')) return 'Processar';
                if (lower.includes('explor') || lower.includes('mergulh') || lower.includes('exponha') || lower.includes('busc')) return 'Explorar';
                return 'Explorar'; // Default elegante
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {topSuggestions.map((suggestion, index) => {
                    const rawScore = Number(suggestion.relevance);
                    const score = rawScore.toFixed(2);
                    
                    let scoreColor = '#6B7280'; // Vermelho suave / Cinza
                    let shadowColor = 'rgba(107, 114, 128, 0.2)';
                    if (rawScore >= 8.5) {
                      scoreColor = '#059669'; // Verde forte
                      shadowColor = 'rgba(5, 150, 105, 0.2)';
                    } else if (rawScore >= 7.5) {
                      scoreColor = '#10B981'; // Verde
                      shadowColor = 'rgba(16, 185, 129, 0.2)';
                    } else if (rawScore >= 6.0) {
                      scoreColor = '#D97706'; // Laranja
                      shadowColor = 'rgba(217, 119, 6, 0.2)';
                    }
                    
                    const mainSentiment = suggestion.journeyOptionFlow?.journeyStepFlow?.journeyFlow?.mainSentiment?.name || 'Curioso(a)';
                    
                    // Prioriza a intenção exata extraída do banco, senão cai na heurística
                    const actionVerb = suggestion.intentionType 
                      ? mapIntention(suggestion.intentionType)
                      : inferVerb(suggestion.journeyOptionFlow?.text || '');

                    return (
                      <div key={index} style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Brilho de topo sutil */}
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0,
                          height: '2px',
                          background: scoreColor,
                          opacity: 0.8
                        }} />
                        
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{
                            background: scoreColor,
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 800,
                            lineHeight: 1,
                            boxShadow: `0 4px 12px ${shadowColor}`
                          }}>
                            {score}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '6px' }}>
                              Para quem está <span style={{ color: '#fff' }}>{mainSentiment}</span> e quer <span style={{ color: '#fff' }}>{actionVerb}</span>:
                            </div>
                            {suggestion.journeyOptionFlow?.text && (
                              <div style={{ fontSize: '15px', color: '#60A5FA', fontStyle: 'italic', lineHeight: 1.4, fontWeight: 500 }}>
                                "{suggestion.journeyOptionFlow.text}"
                              </div>
                            )}
                          </div>
                        </div>

                        {suggestion.reason && (
                          <div style={{ 
                            fontSize: '14px', 
                            color: 'rgba(255,255,255,0.75)', 
                            lineHeight: 1.6, 
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            {suggestion.reason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })() : (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>O filme não possui uma avaliação emocional registrada.</p>
            )}
          </div>

          {/* Card 3: Sinopse */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontWeight: 600 }}>Sinopse</h3>
            <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
              {movie.description}
            </p>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Direção: </span>
              <strong style={{ fontSize: '16px', color: '#fff' }}>{movie.director}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* Ficha Técnica: Elenco e Premiações (Filete Inferior) */}
      {(movie.mainCast?.length || movie.oscarAwards) && (
        <div className="premium-ficha-footer" style={{
          maxWidth: '1200px',
          margin: '0 auto 0',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Lado Esquerdo: Elenco Principal */}
          {movie.mainCast && movie.mainCast.length > 0 && (
            <div className="premium-ficha-item" style={{ flex: 1, minWidth: '0' }}>
              <span style={{ fontSize: '24px' }}>🎭</span>
              <div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Elenco Principal</div>
                <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
                  {movie.mainCast.slice(0, 4).map(c => c.actorName).join(', ')}
                </div>
              </div>
            </div>
          )}

          {/* Lado Direito: Premiações */}
          {movie.oscarAwards && (awardWins > 0 || awardNominations > 0) && (
            <div className="premium-ficha-item">
              <span style={{ fontSize: '24px' }}>🏆</span>
              <div>
                <div style={{ fontSize: '13px', color: 'rgba(255,215,0,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Reconhecimento</div>
                <div style={{ fontSize: '16px', color: '#FFD700', fontWeight: 500 }}>
                  {awardWins > 0 ? (
                    <>
                      Vencedor de {awardWins} Oscar{awardWins > 1 ? 's' : ''}
                      {awardNominations > 0 && (
                        <span style={{ color: 'rgba(255,215,0,0.7)', fontWeight: 300 }}> (e {awardNominations} indicações)</span>
                      )}
                    </>
                  ) : (
                    <span>Indicado a {awardNominations} Oscar{awardNominations > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      </div>

      {/* Modal do Trailer */}
      {isTrailerOpen && movie?.mainTrailer?.key && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }}
        onClick={() => setIsTrailerOpen(false)}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: '#000',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', backgroundColor: '#111', borderRadius: '16px 16px 0 0' }}>
              <button 
                onClick={() => setIsTrailerOpen(false)}
                style={{
                  background: 'none', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 600, opacity: 0.7, transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                ✕ Fechar
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${movie?.mainTrailer?.key}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '0 0 16px 16px' }}
              />
            </div>
          </div>
        </div>
      )}

    </>
  );
}
