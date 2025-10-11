import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Tag as TagIcon, Calendar, Clock } from 'lucide-react';
import { blogApi, type BlogPost } from '../../services/blogApi';

export function TagPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (!tagSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Buscando artigos para tag:', tagSlug);
        
        const response = await blogApi.getPostsByTag(tagSlug, 1, 20);
        
        if (response.success && response.data) {
          setPosts(response.data.articles);
          console.log('✅ Artigos encontrados:', response.data.articles.length);
          
          // Extrair nome da tag do slug
          const formattedTagName = tagSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          setTagName(formattedTagName);
          console.log('🏷️ Nome da tag:', formattedTagName);
        } else {
          setError('Tag não encontrada');
        }
      } catch (err) {
        console.error('Erro ao buscar artigos por tag:', err);
        setError('Erro ao carregar artigos');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tagSlug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const wordsPerMinute = 200;
    const wordCount = textContent.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, Math.min(30, readingTime));
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#011627'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid #2EC4B6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#E0E0E0' }}>Carregando artigos...</p>
        </div>
      </div>
    );
  }

  if (error || !tagSlug) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#011627'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.75rem' : '2.5rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            Tag não encontrada
          </h1>
          <p style={{ color: '#E0E0E0', marginBottom: '32px' }}>
            {error || 'A tag que você está procurando não existe.'}
          </p>
          <Link 
            to="/" 
            style={{
              backgroundColor: '#2EC4B6',
              color: '#011627',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
          >
            Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 8s ease infinite'
    }}>
      {/* Back Button */}
      <div style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: isMobile ? '16px 16px 0' : '32px 40px 0' 
      }}>
        <Link 
          to="/blog" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#E0E0E0',
            textDecoration: 'none',
            marginBottom: '32px',
            transition: 'color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
          onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Blog</span>
        </Link>
      </div>

      {/* Tag Header */}
      <header style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px 32px' : '0 40px 48px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'rgba(46, 196, 182, 0.1)',
            border: '1px solid rgba(46, 196, 182, 0.2)',
            borderRadius: '9999px',
            marginBottom: '24px'
          }}>
            <TagIcon size={16} color="#2EC4B6" />
            <span style={{
              fontSize: isMobile ? '0.9rem' : '1.0rem',
              fontWeight: '600',
              color: '#2EC4B6'
            }}>
              #{tagName}
            </span>
          </div>

          <h1 style={{ 
            fontSize: isMobile ? '1.5rem' : '30px', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            Artigos sobre {tagName}
          </h1>
          
          <p style={{ 
            color: '#E0E0E0', 
            fontSize: isMobile ? '1rem' : '1.125rem',
            marginBottom: isMobile ? '24px' : '32px' 
          }}>
            {posts.length} {posts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </p>
        </div>
      </header>

      {/* Articles List */}
      <main style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px 32px' : '0 40px 48px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {posts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/artigo/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <article style={{
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(2, 44, 73, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: isMobile ? '12px' : '16px',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    {/* Image - Compacta */}
                    <div style={{ 
                      width: isMobile ? '100%' : '160px', 
                      flexShrink: 0, 
                      height: isMobile ? '200px' : '100%' 
                    }}>
                      <div style={{ 
                        height: '100%',
                        overflow: 'hidden', 
                        borderRadius: '8px' 
                      }}>
                        <img 
                          src={post.imageUrl} 
                          alt={post.imageAlt || post.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                    </div>
                    
                    {/* Content - Expandido */}
                    <div style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      width: isMobile ? '100%' : 'auto'
                    }}>
                      <div>
                        {/* Category and Reading Time */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          marginBottom: '8px' 
                        }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(46, 196, 182, 0.1)',
                            color: '#2EC4B6',
                            border: '1px solid rgba(46, 196, 182, 0.2)'
                          }}>
                            {post.category_title}
                          </span>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            color: '#E0E0E0', 
                            fontSize: '0.75rem' 
                          }}>
                            <Clock size={12} style={{ marginRight: '4px' }} />
                            {post.readingTime || calculateReadingTime(post.content)} min
                          </div>
                        </div>

                        {/* Title */}
                        <h2 style={{
                          fontSize: isMobile ? '16px' : '14px',
                          fontWeight: '600',
                          color: '#FDFFFC',
                          marginBottom: isMobile ? '12px' : '8px',
                          lineHeight: '1.3',
                          transition: 'color 0.3s ease'
                        }}>
                          {post.title}
                        </h2>
                        
                        {/* Excerpt */}
                        <p style={{
                          color: '#E0E0E0',
                          marginBottom: isMobile ? '16px' : '12px',
                          lineHeight: '1.5',
                          fontSize: isMobile ? '0.9rem' : '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: isMobile ? 3 : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.description || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                        </p>
                      </div>

                      {/* Author and Date - Inline */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: isMobile ? 'flex-start' : 'space-between',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '8px' : '0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={post.author_image || '/default-avatar.svg'} 
                            alt={post.author_name}
                            style={{
                              width: isMobile ? '20px' : '24px',
                              height: isMobile ? '20px' : '24px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                          <div>
                            <p style={{ 
                              color: '#FDFFFC', 
                              fontSize: isMobile ? '0.8rem' : '0.75rem', 
                              fontWeight: '500',
                              margin: 0
                            }}>
                              {post.author_name}
                            </p>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              color: '#E0E0E0', 
                              fontSize: isMobile ? '0.8rem' : '0.75rem'
                            }}>
                              <Calendar size={10} style={{ marginRight: '4px' }} />
                              {formatDate(post.date)}
                            </div>
                          </div>
                        </div>
                        
                        <span style={{
                          color: '#2EC4B6',
                          fontSize: isMobile ? '0.9rem' : '0.875rem',
                          fontWeight: '500',
                          transition: 'color 0.3s ease'
                        }}>
                          Ler artigo →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 0' 
          }}>
            <p style={{ 
              color: '#E0E0E0', 
              fontSize: '1.125rem',
              marginBottom: '16px'
            }}>
              Nenhum artigo encontrado com esta tag.
            </p>
            <Link 
              to="/" 
              style={{
                color: '#2EC4B6',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#0A6E65'}
              onMouseOut={(e) => e.currentTarget.style.color = '#2EC4B6'}
            >
              Ver todos os artigos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
