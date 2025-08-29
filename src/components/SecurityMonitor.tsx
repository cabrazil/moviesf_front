import React, { useEffect, useState } from 'react';
import { logSecurityEvent, detectPhishingAttempt, isSecureEnvironment } from '../utils/security';

interface SecurityEvent {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityMonitorProps {
  children: React.ReactNode;
}

const SecurityMonitor: React.FC<SecurityMonitorProps> = ({ children }) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Monitorar mudanças no DOM para detectar injeções suspeitas
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              checkForSuspiciousContent(element);
            }
          });
        }
      });
    });

    // Monitorar mudanças de atributos
    const attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const element = mutation.target as Element;
          checkForSuspiciousAttributes(element);
        }
      });
    });

    // Monitorar cliques em links suspeitos
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        checkLinkSecurity(link.href, event);
      }
    };

    // Monitorar mudanças de URL usando History API
    const handleUrlChange = () => {
      checkUrlSecurity(window.location.href);
    };

    // Monitorar tentativas de abertura de popups de forma mais segura
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Verificar se há redirecionamentos suspeitos
      const currentUrl = window.location.href;
      if (detectPhishingAttempt(currentUrl)) {
        logSecurityEvent('Suspicious URL detected on page unload', { url: currentUrl });
        addSecurityEvent('high', 'URL suspeita detectada durante navegação');
      }
    };

    // Monitorar mudanças de hash
    const handleHashChange = () => {
      const newUrl = window.location.href;
      if (detectPhishingAttempt(newUrl)) {
        logSecurityEvent('Suspicious hash change detected', { url: newUrl });
        addSecurityEvent('high', 'Mudança de hash suspeita detectada');
      }
    };

    // Iniciar observadores
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    attributeObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['href', 'src', 'onclick', 'onload', 'onerror']
    });

    // Adicionar event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Verificar ambiente de segurança
    if (!isSecureEnvironment()) {
      addSecurityEvent('medium', 'Ambiente não seguro detectado');
    }

    // Cleanup
    return () => {
      observer.disconnect();
      attributeObserver.disconnect();
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const checkForSuspiciousContent = (element: Element) => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /document\.write/i
    ];

    const content = element.outerHTML || element.textContent || '';
    
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        logSecurityEvent('Suspicious content detected', { content: content.substring(0, 100) });
        addSecurityEvent('high', 'Conteúdo suspeito detectado');
      }
    });
  };

  const checkForSuspiciousAttributes = (element: Element) => {
    const suspiciousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    
    suspiciousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        const value = element.getAttribute(attr);
        if (value && /javascript:|eval\(/i.test(value)) {
          logSecurityEvent('Suspicious attribute detected', { attribute: attr, value });
          addSecurityEvent('high', 'Atributo suspeito detectado');
        }
      }
    });
  };

  const checkLinkSecurity = (url: string, event: MouseEvent) => {
    if (detectPhishingAttempt(url)) {
      event.preventDefault();
      logSecurityEvent('Suspicious link clicked', { url });
      addSecurityEvent('critical', 'Link suspeito clicado');
      
      // Mostrar aviso ao usuário
      if (confirm('Este link parece suspeito. Deseja continuar mesmo assim?')) {
        // Usar uma abordagem mais segura para abrir links
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
    }
  };

  const checkUrlSecurity = (url: string) => {
    if (detectPhishingAttempt(url)) {
      logSecurityEvent('Suspicious URL detected', { url });
      addSecurityEvent('high', 'URL suspeita detectada');
    }
  };

  const addSecurityEvent = (severity: SecurityEvent['severity'], message: string) => {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      type: 'security_alert',
      message,
      timestamp: new Date(),
      severity
    };

    setSecurityEvents(prev => [...prev, event]);
    
    // Em produção, enviar para serviço de logging
    if (process.env.NODE_ENV === 'production') {
      // sendToSecurityService(event);
    }
  };

  const clearEvents = () => {
    setSecurityEvents([]);
  };

  // Botão para mostrar/ocultar o monitor (apenas em desenvolvimento)
  const toggleMonitor = () => {
    setShowMonitor(!showMonitor);
  };

  return (
    <>
      {children}
      
      {/* Botão flutuante para ativar o monitor (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={toggleMonitor}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: securityEvents.length > 0 ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            zIndex: 9998,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          title={`Monitor de Segurança (${securityEvents.length} eventos)`}
        >
          🔒
        </button>
      )}

      {/* Painel de monitoramento (apenas quando ativado) */}
      {process.env.NODE_ENV === 'development' && showMonitor && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '300px',
          maxHeight: '400px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '10px',
          zIndex: 9999,
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, color: '#fff' }}>🔒 Security Monitor</h4>
            <div>
              <button 
                onClick={clearEvents}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginRight: '10px'
                }}
              >
                Clear
              </button>
              <button 
                onClick={toggleMonitor}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
          
          {securityEvents.length === 0 ? (
            <div style={{ color: '#ccc', textAlign: 'center', padding: '20px' }}>
              Nenhum evento de segurança detectado
            </div>
          ) : (
            securityEvents.map(event => (
              <div 
                key={event.id}
                style={{
                  padding: '8px',
                  marginBottom: '5px',
                  backgroundColor: getSeverityColor(event.severity),
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#fff' }}>
                  {event.severity.toUpperCase()}
                </div>
                <div style={{ color: '#fff' }}>{event.message}</div>
                <div style={{ color: '#ccc', fontSize: '10px' }}>
                  {event.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

const getSeverityColor = (severity: SecurityEvent['severity']): string => {
  switch (severity) {
    case 'low': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'high': return '#F44336';
    case 'critical': return '#9C27B0';
    default: return '#666';
  }
};

export default SecurityMonitor;
