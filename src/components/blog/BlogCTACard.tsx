export function BlogCTACard() {
  return (
    <div style={{
      backgroundColor: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
      border: '2px solid #FF6B35',
      borderRadius: '16px',
      padding: '32px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      minHeight: '300px',
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>

      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#FDFFFC',
        margin: '0 0 8px 0',
        lineHeight: '1.3'
      }}>
        Gostou das análises?
      </h3>

      <p style={{
        fontSize: '1rem',
        color: '#E0E0E0',
        margin: '0 0 20px 0',
        lineHeight: '1.5',
        maxWidth: '300px'
      }}>
        Descubra qual filme combina perfeitamente com sua emoção atual!
      </p>

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
        Encontrar Meu Filme
      </a>
    </div>
  );
}
