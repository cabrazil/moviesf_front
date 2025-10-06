import { useState, useEffect } from 'react';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = 'vibesfilm_cookie_consent';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar consentimento salvo
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
      } catch (error) {
        console.error('Erro ao carregar consentimento de cookies:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const acceptAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    };
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const rejectAll = () => {
    const newConsent: CookieConsent = {
      essential: true, // Essenciais sempre aceitos
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    };
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const updateConsent = (updates: Partial<CookieConsent>) => {
    const newConsent = {
      ...consent!,
      ...updates,
      timestamp: Date.now()
    };
    setConsent(newConsent);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const clearConsent = () => {
    setConsent(null);
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  };

  return {
    consent,
    isLoading,
    hasConsent: consent !== null,
    acceptAll,
    rejectAll,
    updateConsent,
    clearConsent
  };
};
