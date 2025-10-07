import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, Eye, Heart } from 'lucide-react';
import { blogApi, type BlogCategory } from '../../services/blogApi';
import { categories } from '../../data/blog/mockPosts';

export function CategoriesPage() {
  const [categoriesData, setCategoriesData] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll para o topo quando a página carrega
    window.scrollTo(0, 0);
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏷️ Buscando categorias...');
        
        const response = await blogApi.getCategories();
        
        if (response.success && response.data) {
          console.log('✅ Categorias recebidas da API:', response.data.length);
          // Mapear article_count para articleCount
          const mappedData = response.data.map((category: any) => ({
            ...category,
            articleCount: category.article_count || 0
          }));
          setCategoriesData(mappedData);
        } else {
          console.error('Erro ao buscar categorias, usando dados mock:', response.error);
          // Fallback para dados mock
          setCategoriesData(categories as any);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError('Erro ao carregar categorias');
        // Fallback para dados mock
        setCategoriesData(categories as any);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite'
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
          <p style={{ color: '#E0E0E0' }}>Carregando categorias...</p>
        </div>
      </div>
    );
  }

  if (error && categoriesData.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: '16px' 
          }}>
            Erro ao carregar categorias
          </h1>
          <p style={{ color: '#E0E0E0', marginBottom: '32px' }}>
            {error}
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
        padding: '32px 40px 0' 
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

      {/* Categories Header */}
      <header style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: '0 40px 48px',
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
            <Tag size={16} color="#2EC4B6" />
            <span style={{
              fontSize: '1.0rem',
              fontWeight: '600',
              color: '#2EC4B6'
            }}>
              Categorias
            </span>
          </div>

          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: '16px' 
          }}>
            Todas as Categorias
          </h1>
          
          <p style={{ 
            color: '#E0E0E0', 
            fontSize: '1.125rem',
            marginBottom: '32px' 
          }}>
            Explore nossos artigos organizados por temas
          </p>
        </div>
      </header>

      {/* Categories Grid */}
      <main style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: '0 40px 48px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {categoriesData.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {categoriesData.map((category) => (
              <div key={category.id} style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.backgroundColor = 'rgba(2, 44, 73, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* Category Header */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(46, 196, 182, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(46, 196, 182, 0.2)'
                    }}>
                      <Tag size={20} color="#2EC4B6" />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#FDFFFC',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {category.title}
                      </h3>
                      <p style={{
                        color: '#E0E0E0',
                        fontSize: '0.875rem',
                        margin: 0
                      }}>
                        {category.articleCount || 0} artigos
                      </p>
                    </div>
                  </div>
                  
                  {category.description && (
                    <p style={{
                      color: '#E0E0E0',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Category Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: 'rgba(46, 196, 182, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(46, 196, 182, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} color="#2EC4B6" />
                    <span style={{ color: '#E0E0E0', fontSize: '0.75rem' }}>
                      {category.articleCount || 0} artigos
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={14} color="#2EC4B6" />
                    <span style={{ color: '#E0E0E0', fontSize: '0.75rem' }}>
                      Categoria
                    </span>
                  </div>
                </div>

                {/* Call to Action */}
                <Link 
                  to={`/blog/categoria/${category.slug}`}
                  style={{
                    display: 'block',
                    backgroundColor: '#2EC4B6',
                    color: '#011627',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
                >
                  Ver todos os artigos
                </Link>
              </div>
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
              Nenhuma categoria encontrada.
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
              Voltar ao Blog
            </Link>
          </div>
        )}
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
