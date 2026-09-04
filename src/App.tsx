import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import { CookieBanner } from './components/CookieBanner';
import Home from './pages/Home';
import HubLanding from './pages/HubLanding';
import JourneyIntro from './pages/JourneyIntro';
import MovieSuggestionsPageMinimal from './pages/MovieSuggestionsPageMinimal';
import StreamingFilters from './pages/StreamingFilters';
import MovieDetailWrapper from './pages/MovieDetailWrapper';
// Blog imports
import { BlogLayout } from './components/blog/BlogLayout';
import { BlogHome } from './pages/blog/BlogHome';
import { ArticlePage } from './pages/blog/ArticlePage';
import { TagPage } from './pages/blog/TagPage';
import { CategoriesPage } from './pages/blog/CategoriesPage';
import { CategoryPage } from './pages/blog/CategoryPage';
import AboutPage from './pages/blog/AboutPage';
import ContactPage from './pages/blog/ContactPage';
import PrivacyPage from './pages/blog/PrivacyPage';
import TermsPage from './pages/blog/TermsPage';
import { MoviePremiumFicha } from './pages/blog/MoviePremiumFicha';
import { SmartAppBanner } from './components/blog/SmartAppBanner';

import { useEffect } from 'react';

// Componentes de redirecionamento para rotas canônicas
const RedirectToBlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/blog/artigo/${slug}`} replace />;
};

const RedirectToBlogTag = () => {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  return <Navigate to={`/blog/tag/${tagSlug}`} replace />;
};

// Componente para rolar ao topo a cada troca de rota
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Componente para decidir se mostra o banner baseado na rota
const AppBannerWrapper = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Lista de rotas que pertencem ao "App" (incluindo legadas)
  const isAppRoute = 
    path.startsWith('/app') || 
    path.startsWith('/intro') || 
    path.startsWith('/filters') || 
    path.startsWith('/suggestions') || 
    path.startsWith('/sugestoes') ||
    path === '/Home'; // Algumas vezes o case pode variar
  
  if (isAppRoute) {
    return <SmartAppBanner />;
  }
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProviderWrapper>
        <Router>
          <ScrollToTop />
          <AppBannerWrapper />
          <CookieBanner />
          <Routes>
            {/* Blog Routes */}
            <Route path="/" element={<BlogLayout><BlogHome /></BlogLayout>} />
            <Route path="/categorias" element={<BlogLayout><CategoriesPage /></BlogLayout>} />
            <Route path="/categoria/:categorySlug" element={<BlogLayout><CategoryPage /></BlogLayout>} />
            <Route path="/sobre" element={<BlogLayout><AboutPage /></BlogLayout>} />
            <Route path="/contato" element={<BlogLayout><ContactPage /></BlogLayout>} />
            <Route path="/privacidade" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/cookies" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/termos" element={<BlogLayout><TermsPage /></BlogLayout>} />
            
            {/* Canonical Blog Article & Tag Routes */}
            <Route path="/blog/artigo/:slug" element={<BlogLayout><ArticlePage /></BlogLayout>} />
            <Route path="/blog/tag/:tagSlug" element={<BlogLayout><TagPage /></BlogLayout>} />

            {/* Redirecionamentos para rotas canônicas de artigos */}
            <Route path="/artigo/:slug" element={<RedirectToBlogArticle />} />
            <Route path="/analise/:slug" element={<RedirectToBlogArticle />} />
            <Route path="/lista/:slug" element={<RedirectToBlogArticle />} />
            <Route path="/blog/analise/:slug" element={<RedirectToBlogArticle />} />
            <Route path="/blog/lista/:slug" element={<RedirectToBlogArticle />} />
            <Route path="/tag/:tagSlug" element={<RedirectToBlogTag />} />

            {/* Filme & Landing Pages */}
            <Route path="/filme/:slug" element={<BlogLayout><MoviePremiumFicha /></BlogLayout>} />
            <Route path="/onde-assistir/:identifier" element={<MovieDetailWrapper />} />
            <Route path="/onde-assistir-mobile/:identifier" element={<MovieDetailWrapper />} />
            
            {/* Hub Landing (link-in-bio) */}
            <Route path="/hub" element={<HubLanding />} />
            
            {/* App Routes */}
            <Route path="/app" element={<Home />} />
            <Route path="/app/intro" element={<JourneyIntro />} />
            <Route path="/app/filters" element={<StreamingFilters />} />
            <Route path="/app/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/app/suggestions" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/app/onde-assistir/:identifier" element={<MovieDetailWrapper />} />
            <Route path="/app/onde-assistir-mobile/:identifier" element={<MovieDetailWrapper />} />
            
            {/* Legacy redirects for old routes */}
            <Route path="/blog" element={<BlogLayout><BlogHome /></BlogLayout>} />
            <Route path="/blog/categorias" element={<BlogLayout><CategoriesPage /></BlogLayout>} />
            <Route path="/blog/categoria/:categorySlug" element={<BlogLayout><CategoryPage /></BlogLayout>} />
            <Route path="/blog/sobre" element={<BlogLayout><AboutPage /></BlogLayout>} />
            <Route path="/blog/contato" element={<BlogLayout><ContactPage /></BlogLayout>} />
            <Route path="/blog/privacidade" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/blog/cookies" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/blog/termos" element={<BlogLayout><TermsPage /></BlogLayout>} />
            
            {/* Legacy app routes */}
            <Route path="/intro" element={<JourneyIntro />} />
            <Route path="/filters" element={<StreamingFilters />} />
            <Route path="/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/suggestions" element={<MovieSuggestionsPageMinimal />} />
          </Routes>
        </Router>
      </ThemeProviderWrapper>
    </HelmetProvider>
  );
}

export default App;
