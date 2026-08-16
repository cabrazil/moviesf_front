import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { blogApi, type DailyCuration, type DailyCurationMovie } from '../../services/blogApi';
import { getBlogImageUrl } from '../../utils/blogImages';

// Injetar animações CSS
const cssAnimations = `
  @keyframes dailyCurationFadeIn {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dailyCurationShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes dailyCurationGlow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
`;

if (typeof document !== 'undefined') {
  const id = 'daily-curation-styles';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = cssAnimations;
    document.head.appendChild(style);
  }
}

/**
 * Seção editorial "Perfeito para Hoje" — curadoria diária de filmes.
 * Exibe a frase emocional + posters dos filmes curados.
 * Retorna null silenciosamente se não houver curadoria ativa.
 */
export function DailyCurationSection() {
  const [curation, setCuration] = useState<DailyCuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const fetchCuration = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getDailyCuration();
        setCuration(data);
      } catch (err) {
        console.error('Erro ao buscar curadoria diária:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCuration();
  }, []);

  // Não renderizar se carregando ou sem curadoria
  if (loading) {
    return <CurationSkeleton isMobile={isMobile} />;
  }

  if (!curation || curation.movies.length === 0) {
    return null;
  }

  // Lógica de navegação do "Explorar"
  const mainMovie = curation.movies[0];
  const exploreLink = mainMovie.pillarArticle
    ? `/analise/${mainMovie.pillarArticle.slug}`
    : `/filme/${mainMovie.slug}`;

  // Limpar emojis iniciais do título do botão para não duplicar com o ícone Sparkles
  const cleanTitle = (curation.buttonTitle || 'Perfeito para Hoje')
    .replace(/^[^\w\sÀ-ÿ]+/, '')
    .trim();

  return (
    <section
      id="daily-curation"
      style={{
        padding: isMobile ? '40px 16px' : '56px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        animation: 'dailyCurationFadeIn 0.8s ease-out',
      }}
    >
      {/* Container com glassmorphism sutil */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(2, 44, 73, 0.6) 0%, rgba(1, 22, 39, 0.8) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.15)',
          borderRadius: '20px',
          padding: isMobile ? '32px 20px' : '48px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow decorativo no background */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
            animation: 'dailyCurationGlow 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
            animation: 'dailyCurationGlow 5s ease-in-out infinite 1s',
            pointerEvents: 'none',
          }}
        />

        {/* Header: Badge em destaque + Descrição editorial */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.18) 0%, rgba(255, 107, 53, 0.05) 100%)',
              border: '1px solid rgba(255, 107, 53, 0.35)',
              boxShadow: '0 2px 10px rgba(255, 107, 53, 0.15)',
            }}
          >
            <Sparkles
              size={isMobile ? 18 : 22}
              style={{ color: '#FF6B35', flexShrink: 0 }}
            />
            <h3
              style={{
                fontSize: isMobile ? '0.9rem' : '1.05rem',
                fontWeight: '800',
                color: '#FF6B35',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                margin: 0,
                display: 'inline-block',
              }}
            >
              {cleanTitle}
            </h3>
          </div>

          <span
            style={{
              fontSize: isMobile ? '0.8rem' : '0.88rem',
              color: '#B0BEC5',
              fontWeight: '400',
              letterSpacing: '0.01em',
            }}
          >
            Nossa recomendação editorial desta semana.
          </span>
        </div>

        {/* Frase editorial — tipografia destaque */}
        <h2
          style={{
            fontSize: isMobile ? '1.3rem' : '1.75rem',
            fontWeight: '300',
            color: '#FDFFFC',
            lineHeight: '1.5',
            fontStyle: 'italic',
            fontFamily: '"Georgia", "Times New Roman", serif',
            marginBottom: isMobile ? '28px' : '36px',
            maxWidth: '600px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {curation.headerPhrase}
        </h2>

        {/* Grid de posters dos filmes — Scroll horizontal suave em todas as telas */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '14px' : '20px',
            marginBottom: isMobile ? '24px' : '32px',
            overflowX: 'auto',
            overflowY: 'visible',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingTop: '8px', // Espaço para a animação de hover (-6px)
            paddingBottom: '12px',
            paddingRight: isMobile ? '16px' : '24px',
            maxWidth: '100%',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {curation.movies.map((movie, index) => (
            <MoviePosterCard
              key={movie.id}
              movie={movie}
              index={index}
              isMobile={isMobile}
              isMain={index === 0}
            />
          ))}
          {/* Elemento de respiro no final do scroll para nunca cortar o último card à direita */}
          <div style={{ width: isMobile ? '12px' : '20px', flexShrink: 0, opacity: 0 }} />
        </div>

        {/* Link "Explorar esta curadoria →" */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link
            to={exploreLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FF6B35',
              textDecoration: 'none',
              fontSize: isMobile ? '0.9rem' : '0.95rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              padding: '8px 0',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FF8F5E';
              e.currentTarget.style.gap = '12px';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#FF6B35';
              e.currentTarget.style.gap = '8px';
            }}
          >
            Explorar esta curadoria
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Card individual de poster de filme
 */
function MoviePosterCard({
  movie,
  index,
  isMobile,
  isMain,
}: {
  movie: DailyCurationMovie;
  index: number;
  isMobile: boolean;
  isMain: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Construir URL do poster (trata URLs completas do Supabase e caminhos relativos do TMDB)
  const posterUrl = movie.thumbnail
    ? (movie.thumbnail.startsWith('http://') || movie.thumbnail.startsWith('https://'))
      ? getBlogImageUrl(movie.thumbnail)
      : movie.thumbnail.startsWith('/')
        ? `https://image.tmdb.org/t/p/w500${movie.thumbnail}`
        : getBlogImageUrl(movie.thumbnail)
    : null;

  const cardWidth = isMobile
    ? isMain ? '140px' : '120px'
    : isMain ? '180px' : '155px';

  const linkTo = movie.slug ? `/filme/${movie.slug}` : '#';

  return (
    <Link
      to={linkTo}
      style={{
        textDecoration: 'none',
        flexShrink: 0,
        scrollSnapAlign: isMobile ? 'start' : undefined,
        animation: `dailyCurationFadeIn 0.6s ease-out ${index * 0.12}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: cardWidth,
          position: 'relative',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
          transform: isHovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        }}
      >
        {/* Poster image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '2/3',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#022c49',
            position: 'relative',
            border: isHovered
              ? '1px solid rgba(255, 107, 53, 0.4)'
              : isMain
                ? '1px solid rgba(255, 107, 53, 0.25)'
                : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: isHovered
              ? '0 12px 32px rgba(255, 107, 53, 0.15), 0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.25)',
            transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
          }}
        >
          {/* Badge 'Nossa Escolha' para o 1º filme */}
          {isMain && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                zIndex: 2,
                background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
                color: '#FFFFFF',
                fontSize: isMobile ? '0.58rem' : '0.62rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                pointerEvents: 'none',
              }}
            >
              <Star size={10} style={{ fill: '#FFFFFF', color: '#FFFFFF' }} />
              Nossa Escolha
            </div>
          )}

          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`Poster de ${movie.title}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.display = 'flex';
                  parent.style.alignItems = 'center';
                  parent.style.justifyContent = 'center';
                  const fallback = document.createElement('span');
                  fallback.textContent = '🎬';
                  fallback.style.fontSize = '2rem';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #022c49, #011627)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>🎬</span>
            </div>
          )}
        </div>

        {/* Título + Ano abaixo do poster */}
        <div style={{ marginTop: '10px', paddingLeft: '2px' }}>
          <div
            style={{
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontWeight: '600',
              color: isHovered ? '#FDFFFC' : '#E0E0E0',
              lineHeight: '1.3',
              transition: 'color 0.3s ease',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {isMain && (
              <Star
                size={14}
                style={{
                  color: '#FF6B35',
                  fill: '#FF6B35',
                  display: 'inline-block',
                  marginRight: '4px',
                  verticalAlign: '-1px',
                  flexShrink: 0,
                }}
              />
            )}
            {movie.title}
          </div>
          {movie.year && (
            <div
              style={{
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                color: '#9E9E9E',
                marginTop: '3px',
              }}
            >
              {movie.year}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Skeleton loading — layout sutil enquanto carrega
 */
function CurationSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      style={{
        padding: isMobile ? '40px 16px' : '56px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(2, 44, 73, 0.3) 0%, rgba(1, 22, 39, 0.4) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: isMobile ? '32px 20px' : '48px 48px',
        }}
      >
        {/* Label skeleton */}
        <div
          style={{
            width: '140px',
            height: '14px',
            borderRadius: '6px',
            marginBottom: '20px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'dailyCurationShimmer 1.5s infinite',
          }}
        />
        {/* Phrase skeleton */}
        <div
          style={{
            width: '80%',
            maxWidth: '400px',
            height: '20px',
            borderRadius: '6px',
            marginBottom: '12px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'dailyCurationShimmer 1.5s infinite 0.1s',
          }}
        />
        <div
          style={{
            width: '50%',
            maxWidth: '250px',
            height: '20px',
            borderRadius: '6px',
            marginBottom: '36px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'dailyCurationShimmer 1.5s infinite 0.2s',
          }}
        />
        {/* Poster skeletons */}
        <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: isMobile ? (i === 0 ? '140px' : '120px') : (i === 0 ? '180px' : '155px'),
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: `dailyCurationShimmer 1.5s infinite ${0.1 * i}s`,
                }}
              />
              <div
                style={{
                  width: '70%',
                  height: '12px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: `dailyCurationShimmer 1.5s infinite ${0.15 * i}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
