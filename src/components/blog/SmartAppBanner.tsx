import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import logoSmall from '../../assets/logo_header.png';

export function SmartAppBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Verificar se é Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // 2. Verificar se o usuário já fechou o banner nesta sessão
    const isBannerDismissed = sessionStorage.getItem('smart-app-banner-dismissed');

    if (isAndroid && !isBannerDismissed) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}>
          <img src={logoSmall} alt="Vibesfilm" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Sua vibe pede um filme</span>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '11px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>Baixe o App oficial</span>
        </div>
      </div>

      <a
        href="https://play.google.com/store/apps/details?id=com.vibesfilm.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 107, 53, 0.2)', // Laranja translúcido
          border: '1px solid rgba(255, 107, 53, 0.4)',
          color: '#FF6B35',
          padding: '6px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          transition: 'all 0.2s',
          flexShrink: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={handleDismiss}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.60938 1.95312C3.375 2.1875 3.23438 2.5625 3.23438 3.03125V20.9688C3.23438 21.4375 3.375 21.8125 3.60938 22.0469L3.65625 22.0938L13.7344 12.0156V11.9844L3.65625 1.90625L3.60938 1.95312Z" fill="#00E3FF"/>
          <path d="M17.0625 15.3438L13.7344 12.0156V11.9844L17.0625 8.65625L17.1094 8.6875L21.0469 10.9219C22.1719 11.5625 22.1719 12.4375 21.0469 13.0781L17.1094 15.3125L17.0625 15.3438Z" fill="#FFE000"/>
          <path d="M17.1094 15.3125L13.7344 11.9844L3.65625 22.0469C4.03125 22.4375 4.64062 22.4844 5.34375 22.0938L17.1094 15.3125Z" fill="#FF3A44"/>
          <path d="M17.1094 8.6875L5.34375 1.90625C4.64062 1.51562 4.03125 1.5625 3.65625 1.95312L13.7344 12.0156L17.1094 8.6875Z" fill="#32FF7E"/>
        </svg>
        Baixar
      </a>
    </div>
  );
}
