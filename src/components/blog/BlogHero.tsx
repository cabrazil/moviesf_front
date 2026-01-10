import { useState, useEffect } from 'react';

export function BlogHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById('latest-posts');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      backgroundColor: 'transparent',
      minHeight: isMobile ? '50vh' : '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '20px 16px' : '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 'bold',
          marginBottom: isMobile ? '16px' : '24px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #FF6B35 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          O filme perfeito para sua vibe!
        </h1>

        <p style={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          color: '#E0E0E0',
          marginBottom: isMobile ? '24px' : '32px',
          lineHeight: '1.6'
        }}>
          Descubra artigos exclusivos sobre cinema, emoções e como encontrar
          filmes que conectam com seu estado de espírito atual.
        </p>

        <div style={{
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <a
            href="/app"
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#E55A2B';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 107, 53, 0.4)';
            }}
          >
            🎯 Encontrar Meu Filme
          </a>

          <button
            onClick={scrollToContent}
            style={{
              backgroundColor: 'transparent',
              color: '#3B82F6',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #3B82F6',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3B82F6';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#3B82F6';
            }}
          >
            Explorar Artigos
          </button>

        </div>

        {/* TODO: Implementar seção de estatísticas quando tiver volume significativo */}
        {/* 
        <div style={{ 
          marginTop: '64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '32px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>500+</div>
            <div style={{ color: '#E0E0E0' }}>Filmes Analisados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B35' }}>50+</div>
            <div style={{ color: '#E0E0E0' }}>Artigos Publicados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>10k+</div>
            <div style={{ color: '#E0E0E0' }}>Leitores Mensais</div>
          </div>
        </div>
        */}
      </div>
    </section>
  );
}
