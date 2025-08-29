/**
 * Configurações de segurança centralizadas
 */

export const SECURITY_CONFIG = {
  // Domínios permitidos para requisições
  ALLOWED_DOMAINS: [
    'emofilms.com',
    'www.emofilms.com',
    'moviesf-back.vercel.app',
    'image.tmdb.org',
    'api.themoviedb.org',
    'www.youtube.com',
    'youtube.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ],

  // Protocolos permitidos
  ALLOWED_PROTOCOLS: ['https:', 'http:'],

  // Configurações de rate limiting
  RATE_LIMITING: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60000, // 1 minuto
    BURST_LIMIT: 20,
    BURST_WINDOW_MS: 10000 // 10 segundos
  },

  // Configurações de CSP (Content Security Policy)
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://www.youtube.com",
      "https://www.googletagmanager.com"
    ],
    STYLE_SRC: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    FONT_SRC: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    IMG_SRC: [
      "'self'",
      "data:",
      "https:",
      "http:"
    ],
    MEDIA_SRC: [
      "'self'",
      "https:"
    ],
    CONNECT_SRC: [
      "'self'",
      "https://moviesf-back.vercel.app",
      "https://image.tmdb.org",
      "https://api.themoviedb.org"
    ],
    FRAME_SRC: [
      "'self'",
      "https://www.youtube.com"
    ],
    OBJECT_SRC: ["'none'"],
    BASE_URI: ["'self'"],
    FORM_ACTION: ["'self'"],
    FRAME_ANCESTORS: ["'none'"]
  },

  // Padrões suspeitos para detecção de phishing
  PHISHING_PATTERNS: [
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
    /[a-zA-Z0-9-]+\.(tk|ml|ga|cf|gq)/, // Free domains
    /(bit\.ly|tinyurl|goo\.gl|t\.co)/, // URL shorteners
    /(login|signin|account|secure|verify|confirm)/, // Suspicious keywords
    /[a-zA-Z0-9-]+\.(xyz|top|club|site|online)/ // Suspicious TLDs
  ],

  // Configurações de logging
  LOGGING: {
    ENABLED: true,
    LEVEL: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    SEND_TO_SERVICE: process.env.NODE_ENV === 'production',
    SERVICE_URL: process.env.VITE_SECURITY_LOG_URL || ''
  },

  // Configurações de autenticação
  AUTH: {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY: 3600000, // 1 hora
    REFRESH_EXPIRY: 604800000 // 7 dias
  },

  // Configurações de sessão
  SESSION: {
    TIMEOUT: 1800000, // 30 minutos
    WARNING_TIME: 300000, // 5 minutos antes do timeout
    CLEAR_ON_CLOSE: true
  },

  // Configurações de monitoramento
  MONITORING: {
    ENABLED: true,
    CHECK_INTERVAL: 5000, // 5 segundos
    MAX_EVENTS: 100,
    AUTO_CLEAR: true,
    CLEAR_INTERVAL: 300000 // 5 minutos
  }
};

// Configurações específicas por ambiente
export const ENV_SECURITY_CONFIG = {
  development: {
    ...SECURITY_CONFIG,
    LOGGING: {
      ...SECURITY_CONFIG.LOGGING,
      LEVEL: 'debug',
      SEND_TO_SERVICE: false
    },
    MONITORING: {
      ...SECURITY_CONFIG.MONITORING,
      CHECK_INTERVAL: 2000
    }
  },
  production: {
    ...SECURITY_CONFIG,
    LOGGING: {
      ...SECURITY_CONFIG.LOGGING,
      LEVEL: 'warn',
      SEND_TO_SERVICE: true
    },
    MONITORING: {
      ...SECURITY_CONFIG.MONITORING,
      CHECK_INTERVAL: 10000
    }
  }
};

// Função para obter configuração baseada no ambiente
export const getSecurityConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENV_SECURITY_CONFIG[env as keyof typeof ENV_SECURITY_CONFIG] || SECURITY_CONFIG;
};

// Configurações de headers de segurança
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Configurações de cache para APIs
export const API_CACHE_CONFIG = {
  'api/': {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};
