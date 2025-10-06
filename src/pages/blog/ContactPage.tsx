import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

// Adicionar estilos CSS para a animação
const styles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Injetar estilos no head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio (em produção, integrar com API)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite'
      }}>
        {/* Back Button */}
        <div style={{ 
          maxWidth: '1024px', 
          margin: '0 auto', 
          padding: '32px 40px 0' 
        }}>
          <Link 
            to="/blog" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#E0E0E0',
              textDecoration: 'none',
              marginBottom: '32px',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Blog</span>
          </Link>
        </div>

        {/* Header */}
        <header style={{ 
          maxWidth: '1024px', 
          margin: '0 auto', 
          padding: '0 40px 24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Category Badge */}
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: '500',
              borderRadius: '9999px',
              backgroundColor: 'rgba(46, 196, 182, 0.1)',
              color: '#2EC4B6',
              border: '1px solid rgba(46, 196, 182, 0.2)',
              marginBottom: '16px'
            }}>
              Contato
            </span>

            {/* Title */}
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#FDFFFC',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Entre em Contato
            </h1>
            
            <h2 style={{
              fontSize: '1.5rem',
              color: '#E0E0E0',
              fontWeight: '400',
              marginBottom: '32px',
              lineHeight: '1.4'
            }}>
              Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
            </h2>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ 
          maxWidth: '1024px', 
          margin: '0 auto', 
          padding: '0 40px 48px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {/* Contact Form */}
            <div style={{
              backgroundColor: 'rgba(2, 44, 73, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#FDFFFC',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <MessageCircle size={24} color="#2EC4B6" />
                Envie sua Mensagem
              </h3>

              {submitStatus === 'success' && (
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  border: '1px solid rgba(46, 196, 182, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  color: '#2EC4B6'
                }}>
                  ✅ Mensagem enviada com sucesso! Responderemos em breve.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#E0E0E0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FDFFFC',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2EC4B6';
                      e.target.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#E0E0E0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FDFFFC',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2EC4B6';
                      e.target.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#E0E0E0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Assunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FDFFFC',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2EC4B6';
                      e.target.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: '#E0E0E0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FDFFFC',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2EC4B6';
                      e.target.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: isSubmitting ? 'rgba(46, 196, 182, 0.3)' : '#2EC4B6',
                    color: '#FDFFFC',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#0A6E65';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#2EC4B6';
                    }
                  }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div style={{
              backgroundColor: 'rgba(2, 44, 73, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#FDFFFC',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Mail size={24} color="#2EC4B6" />
                Informações de Contato
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mail size={20} color="#2EC4B6" />
                  </div>
                  <div>
                    <h4 style={{ color: '#FDFFFC', margin: '0 0 4px 0', fontSize: '1rem' }}>Email</h4>
                    <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>contato@vibesfilm.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Clock size={20} color="#2EC4B6" />
                  </div>
                  <div>
                    <h4 style={{ color: '#FDFFFC', margin: '0 0 4px 0', fontSize: '1rem' }}>Horário</h4>
                    <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MessageCircle size={20} color="#2EC4B6" />
                  </div>
                  <div>
                    <h4 style={{ color: '#FDFFFC', margin: '0 0 4px 0', fontSize: '1rem' }}>Resposta</h4>
                    <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Até 24 horas</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div style={{ marginTop: '32px' }}>
                <h4 style={{
                  color: '#FDFFFC',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  Perguntas Frequentes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(46, 196, 182, 0.1)'
                  }}>
                    <strong style={{ color: '#2EC4B6', fontSize: '0.9rem' }}>Como funciona o Vibesfilm?</strong>
                    <p style={{ color: '#E0E0E0', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                      Recomendamos filmes baseados no seu estado emocional atual.
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(46, 196, 182, 0.1)'
                  }}>
                    <strong style={{ color: '#2EC4B6', fontSize: '0.9rem' }}>É gratuito?</strong>
                    <p style={{ color: '#E0E0E0', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                      Sim, o Vibesfilm é completamente gratuito.
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(46, 196, 182, 0.1)'
                  }}>
                    <strong style={{ color: '#2EC4B6', fontSize: '0.9rem' }}>Posso sugerir filmes?</strong>
                    <p style={{ color: '#E0E0E0', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                      Claro! Use o formulário acima para enviar sugestões.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
