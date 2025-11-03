import { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { BlogArticleCard } from './BlogArticleCard';
import { blogApi, type BlogPost } from '../../services/blogApi';
import { mockPosts } from '../../data/blog/mockPosts';
import { NewsletterForm } from '../newsletter/NewsletterForm';

export function BlogFeaturedSection() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogApi.getFeaturedPosts();
        
        if (response.success && response.data) {
          console.log('⭐ Artigos em destaque da API:', response.data);
          setFeaturedPosts(response.data);
        } else {
          console.error('Erro na API, usando dados mock:', response.error);
          // Fallback para dados mock
          const featured = mockPosts.filter(post => post.isFeatured);
          setFeaturedPosts(featured as any);
        }
      } catch (err) {
        console.error('Erro ao buscar artigos em destaque:', err);
        setError('Erro ao carregar artigos em destaque');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const mainFeatured = featuredPosts[0];
  const sideFeatured = featuredPosts.slice(1, 2); // Mostrar apenas 2 artigos em destaque

  if (loading) {
    return (
      <section style={{ 
        padding: '64px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '32px' 
        }}>
          <Star size={24} style={{ color: '#FF6B35', fill: 'currentColor' }} />
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC',
            margin: 0
          }}>Artigos em Destaque</h2>
          <TrendingUp size={20} style={{ color: '#3B82F6' }} />
        </div>
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid #3B82F6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#E0E0E0', marginTop: '16px' }}>Carregando artigos em destaque...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ 
        padding: '64px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '32px' 
        }}>
          <Star size={24} style={{ color: '#FF6B35', fill: 'currentColor' }} />
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC',
            margin: 0
          }}>Artigos em Destaque</h2>
          <TrendingUp size={20} style={{ color: '#3B82F6' }} />
        </div>
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ fontSize: '4rem', color: '#E0E0E0', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#FDFFFC', 
            marginBottom: '8px',
            margin: 0
          }}>
            Erro ao carregar artigos em destaque
          </h3>
          <p style={{ color: '#E0E0E0', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3B82F6',
              color: '#011627',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            Tentar Novamente
          </button>
        </div>
      </section>
    );
  }

  // Se não há artigos em destaque, não renderiza a seção
  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section style={{ 
      padding: isMobile ? '32px 16px' : '64px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '32px' 
      }}>
        <Star size={24} style={{ color: '#FF6B35', fill: 'currentColor' }} />
        <h2 style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem', 
          fontWeight: 'bold', 
          color: '#FDFFFC',
          margin: 0
        }}>Artigos em Destaque</h2>
        <TrendingUp size={20} style={{ color: '#3B82F6' }} />
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: isMobile ? '24px' : '32px',
        alignItems: 'start'
      }}>
        {/* Main Featured Article */}
        <div>
          {mainFeatured && <BlogArticleCard post={mainFeatured} featured={true} />}
        </div>

        {/* Side Featured Articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sideFeatured.map((post) => (
            <div key={post.id}>
              <BlogArticleCard post={post} />
            </div>
          ))}
          
          {/* Newsletter Signup Card */}
          <NewsletterForm source="blog_home" />
        </div>
      </div>
    </section>
  );
}
