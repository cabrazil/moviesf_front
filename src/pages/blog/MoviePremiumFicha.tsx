import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Play, Users, ChevronDown, ChevronUp, BookOpen, Sparkles, Film, ArrowRight, Share2, Check } from 'lucide-react';
import { getPlatformLogoUrlMedium } from '../../services/streaming.service';
import { getBlogImageUrl } from '../../utils/blogImages';
import tmdbLogo from '../../assets/themoviedb.png';
import imdbLogo from '../../assets/imdb.png';
import rtLogo from '../../assets/rottentomatoes.png';
import metacriticLogo from '../../assets/metascore.svg';

interface SimilarMovieData {
  id: string;
  title: string;
  year?: number;
  thumbnail?: string;
  slug?: string;
  relevanceScore?: number | string;
  journeyOptionFlowId?: number;
  displayTitle?: string;
}

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
  vote_average?: number;
  vote_count?: number;
  imdbRating?: number;
  rottenTomatoesRating?: number;
  metacriticRating?: number;
  genres?: string[];
  landingPageHook?: string;
  hasAnalysisArticle?: boolean;
  analysisArticleSlug?: string | null;
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
  } catch (e) {
    return landingPageHook;
  }
};

const normalizeMovieData = (rawMovie: any): MovieData => {
  const oscarAwards = rawMovie?.oscarAwards
    ? {
        totalWins: Number(rawMovie.oscarAwards.totalWins) || 0,
        totalNominations: Number(rawMovie.oscarAwards.totalNominations) || 0,
        wins: Array.isArray(rawMovie.oscarAwards.wins) ? rawMovie.oscarAwards.wins : [],
        nominations: Array.isArray(rawMovie.oscarAwards.nominations) ? rawMovie.oscarAwards.nominations : [],
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
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [showFullCast, setShowFullCast] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovieData[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovieData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';
        const response = await fetch(`${baseURL}/api/movie/${slug}/hero`);
        if (!response.ok) throw new Error('Filme não encontrado');
        
        const data = await response.json();
        setMovie(normalizeMovieData(data.movie));
        setSubscriptionPlatforms(data.subscriptionPlatforms || []);
        setRentalPlatforms(data.rentalPurchasePlatforms || []);
        setSimilarMovies(data.similarMovies || []);
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
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'googlebot', 'index, follow');
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
            <div className="premium-hero-genres" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
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

            {/* Notas da Crítica */}
            {(typeof movie.imdbRating === 'number' || typeof movie.rottenTomatoesRating === 'number' || typeof movie.metacriticRating === 'number' || typeof movie.vote_average === 'number') && (
              <div className="premium-hero-ratings" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '28px'
              }}>
                {/* IMDb */}
                {typeof movie.imdbRating === 'number' && movie.imdbRating > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(245, 197, 24, 0.1)',
                    border: '1px solid rgba(245, 197, 24, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }} title="Nota IMDb">
                    <img src={imdbLogo} alt="IMDb" style={{ width: '26px', height: 'auto', display: 'block' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#F5C518' }}>
                      {movie.imdbRating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Rotten Tomatoes */}
                {typeof movie.rottenTomatoesRating === 'number' && movie.rottenTomatoesRating > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(250, 50, 10, 0.1)',
                    border: '1px solid rgba(250, 50, 10, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }} title="Rotten Tomatoes Tomatometer">
                    <img src={rtLogo} alt="Rotten Tomatoes" style={{ width: '18px', height: '18px', objectFit: 'contain', display: 'block' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FA320A' }}>
                      {movie.rottenTomatoesRating}%
                    </span>
                  </div>
                )}

                {/* Metacritic */}
                {typeof movie.metacriticRating === 'number' && movie.metacriticRating > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(51, 204, 51, 0.1)',
                    border: '1px solid rgba(51, 204, 51, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }} title="Metascore">
                    <img src={metacriticLogo} alt="Metacritic" style={{ width: '18px', height: '18px', display: 'block' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#66CC33' }}>
                      {movie.metacriticRating}
                    </span>
                  </div>
                )}

                {/* TMDb */}
                {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(1, 180, 228, 0.1)',
                    border: '1px solid rgba(1, 180, 228, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }} title="Avaliação TMDB">
                    <img src={tmdbLogo} alt="TMDb" style={{ width: '18px', height: 'auto', display: 'block' }} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#01B4E4' }}>
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            )}

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
            <div className="premium-hero-actions" style={{ 
              display: 'flex', 
              gap: '24px', 
              marginTop: '10px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
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
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)',
                height: '48px'
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

              {/* Seção App Mobile Integrada na Linha */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.85)', 
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  marginBottom: '2px'
                }}>
                  Sua vibe pede um filme. <span style={{ color: '#FF6B35', textShadow: '0 0 10px rgba(255, 107, 53, 0.3)' }}>Abra no App:</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'center'
                }}>
                  {/* CTA Google Play */}
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.vibesfilm.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Android</span>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Google Play</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.60938 1.95312C3.375 2.1875 3.23438 2.5625 3.23438 3.03125V20.9688C3.23438 21.4375 3.375 21.8125 3.60938 22.0469L3.65625 22.0938L13.7344 12.0156V11.9844L3.65625 1.90625L3.60938 1.95312Z" fill="#00E3FF"/>
                      <path d="M17.0625 15.3438L13.7344 12.0156V11.9844L17.0625 8.65625L17.1094 8.6875L21.0469 10.9219C22.1719 11.5625 22.1719 12.4375 21.0469 13.0781L17.1094 15.3125L17.0625 15.3438Z" fill="#FFE000"/>
                      <path d="M17.1094 15.3125L13.7344 11.9844L3.65625 22.0469C4.03125 22.4375 4.64062 22.4844 5.34375 22.0938L17.1094 15.3125Z" fill="#FF3A44"/>
                      <path d="M17.1094 8.6875L5.34375 1.90625C4.64062 1.51562 4.03125 1.5625 3.65625 1.95312L13.7344 12.0156L17.1094 8.6875Z" fill="#32FF7E"/>
                    </svg>
                  </a>

                  {/* CTA iOS */}
                  <a 
                    href="https://apps.apple.com/br/app/vibesfilm/id6764453105"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>iOS</span>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Apple Store</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.97 12.01 4.72 9c.88-1.52 2.41-2.48 4.11-2.51 1.27-.02 2.46.87 3.24.87.78 0 2.22-1.05 3.75-.9.65.02 2.46.25 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.3 2.72zM12.91 5.99c.02-.01.05-.03.08-.06.53-.63.89-1.51.77-2.41-.02-.03-.04-.07-.07-.09-.9.04-1.78.61-2.26 1.21-.02.03-.04.05-.05.08-.53.64-.88 1.55-.74 2.44.02.03.05.07.08.08.06.01.12.02.18.02.73 0 1.52-.39 2.01-.89z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Barra de Compartilhamento Rápido */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                Indicar Filme:
              </span>

              {/* Botão WhatsApp */}
              <button
                onClick={() => {
                  if (!movie) return;
                  const url = window.location.href;
                  const text = `🎬 Olha essa recomendação no VibesFilm: *${movie.title}* (${movie.year})\n👉 Veja a vibe e onde assistir: ${url}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.35)',
                  borderRadius: '8px',
                  color: '#25D366',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.35)';
                  e.currentTarget.style.transform = 'none';
                }}
                title="Indicar no WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                WhatsApp
              </button>

              {/* Botão Copiar / Compartilhar */}
              <button
                onClick={async () => {
                  if (!movie) return;
                  const url = window.location.href;
                  const title = `${movie.title} (${movie.year}) - VibesFilm`;
                  const text = `🎬 Olha essa recomendação no VibesFilm: *${movie.title}* (${movie.year})\n👉 Veja a vibe e onde assistir: ${url}`;

                  if (navigator.share) {
                    try {
                      await navigator.share({ title, text, url });
                      return;
                    } catch {
                      // Usuário cancelou, ignora
                    }
                  }

                  try {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  backgroundColor: copied ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${copied ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                  borderRadius: '8px',
                  color: copied ? '#60A5FA' : '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = copied ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = copied ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)';
                }}
                title="Compartilhar ou Copiar Link"
              >
                {copied ? (
                  <>
                    <Check size={15} color="#60A5FA" />
                    <span>Link copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} />
                    <span>Compartilhar</span>
                  </>
                )}
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
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Assinatura ou Gratuito</div>
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
                          position: 'relative'
                        }}
                        onMouseOver={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => platform.baseUrl && (e.currentTarget.style.transform = 'none')}
                        title={platform.accessType === 'FREE_WITH_ADS' ? `${platform.name} - Gratuito com Anúncios` : platform.name}
                      >
                        {platform.accessType === 'FREE_WITH_ADS' && (
                          <span style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            background: '#22c55e',
                            color: '#fff',
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px',
                            zIndex: 1,
                            lineHeight: 1.2
                          }}>GRÁTIS</span>
                        )}
                        <img 
                          src={getPlatformLogoUrlMedium(platform.logoPath, platform.name)} 
                          alt={platform.name}
                          style={{ 
                            width: '56px', height: '56px', 
                            borderRadius: '14px', 
                            border: platform.accessType === 'FREE_WITH_ADS'
                              ? '1px solid rgba(34, 197, 94, 0.5)'
                              : '1px solid rgba(255,255,255,0.2)',
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

          {(unifiedSubs.length > 0 || unifiedRentals.length > 0) && (
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              * Os períodos e termos de teste grátis podem variar. Consulte a plataforma para detalhes atualizados.
            </div>
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
                    
                    let scoreColor = '#EF4444'; // Red default
                    let shadowColor = 'rgba(239, 68, 68, 0.2)';
                    if (rawScore >= 8.5) {
                      scoreColor = '#2563EB'; // Azul Premium
                      shadowColor = 'rgba(37, 99, 235, 0.2)';
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
              {!isSynopsisExpanded && movie.description && movie.description.length > 280 ? (
                <>
                  {movie.description.substring(0, 280)}... 
                  <button 
                    onClick={() => setIsSynopsisExpanded(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#60A5FA',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 600,
                      padding: '0 0 0 5px',
                      fontFamily: 'inherit',
                      display: 'inline-block'
                    }}
                  >
                    Ler mais
                  </button>
                </>
              ) : (
                <>
                  {movie.description}
                  {isSynopsisExpanded && movie.description && movie.description.length > 280 && (
                    <button 
                      onClick={() => setIsSynopsisExpanded(false)}
                      style={{
                        display: 'block',
                        marginTop: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#60A5FA',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        padding: 0,
                        fontFamily: 'inherit'
                      }}
                    >
                      Ver menos
                    </button>
                  )}
                </>
              )}
            </p>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Direção: </span>
              <strong style={{ fontSize: '16px', color: '#fff' }}>{movie.director}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* ======== FASE 3: ELENCO PRINCIPAL & RECONHECIMENTO ======== */}
      {movie.mainCast && movie.mainCast.length > 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={18} color="#60A5FA" />
                <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, margin: 0 }}>
                  Elenco Principal
                </h3>
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                {movie.mainCast.length} atores listados
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: '12px'
            }}>
              {(showFullCast ? movie.mainCast : movie.mainCast.slice(0, 6)).map((actor, idx) => (
                <div key={idx} style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'background 0.2s ease',
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#F1F5F9' }}>
                    {actor.actorName}
                  </span>
                  {actor.characterName && (
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>
                      como {actor.characterName}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {movie.mainCast.length > 6 && (
              <button
                onClick={() => setShowFullCast(!showFullCast)}
                style={{
                  marginTop: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#60A5FA',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 0',
                  fontFamily: 'inherit'
                }}
              >
                {showFullCast ? (
                  <>Ver menos <ChevronUp size={16} /></>
                ) : (
                  <>Ver elenco completo (+{movie.mainCast.length - 6} atores) <ChevronDown size={16} /></>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Premiações e Reconhecimento (quando houver) */}
      {movie.oscarAwards && (awardWins > 0 || awardNominations > 0) && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, rgba(255, 107, 53, 0.04) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '28px' }}>🏆</span>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 215, 0, 0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px', fontWeight: 600 }}>Reconhecimento & Prêmios</div>
              <div style={{ fontSize: '16px', color: '#FFD700', fontWeight: 600 }}>
                {awardWins > 0 ? (
                  <>
                    Vencedor de {awardWins} Oscar{awardWins > 1 ? 's' : ''}
                    {awardNominations > 0 && (
                      <span style={{ color: 'rgba(255, 215, 0, 0.8)', fontWeight: 400 }}> (e {awardNominations} indicações)</span>
                    )}
                  </>
                ) : (
                  <span>Indicado a {awardNominations} Oscar{awardNominations > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== FASE 4: DESTAQUE DE ARTIGO NO BLOG ======== */}
      {movie.hasAnalysisArticle && movie.analysisArticleSlug && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <a
            href={`/artigo/${movie.analysisArticleSlug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/artigo/${movie.analysisArticleSlug}`);
            }}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: '24px 28px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(255, 107, 53, 0.08) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
              color: '#fff',
              flexWrap: 'wrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <BookOpen size={24} color="#60A5FA" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}>
                  Leia a análise Vibesfilm do filme
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  Mais do que contar a história, nossa análise explora suas emoções, escolhas e aquilo que permanece depois dos créditos.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#2563EB',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              flexShrink: 0
            }}>
              <span>Ler Análise</span>
              <ArrowRight size={16} />
            </div>
          </a>
        </div>
      )}

      {/* ======== FASE 5: FILMES QUE CONVERSAM COM ESTA VIBE ======== */}
      {similarMovies && similarMovies.length > 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Sparkles size={18} color="#FF6B35" />
                <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, margin: 0 }}>
                  Filmes que conversam com esta vibe
                </h3>
              </div>
              {similarMovies[0]?.displayTitle && (
                <p style={{ fontSize: '15px', color: '#60A5FA', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                  "{similarMovies[0].displayTitle}"
                </p>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              {similarMovies.slice(0, 6).map((simMovie) => (
                <a
                  key={simMovie.id}
                  href={`/filme/${simMovie.slug || simMovie.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/filme/${simMovie.slug || simMovie.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '2/3', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    {simMovie.thumbnail ? (
                      <img
                        src={getBlogImageUrl(simMovie.thumbnail)}
                        alt={simMovie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Film size={28} color="#334155" />
                      </div>
                    )}
                    {simMovie.relevanceScore && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        color: '#60A5FA',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        ★ {Number(simMovie.relevanceScore).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {simMovie.title}
                    </div>
                    {simMovie.year && (
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                        {simMovie.year}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
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
