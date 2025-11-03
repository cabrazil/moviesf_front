import { useState } from 'react';

interface NewsletterFormProps {
  source?: 'blog_home' | 'footer' | 'article';
}

interface NewsletterResponse {
  success: boolean;
  message: string;
  error?: string;
}

const API_BASE_URL = import.meta.env.PROD
  ? 'https://moviesf-back.vercel.app/api/newsletter'
  : 'http://localhost:3333/api/newsletter';

export function NewsletterForm({ source = 'blog_home' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Validação de email em tempo real
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Limpar erro de email enquanto está digitando
    // A validação completa será feita apenas no submit ou no blur
    if (emailError) {
      setEmailError(null);
    }
    
    // Limpar erros gerais quando usuário começa a digitar
    if (error) {
      setError(null);
    }
  };

  const handleEmailBlur = () => {
    // Validar apenas quando o usuário sair do campo
    if (email && !validateEmail(email)) {
      setEmailError('Email inválido');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Resetar estados
    setError(null);
    setEmailError(null);

    // Validações
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    if (!consent) {
      setError('Você precisa aceitar a política de privacidade');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source,
        }),
      });

      const data: NewsletterResponse = await response.json();

      if (data.success) {
        setSuccess(true);
        setSuccessMessage(data.message || 'Inscrição realizada com sucesso!');
        setEmail('');
        setConsent(false);
        
        // Resetar mensagem de sucesso após 15 segundos (aumentado)
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage('');
        }, 15000);
      } else {
        setError(data.message || 'Erro ao processar inscrição. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao inscrever na newsletter:', err);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se sucesso, mostrar mensagem
  if (success) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1) 0%, rgba(255, 159, 28, 0.1) 100%)',
        border: '1px solid rgba(46, 196, 182, 0.2)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: '#2EC4B6', 
          fontSize: '2rem', 
          marginBottom: '12px' 
        }}>
          ✓
        </div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#FDFFFC', 
          marginBottom: '12px',
          marginTop: 0
        }}>
          {successMessage.includes('já está inscrito') ? 'Você já está inscrito!' : 'Obrigado pela sua inscrição!'}
        </h3>
        <p style={{ 
          color: '#E0E0E0', 
          fontSize: '0.875rem', 
          marginTop: 0,
          marginBottom: 0
        }}>
          {successMessage || 'Em breve você receberá conteúdos exclusivos sobre cinema e emoções. Obrigado por se inscrever! 🎬'}
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setSuccessMessage('');
          }}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: '#E0E0E0',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1) 0%, rgba(255, 159, 28, 0.1) 100%)',
      border: '1px solid rgba(46, 196, 182, 0.2)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#FDFFFC', 
        marginBottom: '16px',
        marginTop: 0
      }}>
        📧 Newsletter VibesFilm
      </h3>
      <p style={{ 
        color: '#E0E0E0', 
        fontSize: '0.875rem', 
        marginBottom: '20px',
        marginTop: 0
      }}>
        Receba semanalmente artigos exclusivos sobre cinema e emoções direto no seu email.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input 
            type="email" 
            placeholder="Seu melhor email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#011627',
              border: emailError ? '1px solid #FF6B35' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FDFFFC',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
          {emailError && (
            <p style={{ 
              color: '#FF6B35', 
              fontSize: '0.75rem', 
              marginTop: '4px', 
              marginBottom: 0,
              textAlign: 'left'
            }}>
              {emailError}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={loading}
            style={{
              marginTop: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          />
          <label 
            htmlFor="consent" 
            style={{ 
              color: '#E0E0E0', 
              fontSize: '0.75rem', 
              textAlign: 'left',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Aceito a{' '}
            <a 
              href="/blog/privacidade" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#2EC4B6', 
                textDecoration: 'underline' 
              }}
            >
              Política de Privacidade
            </a>
            {' '}e receber comunicações do VibesFilm
          </label>
        </div>

        {error && (
          <p style={{ 
            color: '#FF6B35', 
            fontSize: '0.75rem', 
            marginTop: 0,
            marginBottom: 0,
            textAlign: 'left'
          }}>
            {error}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading || !email.trim() || !consent}
          style={{
            backgroundColor: loading || !email.trim() || !consent ? '#666' : '#FF6B35',
            color: '#011627',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || !email.trim() || !consent ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            opacity: loading || !email.trim() || !consent ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (!loading && email.trim() && consent) {
              e.currentTarget.style.backgroundColor = '#E55A2B';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && email.trim() && consent) {
              e.currentTarget.style.backgroundColor = '#FF6B35';
            }
          }}
        >
          {loading ? 'Enviando...' : 'Quero Receber!'}
        </button>
      </form>

      <p style={{ 
        fontSize: '0.75rem', 
        color: '#E0E0E0', 
        marginTop: '12px',
        marginBottom: 0
      }}>
        Sem spam, apenas conteúdo de qualidade 🎬
      </p>
    </div>
  );
}

