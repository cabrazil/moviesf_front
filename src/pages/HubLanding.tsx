import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MovieLiveSearch } from '../components/blog/MovieLiveSearch';
import logoBlog from '../assets/logo_header.png';
import '../styles/app/HubLanding.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

interface DeepLinkMovie {
  title: string;
  year?: number;
  thumbnail?: string;
}

const HubLanding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filmSlug = searchParams.get('filme');

  const [deepLinkMovie, setDeepLinkMovie] = useState<DeepLinkMovie | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Deep link: resolve movie title from slug
  useEffect(() => {
    if (!filmSlug) return;

    fetch(`${API_BASE_URL}/api/movie/${filmSlug}/hero`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data?.movie) {
          setDeepLinkMovie({
            title: data.movie.title,
            year: data.movie.year,
            thumbnail: data.movie.thumbnail,
          });
        }
      })
      .catch(() => {
        // Falha silenciosa — mostra hub normal
        setDeepLinkMovie(null);
      });
  }, [filmSlug]);

  return (
    <div className="hub-landing">
      {/* ─── Header ─── */}
      <header className="hub-header">
        <img
          src={logoBlog}
          alt="VibesFilm"
          className="hub-logo"
        />
        <p className="hub-tagline">Cada emoção tem um filme.</p>
      </header>

      {/* ─── Deep Link Banner (condicional) ─── */}
      {deepLinkMovie && filmSlug && (
        <a
          href={`/filme/${filmSlug}`}
          className="hub-deep-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/filme/${filmSlug}`);
          }}
        >
          <span className="hub-deep-link-emoji">🎬</span>
          <div className="hub-deep-link-content">
            <div className="hub-deep-link-label">Você veio ver</div>
            <div className="hub-deep-link-title">
              {deepLinkMovie.title}
              {deepLinkMovie.year ? ` (${deepLinkMovie.year})` : ''}
            </div>
          </div>
          <span className="hub-deep-link-arrow">→</span>
        </a>
      )}

      {/* ─── Cards de Ação ─── */}
      <div className="hub-cards">
        {/* Card 1: Descobrir */}
        <a
          href="/app/intro"
          className="hub-card hub-card--discover"
          onClick={(e) => {
            e.preventDefault();
            navigate('/app/intro');
          }}
        >
          <span className="hub-card-emoji">❤️</span>
          <div className="hub-card-text">
            <div className="hub-card-title">Descobrir</div>
            <div className="hub-card-subtitle">Sua jornada emocional</div>
          </div>
          <span className="hub-card-arrow">→</span>
        </a>

        {/* Card 2: Buscar */}
        {!isSearchExpanded ? (
          <div
            className="hub-card hub-card--search"
            onClick={() => setIsSearchExpanded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsSearchExpanded(true)}
          >
            <span className="hub-card-emoji">🔎</span>
            <div className="hub-card-text">
              <div className="hub-card-title">Buscar</div>
              <div className="hub-card-subtitle">Filme específico + onde assistir</div>
            </div>
            <span className="hub-card-arrow">→</span>
          </div>
        ) : (
          <div className="hub-card hub-card--search hub-card--search-expanded">
            <div
              className="hub-search-row"
              onClick={() => setIsSearchExpanded(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Escape' && setIsSearchExpanded(false)}
            >
              <span className="hub-card-emoji">🔎</span>
              <div className="hub-card-text">
                <div className="hub-card-title">Buscar</div>
                <div className="hub-card-subtitle">Digite o nome do filme</div>
              </div>
              <span className="hub-card-arrow" style={{ transform: 'rotate(90deg)' }}>→</span>
            </div>
            <div className="hub-search-container">
              <MovieLiveSearch isMobile onClose={() => setIsSearchExpanded(false)} />
            </div>
          </div>
        )}

        {/* Card 3: Ler */}
        <a
          href="/"
          className="hub-card hub-card--read"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <span className="hub-card-emoji">📖</span>
          <div className="hub-card-text">
            <div className="hub-card-title">Ler</div>
            <div className="hub-card-subtitle">Blog e análises de filmes</div>
          </div>
          <span className="hub-card-arrow">→</span>
        </a>
      </div>

      {/* ─── Download Section ─── */}
      <div className="hub-download">
        <span className="hub-download-label">BAIXE O APP</span>
        <div className="hub-download-badges">
          {/* App Store */}
          <a
            href="https://apps.apple.com/br/app/vibesfilm/id6764453105"
            target="_blank"
            rel="noopener noreferrer"
            className="hub-download-badge"
            title="Baixar na App Store"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.97 12.01 4.72 9c.88-1.52 2.41-2.48 4.11-2.51 1.27-.02 2.46.87 3.24.87.78 0 2.22-1.05 3.75-.9.65.02 2.46.25 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.3 2.72zM12.91 5.99c.02-.01.05-.03.08-.06.53-.63.89-1.51.77-2.41-.02-.03-.04-.07-.07-.09-.9.04-1.78.61-2.26 1.21-.02.03-.04.05-.05.08-.53.64-.88 1.55-.74 2.44.02.03.05.07.08.08.06.01.12.02.18.02.73 0 1.52-.39 2.01-.89z"/>
            </svg>
            <div className="hub-download-badge-text">
              <span className="hub-download-badge-small">Baixar na</span>
              <span className="hub-download-badge-store">App Store</span>
            </div>
          </a>

          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=com.vibesfilm.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hub-download-badge"
            title="Baixar no Google Play"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.60938 1.95312C3.375 2.1875 3.23438 2.5625 3.23438 3.03125V20.9688C3.23438 21.4375 3.375 21.8125 3.60938 22.0469L3.65625 22.0938L13.7344 12.0156V11.9844L3.65625 1.90625L3.60938 1.95312Z" fill="#00E3FF"/>
              <path d="M17.0625 15.3438L13.7344 12.0156V11.9844L17.0625 8.65625L17.1094 8.6875L21.0469 10.9219C22.1719 11.5625 22.1719 12.4375 21.0469 13.0781L17.1094 15.3125L17.0625 15.3438Z" fill="#FFE000"/>
              <path d="M17.1094 15.3125L13.7344 11.9844L3.65625 22.0469C4.03125 22.4375 4.64062 22.4844 5.34375 22.0938L17.1094 15.3125Z" fill="#FF3A44"/>
              <path d="M17.1094 8.6875L5.34375 1.90625C4.64062 1.51562 4.03125 1.5625 3.65625 1.95312L13.7344 12.0156L17.1094 8.6875Z" fill="#32FF7E"/>
            </svg>
            <div className="hub-download-badge-text">
              <span className="hub-download-badge-small">Disponível no</span>
              <span className="hub-download-badge-store">Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HubLanding;
