import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../services/blogApi';
import { getFeaturedImageUrl } from '../../utils/blogImages';

interface BlogArticleCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogArticleCard({ post, featured = false }: BlogArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    // Remove HTML tags e espaços extras
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    // Palavras por minuto (velocidade média de leitura em português)
    const wordsPerMinute = 200;
    
    // Conta palavras
    const wordCount = textContent.split(' ').length;
    
    // Calcula tempo de leitura
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Mínimo de 1 minuto, máximo de 30 minutos
    return Math.max(1, Math.min(30, readingTime));
  };

  if (featured) {
    return (
      <Link to={`/blog/artigo/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{
          backgroundColor: '#022c49',
          border: '1px solid rgba(173, 181, 189, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '100%',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(46, 196, 182, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(173, 181, 189, 0.2)';
        }}
        >
          <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
            <img 
              src={getFeaturedImageUrl(post.imageUrl || '')}
              alt={post.imageAlt || post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.7s ease'
              }}
              onError={(e) => {
                // Fallback para imagem quebrada
                const target = e.currentTarget;
                target.src = 'data:image/svg+xml,%3Csvg width='800' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23011627'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%233B82F6'%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                target.style.opacity = '0.7';
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          
          <div style={{ padding: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '16px' 
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: '500',
                borderRadius: '6px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                {post.category_title}
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#E0E0E0', 
                fontSize: '0.875rem' 
              }}>
                <Clock size={16} style={{ marginRight: '4px', color: '#FF6B35' }} />
                {post.readingTime || calculateReadingTime(post.content)} min
              </div>
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#FDFFFC',
              marginBottom: '6px',
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>{post.title}</h2>
            
            <p style={{
              color: '#E0E0E0',
              marginBottom: '16px',
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.625'
            }}>{post.description}</p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginTop: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={post.author_image || '/default-avatar.svg'} 
                  alt={post.author_name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <p style={{ 
                    color: '#FDFFFC', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    margin: 0
                  }}>{post.author_name}</p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#E0E0E0', 
                    fontSize: '0.75rem' 
                  }}>
                    <Calendar size={12} style={{ marginRight: '4px' }} />
                    {formatDate(post.date)}
                  </div>
                </div>
              </div>
              
              <ArrowRight size={20} style={{ color: '#3B82F6' }} />
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{
                color: '#3B82F6',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#FF6B35'}
              onMouseOut={(e) => e.currentTarget.style.color = '#3B82F6'}
              >
                Ver Mais...
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/artigo/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article style={{
        backgroundColor: '#022c49',
        border: '1px solid rgba(173, 181, 189, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(46, 196, 182, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(173, 181, 189, 0.2)';
      }}
      >
        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img 
            src={getFeaturedImageUrl(post.imageUrl || '')}
            onError={(e) => {
              // Fallback para imagem quebrada
              const target = e.currentTarget;
              target.src = 'data:image/svg+xml,%3Csvg width='800' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23011627'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%233B82F6'%3EImagem não disponível%3C/text%3E%3C/svg%3E';
              target.style.opacity = '0.7';
            }} 
            alt={post.imageAlt || post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.7s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        
        <div style={{ padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '12px' 
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: '500',
              borderRadius: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              {post.category_title}
            </span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#E0E0E0', 
              fontSize: '0.75rem' 
            }}>
              <Clock size={12} style={{ marginRight: '4px', color: '#FF6B35' }} />
              {post.readingTime || calculateReadingTime(post.content)} min
            </div>
          </div>

          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#FDFFFC',
            marginBottom: '6px',
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{post.title}</h2>
          
          <p style={{
            color: '#E0E0E0',
            marginBottom: '16px',
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.625',
            fontSize: '0.875rem'
          }}>{post.description}</p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            marginTop: 0
          }}>
            <img 
              src={post.author_image || '/default-avatar.svg'} 
              alt={post.author_name}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <p style={{ 
              color: '#FDFFFC', 
              fontSize: '0.75rem', 
              fontWeight: '500',
              margin: 0
            }}>{post.author_name}</p>
            <span style={{ color: '#E0E0E0', fontSize: '0.75rem' }}>•</span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#E0E0E0', 
              fontSize: '0.75rem' 
            }}>
              <Calendar size={12} style={{ marginRight: '4px' }} />
              {formatDate(post.date)}
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <span style={{
              color: '#3B82F6',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FF6B35'}
            onMouseOut={(e) => e.currentTarget.style.color = '#3B82F6'}
            >
              Ver Mais...
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
