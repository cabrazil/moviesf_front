import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Loader } from 'lucide-react';
import { getBlogImageUrl } from '../../utils/blogImages';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
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

  // Busca com debounce — salva todos os resultados
  const fetchResults = useCallback(async (search: string) => {
    if (search.trim().length < 2) {
      setResults([]);
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
      setResults(data);
      setIsOpen(true);
    } catch {
      setResults([]);
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
    setIsOpen(false);
    onClose?.();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const inputWidth = isMobile ? '100%' : (isFocused || query ? '280px' : '180px');

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}
    >
      {/* Barra de Busca Principal */}
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
        {isLoading ? (
          <Loader
            size={16}
            color="#60A5FA"
            style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}
          />
        ) : (
          <Search size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar filme..."
          className="premium-search-input"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F1F5F9',
            fontSize: '14px',
            fontFamily: "'Outfit', sans-serif",
            width: '100%',
          }}
        />

        {query && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
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
            marginBottom: isMobile ? '8px' : 0,
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
            Filmes encontrados ({results.length})
          </div>

          {/* Lista de resultados com scroll nativo */}
          <div
            style={{
              maxHeight: isMobile ? '320px' : '400px',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
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
                    src={getBlogImageUrl(movie.thumbnail)}
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
          </div>
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
          color: rgba(148, 163, 184, 0.5);
          font-size: 13px;
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
      `}</style>
    </div>
  );
}
