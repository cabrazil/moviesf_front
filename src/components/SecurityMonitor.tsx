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

    // Monitorar mudanças de URL
    const handleUrlChange = () => {
      checkUrlSecurity(window.location.href);
    };

    // Monitorar tentativas de abertura de popups
    const originalOpen = window.open;
    window.open = function(url?: string | URL, target?: string, features?: string) {
      if (url && typeof url === 'string' && detectPhishingAttempt(url)) {
        logSecurityEvent('Phishing attempt detected', { url, target, features });
        addSecurityEvent('critical', 'Tentativa de phishing detectada');
        return null;
      }
      return originalOpen.call(this, url, target, features);
    };

    // Monitorar tentativas de redirecionamento
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    
    window.location.assign = function(url: string | URL) {
      if (typeof url === 'string' && detectPhishingAttempt(url)) {
        logSecurityEvent('Suspicious redirect attempt', { url });
        addSecurityEvent('high', 'Tentativa de redirecionamento suspeito');
        return;
      }
      return originalAssign.call(this, url);
    };

    window.location.replace = function(url: string | URL) {
      if (typeof url === 'string' && detectPhishingAttempt(url)) {
        logSecurityEvent('Suspicious redirect attempt', { url });
        addSecurityEvent('high', 'Tentativa de redirecionamento suspeito');
        return;
      }
      return originalReplace.call(this, url);
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
    window.addEventListener('hashchange', handleUrlChange);

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
      window.removeEventListener('hashchange', handleUrlChange);
      
      // Restaurar funções originais
      window.open = originalOpen;
      window.location.assign = originalAssign;
      window.location.replace = originalReplace;
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
        window.open(url, '_blank', 'noopener,noreferrer');
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

  // Em desenvolvimento, mostrar painel de monitoramento
  if (process.env.NODE_ENV === 'development' && securityEvents.length > 0) {
    return (
      <div style={{ position: 'relative' }}>
        {children}
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
            <button 
              onClick={clearEvents}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear
            </button>
          </div>
          {securityEvents.map(event => (
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
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
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
