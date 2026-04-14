import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Loader, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  year?: number;
  thumbnail?: string;
  slug?: string;
  genres?: string[];
}

interface MovieLiveSearchProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

export function MovieLiveSearch({ isMobile = false, onClose }: MovieLiveSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Painel expandido

  const inputRef = useRef<HTMLInputElement>(null);
  const expandedInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha painel expandido com Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isExpanded]);

  // Busca com debounce — salva todos os resultados sem limitar
  const fetchResults = useCallback(async (search: string) => {
    if (search.trim().length < 2) {
      setResults([]);
      setAllResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/public/search?q=${encodeURIComponent(search.trim())}`
      );
      if (!res.ok) throw new Error('Erro na busca');
      const data: SearchResult[] = await res.json();
      setAllResults(data);
      setResults(data.slice(0, 6));
      setIsOpen(true);
    } catch {
      setResults([]);
      setAllResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 350);
  };

  const handleSelect = (movie: SearchResult) => {
    const destination = movie.slug ? `/filme/${movie.slug}` : `/filme/${movie.id}`;
    navigate(destination);
    setQuery('');
    setResults([]);
    setAllResults([]);
    setIsOpen(false);
    setIsExpanded(false);
    document.body.style.overflow = '';
    onClose?.();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setAllResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const openExpandedPanel = () => {
    setIsExpanded(true);
    document.body.style.overflow = 'hidden';
    // Foca no input expandido após render
    setTimeout(() => expandedInputRef.current?.focus(), 50);
  };

  const closeExpandedPanel = () => {
    setIsExpanded(false);
    document.body.style.overflow = '';
  };

  const inputWidth = isMobile ? '100%' : (isFocused || query ? '280px' : '180px');

  return (
    <>
      {/* Barra de Busca Principal */}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}
      >
        <div
          className={!isFocused && !query ? 'idle-search-wrapper' : ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isFocused
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${isFocused ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.3)'}`,
            borderRadius: '10px',
            padding: '8px 12px',
            width: inputWidth,
            transition: 'all 0.3s ease',
            boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none',
          }}
        >
          {isLoading
            ? <Loader size={16} color="#9CA3AF" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
            : <Search size={16} color={isFocused ? '#60A5FA' : '#9CA3AF'} style={{ flexShrink: 0 }} />
          }
          <input
            ref={inputRef}
            type="text"
            className="premium-search-input"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
              if (results.length > 0) setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar filmes..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F1F5F9',
              fontSize: '14px',
              flex: 1,
              minWidth: 0,
            }}
          />
          {query && (
            <button
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                color: '#9CA3AF',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown de resultados */}
        {isOpen && results.length > 0 && (
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              top: isMobile ? '12px' : 'calc(100% + 8px)',
              left: isMobile ? 0 : 'auto',
              right: 0,
              width: isMobile ? '100%' : '360px',
              backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.03)' : 'rgba(10, 25, 47, 0.98)',
              border: isMobile ? 'none' : '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: isMobile ? '8px' : '12px',
              boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: isMobile ? 'none' : 'blur(16px)',
              zIndex: 200,
              overflow: 'hidden',
              marginBottom: isMobile ? '8px' : 0
            }}
          >
            {/* Cabeçalho do dropdown */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                fontSize: '11px',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            >
              Filmes encontrados ({allResults.length})
            </div>

            {/* Lista de resultados */}
            {results.map((movie, index) => (
              <button
                key={movie.id}
                onClick={() => handleSelect(movie)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom:
                    index < results.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {movie.thumbnail ? (
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    style={{
                      width: '40px',
                      height: '56px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '56px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Film size={18} color="#60A5FA" />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: '#F1F5F9',
                      fontSize: '14px',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {movie.title}
                  </div>
                  <div
                    style={{
                      color: '#64748B',
                      fontSize: '12px',
                      marginTop: '2px',
                    }}
                  >
                    {movie.year && <span>{movie.year}</span>}
                    {movie.year && movie.genres && movie.genres.length > 0 && (
                      <span style={{ margin: '0 4px' }}>·</span>
                    )}
                    {movie.genres && movie.genres.length > 0 && (
                      <span>{movie.genres.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                </div>

                <span style={{ color: '#334155', fontSize: '16px', flexShrink: 0 }}>›</span>
              </button>
            ))}

            {/* Rodapé: Ver mais resultados — abre o painel expandido */}
            {allResults.length > 6 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openExpandedPanel();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                  border: 'none',
                  background: 'rgba(59, 130, 246, 0.06)',
                  color: '#60A5FA',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.06)')}
              >
                Ver todos os {allResults.length} resultados para "{query}"
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* Estado vazio: nenhum resultado */}
        {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              top: isMobile ? '12px' : 'calc(100% + 8px)',
              right: 0,
              width: isMobile ? '100%' : '320px',
              backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.03)' : 'rgba(10, 25, 47, 0.98)',
              border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              color: '#64748B',
              fontSize: '14px',
              zIndex: 200,
            }}
          >
            <Film size={28} color="#334155" style={{ marginBottom: '8px' }} />
            <div>Nenhum filme encontrado para</div>
            <div style={{ color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
              "{query}"
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .premium-search-input::placeholder {
            color: rgba(96, 165, 250, 0.8);
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: color 0.3s ease;
          }

          .premium-search-input:focus::placeholder {
            color: rgba(156, 163, 175, 0.4);
          }

          .idle-search-wrapper {
            animation: subtlePulse 3s infinite alternate ease-in-out;
          }

          @keyframes subtlePulse {
            0% { box-shadow: 0 0 4px rgba(59, 130, 246, 0.1); }
            100% { box-shadow: 0 0 16px rgba(59, 130, 246, 0.35); }
          }

          @keyframes panelSlideIn {
            from { opacity: 0; transform: translateY(-16px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .search-expanded-panel {
            animation: panelSlideIn 0.2s ease-out;
          }
        `}</style>
      </div>

      {/* Painel Expandido (Command Palette) */}
      {isExpanded && (
        <div
          onClick={closeExpandedPanel}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <div
            className="search-expanded-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: 'rgba(8, 20, 40, 0.99)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header do painel */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {isLoading
                ? <Loader size={18} color="#60A5FA" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                : <Search size={18} color="#60A5FA" style={{ flexShrink: 0 }} />
              }
              <input
                ref={expandedInputRef}
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Buscar filmes no VibesFilm..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F1F5F9',
                  fontSize: '18px',
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
              {query && (
                <button
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={closeExpandedPanel}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#94A3B8',
                  fontSize: '12px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                ESC
              </button>
            </div>

            {/* Contagem */}
            {allResults.length > 0 && (
              <div style={{
                padding: '8px 20px',
                fontSize: '12px',
                color: '#475569',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {allResults.length} filme{allResults.length !== 1 ? 's' : ''} encontrado{allResults.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Lista completa de resultados */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {allResults.length > 0 ? (
                allResults.map((movie, index) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 20px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderBottom: index < allResults.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {movie.thumbnail ? (
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        style={{
                          width: '44px',
                          height: '62px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        width: '44px', height: '62px', borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Film size={20} color="#60A5FA" />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                        {movie.title}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '13px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {movie.year && <span>{movie.year}</span>}
                        {movie.genres?.slice(0, 3).map(g => (
                          <span key={g} style={{
                            padding: '1px 8px',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '10px',
                            fontSize: '11px',
                            color: '#93C5FD',
                          }}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ArrowRight size={16} color="#334155" style={{ flexShrink: 0 }} />
                  </button>
                ))
              ) : query.length >= 2 && !isLoading ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#475569' }}>
                  <Film size={40} color="#1E3A5F" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#64748B' }}>
                    Nenhum filme encontrado
                  </div>
                  <div style={{ fontSize: '14px', marginTop: '6px' }}>
                    Tente outro título ou parte do nome
                  </div>
                </div>
              ) : query.length < 2 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#475569' }}>
                  <Search size={36} color="#1E3A5F" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px' }}>Digite pelo menos 2 caracteres para buscar</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
