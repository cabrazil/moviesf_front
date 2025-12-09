/**
 * Configuração centralizada da API
 * Suporta ambientes de desenvolvimento (localhost) e produção (VPS)
 */

/**
 * Obtém a URL base da API
 * Prioridade: VITE_API_BASE_URL > detecção automática > localhost
 * 
 * Desenvolvimento: http://localhost:3333 (backend local)
 * Produção: https://api.vibesfilm.com (ou URL configurada)
 */
export const getApiBaseUrl = (): string => {
  // Prioridade 1: Variável de ambiente explícita (maior prioridade)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Prioridade 2: Detecção automática baseada na URL atual
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname === '0.0.0.0';
    
    // Se estiver em localhost, usar backend local (desenvolvimento)
    if (isLocalhost) {
      return 'http://localhost:3333';
    }
    
    // Se estiver em produção (não localhost), usar URL de produção
    // Backend em subdomínio (ex: api.vibesfilm.com)
    if (hostname.includes('vibesfilm.com')) {
      return `https://api.${hostname.replace(/^[^.]+\./, '')}`;
    }
    
    // Fallback: usar localhost (para desenvolvimento local)
    return 'http://localhost:3333';
  }
  
  // Fallback: localhost (para desenvolvimento)
  return 'http://localhost:3333';
};

/**
 * Obtém a URL completa da API para um endpoint específico
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remover barra inicial do endpoint se existir
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Obtém a URL da API do blog
 */
export const getBlogApiUrl = (endpoint: string = ''): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/api/blog${cleanEndpoint ? `/${cleanEndpoint}` : ''}`;
};

/**
 * Obtém a URL da API de newsletter
 */
export const getNewsletterApiUrl = (): string => {
  return getApiUrl('/api/newsletter');
};

