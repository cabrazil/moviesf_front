import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Sparkles, 
  Share2, 
  Download, 
  ArrowRight, 
  Check, 
  Compass, 
  Film,
  ExternalLink
} from 'lucide-react';
import { blogApi, type DailyCuration, type DailyCurationMovie } from '../services/blogApi';
import { getBlogImageUrl } from '../utils/blogImages';
import logoBlog from '../assets/logo_header.png';

const APP_STORE_URL = 'https://apps.apple.com/br/app/vibesfilm/id6764453105';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vibesfilm.app';

export function DailyCurationPage() {
  const navigate = useNavigate();
  const [curation, setCuration] = useState<DailyCuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleInstallClick = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(ua);

    if (isIOS) {
      window.open(APP_STORE_URL, '_blank', 'noopener,noreferrer');
    } else if (isAndroid) {
      window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    } else {
      setShowInstallModal(true);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCuration = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getDailyCuration();
        setCuration(data);
      } catch (err) {
        console.error('Erro ao carregar curadoria diária:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCuration();
  }, []);


  // Compartilhar nativo (Web Share API) ou copiar link
  const handleShare = async () => {
    if (!curation) return;

    const shareUrl = window.location.origin + '/hoje';
    const movieTitles = curation.movies.map((m) => m.title).join(', ');
    const shareText = `✨ Perfeito para hoje no VibesFilm:\n"${curation.headerPhrase}"\n\n🎬 Filmes selecionados: ${movieTitles}\n\nDescubra onde assistir:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '✨ Perfeito para hoje | VibesFilm',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Se o usuário cancelou o share nativo, não faz nada
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: copiar para área de transferência
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('Link copiado: ' + shareUrl);
    }
  };

  // Título formatado com interrogação e sem emojis iniciais duplicados
  const rawTitle = curation?.buttonTitle || 'Perfeito para Hoje';
  const cleanTitle = rawTitle.replace(/^[^\w\sÀ-ÿ]+/, '').trim().replace(/[.?]+$/, '');
  const displayTitle = `${cleanTitle}?`;
  const firstMovie = curation?.movies?.[0];
  const ogImageUrl = firstMovie?.thumbnail ? getBlogImageUrl(firstMovie.thumbnail) : 'https://vibesfilm.com/og-vibesfilm.png';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#011627',
        color: '#FDFFFC',
        fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Helmet>
        <title>✨ Perfeito para Hoje | VibesFilm</title>
        <meta
          name="description"
          content={
            curation?.headerPhrase ||
            'Uma curadoria de filmes selecionados sob medida para o seu momento e suas emoções.'
          }
        />
        <meta property="og:title" content="✨ Perfeito para Hoje | VibesFilm" />
        <meta
          property="og:description"
          content={curation?.headerPhrase || 'Cada emoção tem um filme.'}
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content="https://vibesfilm.com/hoje" />
      </Helmet>

      {/* ─── Top Bar Minimalista ─── */}
      <header
        style={{
          padding: isMobile ? '0 16px' : '0 24px',
          height: isMobile ? '68px' : '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(1, 22, 39, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={logoBlog}
            alt="VibesFilm"
            style={{
              height: isMobile ? 54 : 70,
              width: 'auto',
              maxWidth: isMobile ? 220 : 380,
              objectFit: 'contain',
            }}
          />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Botão de Baixar App Oficial (App Store / Google Play) */}
          <button
            onClick={handleInstallClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '6px 10px' : '8px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 107, 53, 0.15)',
              border: '1px solid rgba(255, 107, 53, 0.4)',
              color: '#FF6B35',
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Baixar o app VibesFilm no celular"
          >
            <Download size={isMobile ? 13 : 15} />
            <span>Baixar App</span>
          </button>

          {/* Botão de Compartilhar */}
          <button
            onClick={handleShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '20px',
              backgroundColor: copied ? '#2EC4B6' : 'rgba(255, 255, 255, 0.08)',
              border: copied ? '1px solid #2EC4B6' : '1px solid rgba(255, 255, 255, 0.15)',
              color: copied ? '#011627' : '#FDFFFC',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
        </div>
      </header>

      {/* ─── Conteúdo Principal ─── */}
      <main
        style={{
          flex: 1,
          maxWidth: '960px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 16px 64px 16px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#B0BEC5' }}>
            <Sparkles size={32} style={{ color: '#FF6B35', animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
            <p>Buscando a curadoria perfeita para hoje...</p>
          </div>
        ) : !curation || curation.movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#B0BEC5' }}>
            <Film size={40} style={{ color: '#FF6B35', marginBottom: '16px' }} />
            <h2>Nenhuma curadoria ativa no momento.</h2>
            <p style={{ marginTop: '8px' }}>Volte em breve para descobrir novos filmes selecionados.</p>
            <Link
              to="/app/intro"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '24px',
                padding: '12px 24px',
                borderRadius: '30px',
                backgroundColor: '#FF6B35',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Explorar Filmes por Sentimento <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* ─── Hero Editorial ─── */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.05) 100%)',
                  border: '1px solid rgba(255, 107, 53, 0.35)',
                  marginBottom: '16px',
                }}
              >
                <Sparkles size={16} style={{ color: '#FF6B35' }} />
                <span
                  style={{
                    color: '#FF6B35',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {displayTitle}
                </span>
              </div>

              {/* Frase poética */}
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
                  fontWeight: '300',
                  lineHeight: '1.4',
                  fontStyle: 'italic',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  color: '#FDFFFC',
                  maxWidth: '720px',
                  margin: '0 auto 16px auto',
                }}
              >
                "{curation.headerPhrase}"
              </h1>

              <p style={{ color: '#90A4AE', fontSize: '0.95rem', margin: 0 }}>
                {curation.buttonMicrocopy || 'Uma pequena curadoria pensada para o seu momento.'}
              </p>
            </div>

            {/* ─── Grid dos 3 Filmes ─── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: isMobile ? '14px' : '20px',
                maxWidth: isMobile ? '100%' : '780px',
                margin: '0 auto 48px auto',
              }}
            >
              {curation.movies.map((movie, idx) => (
                <MovieCard key={movie.id} movie={movie} order={idx + 1} isMobile={isMobile} />
              ))}
            </div>

            {/* ─── Botão de Compartilhar em Destaque ─── */}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  borderRadius: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FDFFFC',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {copied ? <Check size={18} style={{ color: '#2EC4B6' }} /> : <Share2 size={18} />}
                <span>{copied ? 'Link da Curadoria Copiado!' : 'Indicar esta curadoria para um amigo'}</span>
              </button>
            </div>

            {/* ─── Card de Conversão: A Ponte para a Jornada Emocional ─── */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(2, 44, 73, 0.7) 0%, rgba(1, 22, 39, 0.95) 100%)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '24px',
                padding: '36px 28px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 107, 53, 0.15)',
                  color: '#FF6B35',
                  marginBottom: '16px',
                }}
              >
                <Compass size={28} />
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                  fontWeight: '700',
                  color: '#FDFFFC',
                  marginBottom: '12px',
                }}
              >
                Não é bem essa a sua vibe hoje?
              </h2>

              <p
                style={{
                  fontSize: '0.98rem',
                  color: '#B0BEC5',
                  maxWidth: '560px',
                  margin: '0 auto 24px auto',
                  lineHeight: '1.6',
                }}
              >
                Cada sentimento pede um filme diferente. Conte para o VibesFilm como você está se
                sentindo agora e receba recomendações feitas sob medida para o seu momento.
              </p>

              <button
                onClick={() => navigate('/app/intro')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 32px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5E 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 20px rgba(255, 107, 53, 0.35)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 107, 53, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.35)';
                }}
              >
                <span>Descobrir Minha Vibe</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </main>

      {/* ─── Footer Discreto ─── */}
      <footer
        style={{
          padding: '24px 20px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          color: '#607D8B',
          fontSize: '0.85rem',
        }}
      >
        <p style={{ margin: '0 0 8px 0' }}>
          VibesFilm © {new Date().getFullYear()} — Cada emoção tem um filme.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#90A4AE', textDecoration: 'none' }}>
            Início
          </Link>
          <Link to="/hub" style={{ color: '#90A4AE', textDecoration: 'none' }}>
            Hub
          </Link>
          <Link to="/app/intro" style={{ color: '#90A4AE', textDecoration: 'none' }}>
            Jornada
          </Link>
          <Link to="/privacidade" style={{ color: '#90A4AE', textDecoration: 'none' }}>
            Privacidade
          </Link>
        </div>
      </footer>

      {/* ─── Modal de Download do App Mobile (exibido no Desktop) ─── */}
      {showInstallModal && (
        <div
          onClick={() => setShowInstallModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#011627',
              border: '1px solid rgba(255, 107, 53, 0.4)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>📱</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FDFFFC', fontWeight: '700' }}>
                  Baixe o App VibesFilm
                </h3>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(253, 255, 252, 0.6)',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: 'rgba(253, 255, 252, 0.75)', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 20px 0', textAlign: 'left' }}>
              Descubra filmes que combinam com o seu momento diretamente no seu celular. Disponível gratuitamente para iOS e Android:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  color: '#FDFFFC',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                <span>🍎</span>
                <span>App Store</span>
              </a>

              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  color: '#FDFFFC',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                <span>▶️</span>
                <span>Google Play</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Card individual do filme na página /hoje
 */
function MovieCard({
  movie,
  order,
  isMobile,
}: {
  movie: DailyCurationMovie;
  order: number;
  isMobile: boolean;
}) {
  const posterUrl = movie.thumbnail
    ? movie.thumbnail.startsWith('http://') || movie.thumbnail.startsWith('https://')
      ? getBlogImageUrl(movie.thumbnail)
      : movie.thumbnail.startsWith('/')
      ? `https://image.tmdb.org/t/p/w500${movie.thumbnail}`
      : getBlogImageUrl(movie.thumbnail)
    : null;

  const targetLink = movie.pillarArticle
    ? `/analise/${movie.pillarArticle.slug}`
    : movie.slug
    ? `/filme/${movie.slug}`
    : '#';

  if (isMobile) {
    // ─── Layout Mobile: Card Horizontal Compacto ───
    return (
      <div
        style={{
          backgroundColor: 'rgba(2, 44, 73, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
          padding: '12px',
          alignItems: 'stretch',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Poster à esquerda (largura fixa e proporcional) */}
        <Link
          to={targetLink}
          style={{
            width: '85px',
            flexShrink: 0,
            aspectRatio: '2/3',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#022c49',
            position: 'relative',
            display: 'block',
          }}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#B0BEC5',
              }}
            >
              <Film size={28} />
            </div>
          )}

          {/* Badge da Ordem */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(1, 22, 39, 0.9)',
              border: '1px solid rgba(255, 107, 53, 0.6)',
              color: '#FF6B35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.75rem',
            }}
          >
            {order}
          </div>
        </Link>

        {/* Informações à direita */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: '2px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#FDFFFC',
                margin: '0 0 4px 0',
                lineHeight: '1.3',
              }}
            >
              <Link to={targetLink} style={{ color: 'inherit', textDecoration: 'none' }}>
                {movie.title}
              </Link>
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#90A4AE',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}
            >
              {movie.year && <span>{movie.year}</span>}
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span>•</span>
                  <span>{movie.genres.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>
          </div>

          {/* Botão de Ver Onde Assistir */}
          <Link
            to={targetLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 107, 53, 0.15)',
              border: '1px solid rgba(255, 107, 53, 0.35)',
              color: '#FF6B35',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            <span>Onde assistir</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    );
  }

  // ─── Layout Desktop: Card Vertical Imponente ───
  return (
    <div
      style={{
        backgroundColor: 'rgba(2, 44, 73, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Poster */}
      <Link
        to={targetLink}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          aspectRatio: '2/3',
          backgroundColor: '#022c49',
          overflow: 'hidden',
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#B0BEC5',
            }}
          >
            <Film size={48} />
          </div>
        )}

        {/* Badge da Ordem */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(1, 22, 39, 0.85)',
            border: '1px solid rgba(255, 107, 53, 0.5)',
            color: '#FF6B35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.85rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          {order}
        </div>
      </Link>

      {/* Detalhes do Filme */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#FDFFFC',
              margin: '0 0 6px 0',
              lineHeight: '1.3',
            }}
          >
            <Link
              to={targetLink}
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#FF6B35')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#FDFFFC')}
            >
              {movie.title}
            </Link>
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              color: '#90A4AE',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            {movie.year && <span>{movie.year}</span>}
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span>{movie.genres.slice(0, 2).join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* Botão de Ver Onde Assistir */}
        <Link
          to={targetLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 107, 53, 0.12)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            color: '#FF6B35',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6B35';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.12)';
            e.currentTarget.style.color = '#FF6B35';
          }}
        >
          <span>Ver onde assistir</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
export default DailyCurationPage;
