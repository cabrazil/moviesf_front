import React from 'react';
import { BlogHeader } from './BlogHeader';
import { BlogFooter } from './BlogFooter';

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  // Add blog class to body when component mounts
  React.useEffect(() => {
    document.body.classList.add('blog-active');
    return () => {
      document.body.classList.remove('blog-active');
    };
  }, []);

  return (
    <div className="blog-container" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 8s ease infinite',
      minHeight: '100vh'
    }}>
      <BlogHeader />
      <main style={{ flex: 1, backgroundColor: 'transparent' }}>
        {children}
      </main>
      <BlogFooter />
    </div>
  );
}
