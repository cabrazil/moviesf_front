import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { blogApi, type BlogPost } from '../../services/blogApi';
import { BlogArticleCard } from '../../components/blog/BlogArticleCard';
import { SeoHead } from '../../components/blog/SeoHead';
import { processContentImages, getFeaturedImageUrl } from '../../utils/blogImages';

// Adicionar estilos CSS para a animação
const styles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Injetar estilos no head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
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

  // Função para compartilhar artigo
  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Artigo do Vibesfilm',
      text: post?.description || 'Confira este artigo interessante sobre cinema e emoções',
      url: window.location.href
    };

    try {
      // Tentar usar Web Share API se disponível
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar link para área de transferência
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      // Fallback final: copiar link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      } catch (clipboardError) {
        console.error('Erro ao copiar link:', clipboardError);
        alert('Não foi possível compartilhar. Tente copiar o link manualmente.');
      }
    }
  };

  useEffect(() => {
    // Scroll para o topo quando a página carrega
    window.scrollTo(0, 0);
    
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Função para gerar slug original baseado no slug otimizado
        const generateOriginalSlug = (optimizedSlug: string): string => {
          // Padrões comuns de transformação
          const patterns = [
            // Padrão: filme-ano -> analise-de-filme-ano-a-vibe-a-trama-e-...
            {
              regex: /^(.+)-(\d{4})$/,
              replacement: 'analise-de-$1-$2-a-vibe-a-trama-e-o-impacto-do-filme'
            },
            // Padrão: filme -> analise-de-filme-a-vibe-a-trama-e-...
            {
              regex: /^(.+)$/,
              replacement: 'analise-de-$1-a-vibe-a-trama-e-o-impacto-do-filme'
            }
          ];

          for (const pattern of patterns) {
            if (pattern.regex.test(optimizedSlug)) {
              return optimizedSlug.replace(pattern.regex, pattern.replacement);
            }
          }

          return optimizedSlug;
        };

        // Mapeamento específico para casos especiais
        const specialMappings: { [key: string]: string } = {
          'oppenheimer-2023': 'oppenheimer-2023-uma-analise-da-trama-da-vibe-e-do-impacto-do-filme',
          'nada-de-novo-no-front-2022': 'analise-de-nada-de-novo-no-front-2022-a-vibe-a-trama-e-o-horror-da-guerra',
          'estrelas-alem-do-tempo-2016': 'estrelas-alem-do-tempo-2016-superacao-empoderamento-e-a-forca-da-inteligencia-coletiva',
          'ford-vs-ferrari-2019': 'o-ronco-da-paixao-inesgotavel-por-que-ford-vs-ferrari-2019-e-o-filme-ideal-para-te-recarregar'
        };
        
        // Tentar buscar primeiro pelo slug otimizado, depois pelo original
        let articleResponse = await blogApi.getPostBySlug(slug);
        
        // Se não encontrou, tentar com mapeamentos
        if (!articleResponse.success) {
          let originalSlug = '';
          
          // Primeiro, verificar mapeamentos específicos
          if (specialMappings[slug]) {
            originalSlug = specialMappings[slug];
            console.log(`🔄 Mapeamento específico encontrado: ${originalSlug}`);
          } else {
            // Gerar slug original automaticamente
            originalSlug = generateOriginalSlug(slug);
            console.log(`🔄 Slug original gerado: ${originalSlug}`);
          }
          
          if (originalSlug && originalSlug !== slug) {
            articleResponse = await blogApi.getPostBySlug(originalSlug);
          }
        }
        
        if (articleResponse.success && articleResponse.data) {
          const article = articleResponse.data;
          
          // Validar se o tipo do artigo corresponde à rota acessada
          const currentPath = location.pathname;
          const expectedType = currentPath.startsWith('/lista/') ? 'lista' : 'analise';
          
          if (article.type && article.type !== expectedType) {
            // Redirecionar para a rota correta baseada no tipo do artigo
            console.log(`🔄 Redirecionando: ${currentPath} → /${article.type}/${slug} (tipo: ${article.type})`);
            navigate(`/${article.type}/${slug}`, { replace: true });
            return;
          }
          
          setPost(article);
          
          // Buscar artigos relacionados da mesma categoria
          const relatedResponse = await blogApi.getPosts({ limit: 10 });
          if (relatedResponse.success && relatedResponse.data) {
            const related = relatedResponse.data.articles
              .filter(p => p.id !== articleResponse.data?.id && p.category_slug === articleResponse.data?.category_slug)
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } else {
          setError('Artigo não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar artigo:', err);
        setError('Erro ao carregar artigo');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
          <p style={{ color: '#E0E0E0' }}>Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
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
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: '16px' 
          }}>
            Artigo não encontrado
          </h1>
          <p style={{ color: '#E0E0E0', marginBottom: '32px' }}>
            {error || 'O artigo que você está procurando não existe.'}
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
    <>
      <SeoHead
        title={post.title}
        description={post.description || post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        imageUrl={post.imageUrl}
        imageAlt={post.imageAlt}
        articleUrl={window.location.href}
        publishedAt={post.date}
        authorName={post.author_name}
        categoryName={post.category_title}
        tags={post.tags?.map(tag => tag.name) || []}
      />
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

      {/* Article Header */}
      <header style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px 24px' : '0 40px 24px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Category Badge */}
          <span style={{
            display: 'inline-block',
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: '500',
            borderRadius: '9999px',
            backgroundColor: 'rgba(46, 196, 182, 0.1)',
            color: '#2EC4B6',
            border: '1px solid rgba(46, 196, 182, 0.2)',
            marginBottom: '16px'
          }}>
            {post.category_title}
          </span>


          {/* Article Meta */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '24px', 
            color: '#E0E0E0', 
            fontSize: '0.875rem', 
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={16} />
              <span>{post.author_name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={16} />
              <span>{formatDate(post.date)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} />
              <span>5 min de leitura</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '16px', 
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {/* TODO: Implementar funcionalidades de Curtir e Salvar futuramente */}
            {/*
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#022c49',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#E0E0E0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
              e.currentTarget.style.borderColor = '#2EC4B6';
              e.currentTarget.style.color = '#2EC4B6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#022c49';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#E0E0E0';
            }}
            >
              <Heart size={16} />
              <span>Curtir</span>
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#022c49',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#E0E0E0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
              e.currentTarget.style.borderColor = '#2EC4B6';
              e.currentTarget.style.color = '#2EC4B6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#022c49';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#E0E0E0';
            }}
            >
              <Bookmark size={16} />
              <span>Salvar</span>
            </button>
            */}
            <button 
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#022c49',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
                e.currentTarget.style.borderColor = '#2EC4B6';
                e.currentTarget.style.color = '#2EC4B6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#022c49';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#E0E0E0';
              }}
            >
              <Share2 size={16} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div style={{ 
          borderRadius: '12px', 
          overflow: 'hidden',
          margin: '0 auto',
          display: 'block'
        }}>
          <img 
            src={getFeaturedImageUrl(post.imageUrl || '')} 
            alt={post.imageAlt || post.title}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              minWidth: '300px',
              minHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              margin: '16px auto',
              display: 'block'
            }}
          />
        </div>
      </header>

      {/* Article Content */}
      <main style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px 0' : '0 40px 0',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <article style={{
          fontSize: isMobile ? '1rem' : '1.125rem',
          lineHeight: '1.7',
          color: '#FDFFFC',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }} className="article-content">
          <div 
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
            dangerouslySetInnerHTML={{ 
              __html: processContentImages(post.content)
                .replace(
                  /<img([^>]*)>/gi, 
                  '<img$1 style="max-width: 100%; width: 100%; min-width: 300px; min-height: 200px; height: auto; border-radius: 8px; margin: 16px auto; display: block; object-fit: cover;">'
                )
                .replace(
                  /<h1([^>]*)>/gi, 
                  '<h1$1 style="font-size: 30px; font-weight: 600; color: #FDFFFC; margin: 24px 0 16px 0; line-height: 1.3;">'
                )
                .replace(
                  /<h2([^>]*)>/gi, 
                  '<h2$1 style="font-size: 24px; font-weight: 600; color: #FDFFFC; margin: 20px 0 12px 0; line-height: 1.4;">'
                )
                .replace(
                  /<a([^>]*)>/gi, 
                  '<a$1 style="color: #2EC4B6; text-decoration: underline; transition: color 0.3s ease;">'
                )
            }}
          />
        </article>

        {/* Tags do Artigo */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ 
            marginTop: isMobile ? '32px' : '48px', 
            paddingTop: isMobile ? '24px' : '32px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
          }}>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.125rem', 
              fontWeight: '600', 
              color: '#FDFFFC', 
              marginBottom: isMobile ? '12px' : '16px' 
            }}>
              Tags do Artigo
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: isMobile ? '8px' : '12px' 
            }}>
              {post.tags.map((tag) => (
                <Link 
                  key={tag.id} 
                  to={`/blog/tag/${tag.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: isMobile ? '4px 8px' : '6px 12px',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: '500',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    color: '#2EC4B6',
                    border: '1px solid rgba(46, 196, 182, 0.2)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2EC4B6';
                    e.currentTarget.style.color = '#011627';
                    e.currentTarget.style.borderColor = '#2EC4B6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
                    e.currentTarget.style.color = '#2EC4B6';
                    e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                  }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div style={{ 
          marginTop: '48px', 
          padding: '24px', 
          backgroundColor: '#022c49', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <img 
              src={post.author_image || '/default-avatar.svg'} 
              alt={post.author_name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#FDFFFC', 
                marginBottom: '8px' 
              }}>
                Sobre {post.author_name}
              </h3>
              <p style={{ 
                color: '#E0E0E0', 
                lineHeight: '1.6' 
              }}>
                {post.author_bio || 'Autor do VibesFilm Blog, apaixonado por cinema e emoções.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section style={{ 
          maxWidth: '1200px', 
          margin: '80px auto 48px', 
          padding: '0 40px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '1.5rem' : '2rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: isMobile ? '24px' : '32px', 
            textAlign: 'center' 
          }}>
            Artigos Relacionados
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '24px' : '32px'
          }}>
            {relatedPosts.map((relatedPost) => (
              <BlogArticleCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      {/* CTA to App */}
        <section style={{ 
          maxWidth: '1024px', 
          margin: isMobile ? '40px auto 24px' : '80px auto 48px', 
          padding: isMobile ? '0 16px' : '0 40px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1) 0%, rgba(255, 159, 28, 0.1) 100%)',
          border: '1px solid rgba(46, 196, 182, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '24px' : '32px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            color: '#FDFFFC', 
            marginBottom: isMobile ? '12px' : '16px' 
          }}>
            Pronto para encontrar seu filme ideal?
          </h3>
          <p style={{ 
            color: '#E0E0E0', 
            marginBottom: isMobile ? '20px' : '24px',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            Use nosso aplicativo para descobrir filmes baseados nas suas emoções e sentimentos atuais.
          </p>
          <a 
            href="/app" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#2EC4B6',
              color: '#011627',
              padding: isMobile ? '10px 20px' : '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
          >
            <span>Descobrir Meu Filme</span>
            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </a>
        </div>
      </section>
      </div>
    </>
  );
}
