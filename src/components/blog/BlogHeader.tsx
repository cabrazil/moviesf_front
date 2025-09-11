import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Tag, Search } from 'lucide-react';

export function BlogHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/blog', icon: Home },
    { name: 'Categorias', href: '/blog/categorias', icon: Tag },
    { name: 'Sobre', href: '/blog/sobre', icon: User },
  ];

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
        <Link to="/blog" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/src/assets/logo_blog.png" 
            alt="VibesFilm Logo"
            style={{
              height: 48,
              width: 'auto',
              maxWidth: 320,
              objectFit: 'contain'
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '32px' }}>
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
                  color: isActive(item.href) ? '#2EC4B6' : '#E0E0E0',
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

        {/* Search & App Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            href="/" 
            style={{
              backgroundColor: '#2EC4B6',
              color: '#011627',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
          >
            Usar App
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#E0E0E0',
            cursor: 'pointer'
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{ 
          padding: '16px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(1, 22, 39, 0.95)'
        }}>
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
                    padding: '12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#2EC4B6' : '#E0E0E0',
                    backgroundColor: isActive(item.href) ? 'rgba(46, 196, 182, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '16px' }}>
              <a 
                href="/" 
                style={{
                  display: 'block',
                  backgroundColor: '#2EC4B6',
                  color: '#011627',
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0A6E65'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
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