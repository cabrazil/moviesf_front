import { useState, useEffect } from 'react';

export function BlogCTACard() {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/android/i.test(userAgent)) {
        setPlatform('android');
      } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        setPlatform('ios');
      }
    }
  }, []);

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
        {platform === 'desktop' 
          ? 'Descubra qual filme combina perfeitamente com sua emoção atual!'
          : 'Leve nossa inteligência emocional para o seu celular. Baixe agora o App Oficial!'}
      </p>

      {platform === 'desktop' ? (
        <>
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
            Acessar Web App
          </a>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <a href="https://play.google.com/store/apps/details?id=com.vibesfilm.app" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', fontSize: '0.875rem', textDecoration: 'none' }}>
              Disponível para Android
            </a>
            <span style={{ color: '#E0E0E0' }}>|</span>
            <a href="https://apps.apple.com/br/app/vibesfilm/id6764453105" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', fontSize: '0.875rem', textDecoration: 'none' }}>
              Disponível para iOS
            </a>
          </div>
        </>
      ) : (
        <a
          href={platform === 'android' ? "https://play.google.com/store/apps/details?id=com.vibesfilm.app" : "https://apps.apple.com/br/app/vibesfilm/id6764453105"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: platform === 'android' ? '#059669' : '#FFFFFF',
            color: platform === 'android' ? '#FFFFFF' : '#011627',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            maxWidth: '280px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)';
          }}
        >
          {platform === 'android' ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.60938 1.95312C3.375 2.1875 3.23438 2.5625 3.23438 3.03125V20.9688C3.23438 21.4375 3.375 21.8125 3.60938 22.0469L3.65625 22.0938L13.7344 12.0156V11.9844L3.65625 1.90625L3.60938 1.95312Z" fill="#FFFFFF"/>
                <path d="M17.0625 15.3438L13.7344 12.0156V11.9844L17.0625 8.65625L17.1094 8.6875L21.0469 10.9219C22.1719 11.5625 22.1719 12.4375 21.0469 13.0781L17.1094 15.3125L17.0625 15.3438Z" fill="#FFFFFF"/>
                <path d="M17.1094 15.3125L13.7344 11.9844L3.65625 22.0469C4.03125 22.4375 4.64062 22.4844 5.34375 22.0938L17.1094 15.3125Z" fill="#FFFFFF"/>
                <path d="M17.1094 8.6875L5.34375 1.90625C4.64062 1.51562 4.03125 1.5625 3.65625 1.95312L13.7344 12.0156L17.1094 8.6875Z" fill="#FFFFFF"/>
              </svg>
              Baixar na Google Play
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.97 12.01 4.72 9c.88-1.52 2.41-2.48 4.11-2.51 1.27-.02 2.46.87 3.24.87.78 0 2.22-1.05 3.75-.9.65.02 2.46.25 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.3 2.72zM12.91 5.99c.02-.01.05-.03.08-.06.53-.63.89-1.51.77-2.41-.02-.03-.04-.07-.07-.09-.9.04-1.78.61-2.26 1.21-.02.03-.04.05-.05.08-.53.64-.88 1.55-.74 2.44.02.03.05.07.08.08.06.01.12.02.18.02.73 0 1.52-.39 2.01-.89z"/>
              </svg>
              Baixar na App Store
            </>
          )}
        </a>
      )}
    </div>
  );
}
