import { useState, useEffect } from 'react';
import { Clock, Filter, Grid, List } from 'lucide-react';
import { BlogArticleCard } from './BlogArticleCard';
import { blogApi, type BlogPost, type BlogCategory } from '../../services/blogApi';
import { mockPosts, categories } from '../../data/blog/mockPosts';

export function BlogLatestPosts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoriesData, setCategoriesData] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar artigos e categorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar artigos e categorias em paralelo
        const [postsResponse, categoriesResponse] = await Promise.all([
          blogApi.getPosts({ limit: 20 }),
          blogApi.getCategories()
        ]);
        
        if (postsResponse.success && postsResponse.data) {
          console.log('📰 Artigos recebidos da API:', postsResponse.data.articles.length);
          setPosts(postsResponse.data.articles);
        } else {
          console.error('Erro ao buscar artigos, usando dados mock:', postsResponse.error);
          // Fallback para dados mock
          setPosts(mockPosts as any);
        }
        
        if (categoriesResponse.success && categoriesResponse.data) {
          console.log('🏷️ Categorias recebidas da API:', categoriesResponse.data.length);
          setCategoriesData(categoriesResponse.data);
        } else {
          console.error('Erro ao buscar categorias, usando dados mock:', categoriesResponse.error);
          // Fallback para dados mock
          setCategoriesData(categories as any);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts // Mostrar todos os posts
    : posts.filter(post => post.category_slug === selectedCategory);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  if (loading) {
    return (
      <section id="latest-posts" style={{ 
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
          <Clock size={24} style={{ color: '#2EC4B6' }} />
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC',
            margin: 0
          }}>Últimos Artigos</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid #2EC4B6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#E0E0E0', marginTop: '16px' }}>Carregando artigos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="latest-posts" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-text">Últimos Artigos</h2>
        </div>
        <div className="text-center py-16">
          <div className="text-text-secondary text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Erro ao carregar artigos
          </h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="blog-btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="latest-posts" style={{ 
      padding: '64px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Section Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px'
        }}>
          <Clock size={24} style={{ color: '#2EC4B6' }} />
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC',
            margin: 0
          }}>Últimos Artigos</h2>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* View Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#022c49', 
            borderRadius: '8px', 
            padding: '4px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#2EC4B6' : 'transparent',
                color: viewMode === 'grid' ? '#011627' : '#E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#2EC4B6' : 'transparent',
                color: viewMode === 'list' ? '#011627' : '#E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <List size={16} />
            </button>
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                backgroundColor: '#022c49',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 32px 8px 16px',
                color: '#FDFFFC',
                fontSize: '0.875rem',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Todas as Categorias</option>
              {categoriesData.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title || category.name}
                </option>
              ))}
            </select>
            <Filter size={16} style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#E0E0E0', 
              pointerEvents: 'none' 
            }} />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px', 
        marginBottom: '32px' 
      }}>
        <button
          onClick={() => handleCategoryChange('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backgroundColor: selectedCategory === 'all' ? '#2EC4B6' : '#022c49',
            color: selectedCategory === 'all' ? '#011627' : '#E0E0E0',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            if (selectedCategory !== 'all') {
              e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
              e.currentTarget.style.color = '#2EC4B6';
            }
          }}
          onMouseOut={(e) => {
            if (selectedCategory !== 'all') {
              e.currentTarget.style.backgroundColor = '#022c49';
              e.currentTarget.style.color = '#E0E0E0';
            }
          }}
        >
          Todos
        </button>
        {categoriesData.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryChange(category.slug)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backgroundColor: selectedCategory === category.slug ? '#2EC4B6' : '#022c49',
              color: selectedCategory === category.slug ? '#011627' : '#E0E0E0',
              border: selectedCategory === category.slug ? '1px solid #2EC4B6' : '1px solid transparent',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
                e.currentTarget.style.color = '#2EC4B6';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = '#022c49';
                e.currentTarget.style.color = '#E0E0E0';
              }
            }}
          >
            {category.title || category.name}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredPosts.length > 0 ? (
        <div style={{
          display: 'grid',
          gap: '32px',
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fit, minmax(300px, 1fr))' 
            : '1fr',
          maxWidth: viewMode === 'list' ? '800px' : 'none',
          margin: viewMode === 'list' ? '0 auto' : '0'
        }}>
          {filteredPosts.map((post) => (
            <div key={post.id} style={{
              animation: 'fadeIn 0.6s ease-out'
            }}>
              <BlogArticleCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', color: '#E0E0E0', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#FDFFFC', 
              marginBottom: '8px',
              margin: 0
            }}>
              Nenhum artigo encontrado
            </h3>
            <p style={{ color: '#E0E0E0', marginBottom: '16px', margin: 0 }}>
              {selectedCategory === 'all' 
                ? 'Ainda não há artigos publicados. Volte em breve!'
                : 'Não encontramos artigos nesta categoria. Que tal explorar outras seções?'
              }
            </p>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => handleCategoryChange('all')}
                style={{
                  backgroundColor: '#2EC4B6',
                  color: '#011627',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
              >
                Ver Todos os Artigos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button style={{
            backgroundColor: 'transparent',
            color: '#2EC4B6',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '2px solid #2EC4B6',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2EC4B6';
            e.currentTarget.style.color = '#011627';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#2EC4B6';
          }}
          >
            Carregar Mais Artigos
          </button>
        </div>
      )}
    </section>
  );
}
