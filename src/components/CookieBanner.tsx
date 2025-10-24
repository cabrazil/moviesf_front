import { useState } from 'react';
import { X, Settings, Check } from 'lucide-react';
import { useCookieConsent } from '../hooks/useCookieConsent';

export const CookieBanner = () => {
  const { hasConsent, acceptAll, rejectAll } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);

  // Não mostrar se já tem consentimento
  if (hasConsent) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleSaveSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      {/* Banner Principal */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#011627',
        borderTop: '1px solid rgba(46, 196, 182, 0.3)',
        padding: '16px 20px',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Texto */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <p style={{
              color: '#FDFFFC',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
              <a href="/blog/privacidade" style={{ color: '#3B82F6', textDecoration: 'none' }}>
                {' '}Saiba mais
              </a>
            </p>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleRejectAll}
              style={{
                backgroundColor: 'transparent',
                color: '#E0E0E0',
                border: '1px solid rgba(224, 224, 224, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.backgroundColor = 'rgba(224, 224, 224, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(224, 224, 224, 0.3)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Rejeitar
            </button>

            <button
              onClick={() => setShowSettings(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#3B82F6',
                border: '1px solid #3B82F6',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Settings size={14} />
              Configurar
            </button>

            <button
              onClick={handleAcceptAll}
              style={{
                backgroundColor: '#3B82F6',
                color: '#011627',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0A6E65';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }}
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Configurações */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#011627',
            border: '1px solid rgba(46, 196, 182, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#FDFFFC',
                fontSize: '18px',
                margin: 0
              }}>
                Configurações de Cookies
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#E0E0E0',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                color: '#E0E0E0',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Escolha quais tipos de cookies deseja aceitar:
              </p>

              {/* Cookies Essenciais */}
              <div style={{
                backgroundColor: 'rgba(46, 196, 182, 0.1)',
                border: '1px solid rgba(46, 196, 182, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    color: '#FDFFFC',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    Cookies Essenciais
                  </h4>
                  <div style={{
                    color: '#3B82F6',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check size={14} />
                    Sempre Ativo
                  </div>
                </div>
                <p style={{
                  color: '#B6C8D6',
                  fontSize: '12px',
                  margin: 0
                }}>
                  Necessários para o funcionamento básico do site.
                </p>
              </div>

              {/* Cookies de Analytics */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    color: '#FDFFFC',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    Cookies de Analytics
                  </h4>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '40px',
                    height: '20px'
                  }}>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#3B82F6',
                      borderRadius: '20px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px',
                        width: '16px',
                        right: '2px',
                        bottom: '2px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
                <p style={{
                  color: '#B6C8D6',
                  fontSize: '12px',
                  margin: 0
                }}>
                  Ajudam a entender como os visitantes interagem com o site.
                </p>
              </div>

              {/* Cookies de Marketing */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    color: '#FDFFFC',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    Cookies de Marketing
                  </h4>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '40px',
                    height: '20px'
                  }}>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#ccc',
                      borderRadius: '20px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px',
                        width: '16px',
                        left: '2px',
                        bottom: '2px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
                <p style={{
                  color: '#B6C8D6',
                  fontSize: '12px',
                  margin: 0
                }}>
                  Usados para exibir anúncios relevantes e medir a eficácia das campanhas.
                </p>
              </div>
            </div>

            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#E0E0E0',
                  border: '1px solid rgba(224, 224, 224, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#011627',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
