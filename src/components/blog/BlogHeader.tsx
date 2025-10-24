import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Tag, Search } from 'lucide-react';
import logoBlog from '../../assets/logo_header.png';

export function BlogHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categorias', href: '/categorias', icon: Tag },
    { name: 'Sobre', href: '/sobre', icon: User },
  ];

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && isMobile) {
        const target = event.target as HTMLElement;
        if (!target.closest('.mobile-menu-container')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isMobile]);

  return (
    <header style={{ 
      backgroundColor: 'rgba(1, 22, 39, 0.95)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src={logoBlog} 
            alt="VibesFilm Logo"
            style={{
              height: isMobile ? 40 : 48,
              width: 'auto',
              maxWidth: isMobile ? 200 : 320,
              objectFit: 'contain'
            }}
          />
        </Link>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav style={{ 
          display: isMobile ? 'none' : 'flex', 
          gap: '32px' 
        }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive(item.href) ? '#3B82F6' : '#E0E0E0',
                  backgroundColor: isActive(item.href) ? 'rgba(46, 196, 182, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Search & App Link - Hidden on Mobile */}
        <div style={{ 
          display: isMobile ? 'none' : 'flex', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          <button style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#E0E0E0',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Search size={20} />
          </button>
          <a 
            href="/app" 
            style={{
              backgroundColor: '#3B82F6',
              color: '#011627',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            Usar App
          </a>
        </div>

        {/* Mobile menu button - Only visible on mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: isMobile ? 'flex' : 'none',
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#E0E0E0',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && isMobile && (
        <div 
          className="mobile-menu-container"
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(1, 22, 39, 0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#3B82F6' : '#E0E0E0',
                    backgroundColor: isActive(item.href) ? 'rgba(46, 196, 182, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Search */}
            <div style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Search size={20} color="#E0E0E0" />
              <span style={{ color: '#E0E0E0', fontSize: '16px' }}>Buscar</span>
            </div>
            
            {/* Mobile App Button */}
            <div style={{ 
              paddingTop: '8px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              marginTop: '8px' 
            }}>
              <a 
                href="/app" 
                style={{
                  display: 'block',
                  backgroundColor: '#3B82F6',
                  color: '#011627',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
              >
                Usar App VibesFilm
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}