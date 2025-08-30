/**
 * Utilitários de segurança para prevenir ataques de phishing, XSS e spam
 */

// Lista de domínios permitidos
const ALLOWED_DOMAINS = [
  'emofilms.com',
  'www.emofilms.com',
  'moviesf-back.vercel.app',
  'image.tmdb.org',
  'api.themoviedb.org',
  'www.youtube.com',
  'youtube.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'localhost',
  '127.0.0.1'
];

// Lista de protocolos permitidos
const ALLOWED_PROTOCOLS = ['https:', 'http:'];

/**
 * Valida se uma URL é segura e permitida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Verificar protocolo
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      console.warn('Protocolo não permitido:', urlObj.protocol);
      return false;
    }
    
    // Verificar domínio
    const domain = urlObj.hostname.toLowerCase();
    const isAllowed = ALLOWED_DOMAINS.some(allowed => 
      domain === allowed || domain.endsWith('.' + allowed)
    );
    
    if (!isAllowed) {
      console.warn('Domínio não permitido:', domain);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('URL inválida:', url);
    return false;
  }
};

/**
 * Sanitiza texto para prevenir XSS
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitiza HTML para prevenir XSS
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof html !== 'string') {
    return '';
  }
  
  // Remove scripts e tags perigosas
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
  
  // Remove atributos perigosos
  sanitized = sanitized.replace(/\s+(on\w+|javascript:)/gi, '');
  
  return sanitized;
};

/**
 * Valida e sanitiza dados de entrada
 */
export const validateInput = (input: any, type: 'text' | 'email' | 'url' | 'number'): any => {
  if (input === null || input === undefined) {
    return '';
  }
  
  const stringInput = String(input).trim();
  
  switch (type) {
    case 'text':
      return sanitizeText(stringInput);
    
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(stringInput) ? stringInput.toLowerCase() : '';
    
    case 'url':
      return isValidUrl(stringInput) ? stringInput : '';
    
    case 'number':
      const num = parseFloat(stringInput);
      return isNaN(num) ? 0 : num;
    
    default:
      return sanitizeText(stringInput);
  }
};

/**
 * Detecta tentativas de phishing em URLs
 */
export const detectPhishingAttempt = (url: string): boolean => {
  const suspiciousPatterns = [
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
    /[a-zA-Z0-9-]+\.(tk|ml|ga|cf|gq)/, // Free domains
    /(bit\.ly|tinyurl|goo\.gl|t\.co)/, // URL shorteners
    /(login|signin|account|secure|verify|confirm)/, // Suspicious keywords
    /[a-zA-Z0-9-]+\.(xyz|top|club|site|online)/ // Suspicious TLDs
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(url.toLowerCase()));
};

/**
 * Rate limiting simples para prevenir spam
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove requests antigas
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  clear(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Gera um token CSRF simples
 */
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Valida token CSRF
 */
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length > 0;
};

/**
 * Log de segurança
 */
export const logSecurityEvent = (event: string, details: any): void => {
  console.warn(`🔒 Security Event: ${event}`, details);
  
  // Em produção, você pode enviar para um serviço de logging
  if (process.env.NODE_ENV === 'production') {
    // Implementar envio para serviço de logging
    // sendToSecurityLog(event, details);
  }
};

/**
 * Verifica se o ambiente é seguro
 */
export const isSecureEnvironment = (): boolean => {
  return (
    window.location.protocol === 'https:' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  );
};

/**
 * Previne ataques de clickjacking
 */
export const preventClickjacking = (): void => {
  if (window.self !== window.top && window.top) {
    try {
      window.top.location.href = window.self.location.href;
    } catch (error) {
      // Se não conseguir acessar window.top, pode ser um iframe legítimo
      console.warn('Clickjacking prevention: Cannot access top window');
    }
  }
};

// Executar prevenção de clickjacking automaticamente
if (typeof window !== 'undefined') {
  preventClickjacking();
}
