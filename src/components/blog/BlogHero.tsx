                           export function BlogHero() {
  const scrollToContent = () => {
    const element = document.getElementById('latest-posts');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ 
      backgroundColor: 'transparent', 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #2EC4B6 0%, #FF9F1C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          O filme perfeito para sua vibe!
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#E0E0E0', 
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Descubra artigos exclusivos sobre cinema, emoções e como encontrar 
          filmes que conectam com seu estado de espírito atual.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={scrollToContent}
            style={{
              backgroundColor: '#2EC4B6',
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
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
          >
            Explorar Artigos
          </button>
          
          <a 
            href="/app" 
            style={{
              backgroundColor: 'transparent',
              color: '#2EC4B6',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #2EC4B6',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block'
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
            Encontrar Meu Filme
          </a>
        </div>

        {/* Stats */}
        <div style={{ 
          marginTop: '64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '32px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2EC4B6' }}>500+</div>
            <div style={{ color: '#E0E0E0' }}>Filmes Analisados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9F1C' }}>50+</div>
            <div style={{ color: '#E0E0E0' }}>Artigos Publicados</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2EC4B6' }}>10k+</div>
            <div style={{ color: '#E0E0E0' }}>Leitores Mensais</div>
          </div>
        </div>
      </div>
    </section>
  );
}
