import { Heart, Mail, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoBlog from '../../assets/logo_blog.png';

export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    blog: [
      { name: 'Últimos Artigos', href: '/' },
      { name: 'Categorias', href: '/categorias' },
      { name: 'Autores', href: '/autores' },
      { name: 'Newsletter', href: '/newsletter' },
    ],
    vibesfilm: [
      { name: 'Usar o App', href: '/app', external: true },
      { name: 'Como Funciona', href: '/sobre' },
      { name: 'Sobre o Projeto', href: '/sobre' },
      { name: 'Contato', href: '/contato' },
    ],
    legal: [
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Termos de Uso', href: '/termos' },
      { name: 'Cookies', href: '/cookies' },
    ]
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-400' },
    { name: 'Email', icon: Mail, href: 'mailto:contato@vibesfilm.com', color: 'hover:text-green-400' },
  ];

  return (
    <footer style={{
      backgroundColor: '#022c49',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '80px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 20px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px' 
            }}>
              <img 
                src={logoBlog} 
                alt="VibesFilm Blog Logo"
                style={{
                  height: 48,
                  width: 'auto',
                  maxWidth: 200,
                  objectFit: 'contain'
                }}
              />
            </div>
            <p style={{ 
              color: '#E0E0E0', 
              fontSize: '14px', 
              lineHeight: '1.6', 
              marginBottom: '24px'
            }}>Transformar a experiência de escolha de filmes, conectando pessoas com histórias 
               que realmente importam para seus corações e mentes. Artigos, análises e curadoria 
               cinematográfica.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '30px' }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    style={{
                      color: '#E0E0E0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#2EC4B6';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#E0E0E0';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Blog Links */}
          <div>
            <h4 style={{ 
              color: '#FDFFFC', 
              fontWeight: '600', 
              marginBottom: '14px'
            }}>Blog</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.blog.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    style={{
                      color: '#E0E0E0',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* VibesFilm Links */}
          <div>
            <h4 style={{ 
              color: '#FDFFFC', 
              fontWeight: '600', 
              marginBottom: '14px'
            }}>VibesFilm</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.vibesfilm.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#E0E0E0',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
                    >
                      <span>{link.name}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      style={{
                        color: '#E0E0E0',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ 
              color: '#FDFFFC', 
              fontWeight: '600', 
              marginBottom: '14px'
            }}>Newsletter</h4>
            <p style={{ 
              color: '#E0E0E0', 
              fontSize: '14px', 
              marginBottom: '14px'
            }}>
              Receba conteúdo exclusivo sobre cinema e emoções.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="Seu email"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#011627',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#FDFFFC',
                  fontSize: '14px'
                }}
              />
              <button style={{
                backgroundColor: '#2EC4B6',
                color: '#011627',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
              >
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '32px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <p style={{ 
              color: '#E0E0E0', 
              fontSize: '14px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              © {currentYear} VibesFilm. Feito com <Heart size={16} style={{ color: '#ef4444', fill: 'currentColor' }} /> para cinéfilos.
            </p>
            
            <div style={{ display: 'flex', gap: '24px' }}>
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  style={{
                    color: '#E0E0E0',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#2EC4B6'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
