import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function SmartAppBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Verificar se o usuário já fechou o banner nesta sessão
    const isBannerDismissed = sessionStorage.getItem('smart-app-banner-dismissed');

    if (!isBannerDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('smart-app-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(1, 22, 39, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(15px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <span style={{ 
            color: '#FFFFFF', 
            fontSize: '13px', 
            fontWeight: 600,
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>Baixe o App oficial (Android e iOS)</span>
        </div>
      </div>

      <style>{`
        .smart-banner-btn-text { display: none; }
        .smart-banner-btn { width: 36px; padding: 0; }
        @media (min-width: 600px) {
          .smart-banner-btn-text { display: inline-block; margin-left: 8px; }
          .smart-banner-btn { width: auto !important; padding: 0 16px !important; }
        }
      `}</style>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {/* Google Play */}
        <a
          href="https://play.google.com/store/apps/details?id=com.vibesfilm.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Baixar para Android"
          className="smart-banner-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            height: '36px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={handleDismiss}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.60938 1.95312C3.375 2.1875 3.23438 2.5625 3.23438 3.03125V20.9688C3.23438 21.4375 3.375 21.8125 3.60938 22.0469L3.65625 22.0938L13.7344 12.0156V11.9844L3.65625 1.90625L3.60938 1.95312Z" fill="#00E3FF"/>
            <path d="M17.0625 15.3438L13.7344 12.0156V11.9844L17.0625 8.65625L17.1094 8.6875L21.0469 10.9219C22.1719 11.5625 22.1719 12.4375 21.0469 13.0781L17.1094 15.3125L17.0625 15.3438Z" fill="#FFE000"/>
            <path d="M17.1094 15.3125L13.7344 11.9844L3.65625 22.0469C4.03125 22.4375 4.64062 22.4844 5.34375 22.0938L17.1094 15.3125Z" fill="#FF3A44"/>
            <path d="M17.1094 8.6875L5.34375 1.90625C4.64062 1.51562 4.03125 1.5625 3.65625 1.95312L13.7344 12.0156L17.1094 8.6875Z" fill="#32FF7E"/>
          </svg>
          <span className="smart-banner-btn-text">Android</span>
        </a>

        {/* Apple Store */}
        <a
          href="https://apps.apple.com/br/app/vibesfilm/id6764453105"
          target="_blank"
          rel="noopener noreferrer"
          title="Baixar para iOS"
          className="smart-banner-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            height: '36px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onClick={handleDismiss}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '-2px' }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.97 12.01 4.72 9c.88-1.52 2.41-2.48 4.11-2.51 1.27-.02 2.46.87 3.24.87.78 0 2.22-1.05 3.75-.9.65.02 2.46.25 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.3 2.72zM12.91 5.99c.02-.01.05-.03.08-.06.53-.63.89-1.51.77-2.41-.02-.03-.04-.07-.07-.09-.9.04-1.78.61-2.26 1.21-.02.03-.04.05-.05.08-.53.64-.88 1.55-.74 2.44.02.03.05.07.08.08.06.01.12.02.18.02.73 0 1.52-.39 2.01-.89z"/>
          </svg>
          <span className="smart-banner-btn-text">iOS</span>
        </a>
      </div>
    </div>
  );
}
