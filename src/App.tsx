import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import { CookieBanner } from './components/CookieBanner';
import Home from './pages/Home';
import JourneyIntro from './pages/JourneyIntro';
import MovieSuggestionsPage from './pages/MovieSuggestionsPage';
import MovieSuggestionsPageMinimal from './pages/MovieSuggestionsPageMinimal';
import StreamingFilters from './pages/StreamingFilters';
import MovieDetailWrapper from './pages/MovieDetailWrapper';
import { MovieDetailMobile } from './pages/landing/MovieDetailMobile';
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


function App() {
  return (
    <HelmetProvider>
      <ThemeProviderWrapper>
        <Router>
          <CookieBanner />
          <Routes>
            {/* Blog Routes (now at root) */}
            <Route path="/" element={<BlogLayout><BlogHome /></BlogLayout>} />
            <Route path="/categorias" element={<BlogLayout><CategoriesPage /></BlogLayout>} />
            <Route path="/categoria/:categorySlug" element={<BlogLayout><CategoryPage /></BlogLayout>} />
            <Route path="/sobre" element={<BlogLayout><AboutPage /></BlogLayout>} />
            <Route path="/contato" element={<BlogLayout><ContactPage /></BlogLayout>} />
            <Route path="/privacidade" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/termos" element={<BlogLayout><TermsPage /></BlogLayout>} />
            <Route path="/artigo/:slug" element={<BlogLayout><ArticlePage /></BlogLayout>} />
            <Route path="/tag/:tagSlug" element={<BlogLayout><TagPage /></BlogLayout>} />
            
            {/* App Routes */}
            <Route path="/app" element={<Home />} />
            <Route path="/app/intro" element={<JourneyIntro />} />
            <Route path="/app/filters" element={<StreamingFilters />} />
            <Route path="/app/sugestoes" element={<MovieSuggestionsPage />} />
            <Route path="/app/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/app/suggestions" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/app/filme/:identifier" element={<MovieDetailWrapper />} />
            <Route path="/app/filme-mobile/:identifier" element={<MovieDetailMobile />} />
            
            {/* Legacy redirects for old routes */}
            <Route path="/blog" element={<BlogLayout><BlogHome /></BlogLayout>} />
            <Route path="/blog/categorias" element={<BlogLayout><CategoriesPage /></BlogLayout>} />
            <Route path="/blog/categoria/:categorySlug" element={<BlogLayout><CategoryPage /></BlogLayout>} />
            <Route path="/blog/sobre" element={<BlogLayout><AboutPage /></BlogLayout>} />
            <Route path="/blog/contato" element={<BlogLayout><ContactPage /></BlogLayout>} />
            <Route path="/blog/privacidade" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/blog/termos" element={<BlogLayout><TermsPage /></BlogLayout>} />
            <Route path="/blog/artigo/:slug" element={<BlogLayout><ArticlePage /></BlogLayout>} />
            <Route path="/blog/tag/:tagSlug" element={<BlogLayout><TagPage /></BlogLayout>} />
            
            {/* Legacy app routes */}
            <Route path="/intro" element={<JourneyIntro />} />
            <Route path="/filters" element={<StreamingFilters />} />
            <Route path="/sugestoes" element={<MovieSuggestionsPage />} />
            <Route path="/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/suggestions" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/filme/:identifier" element={<MovieDetailWrapper />} />
            <Route path="/filme-mobile/:identifier" element={<MovieDetailMobile />} />
          </Routes>
        </Router>
      </ThemeProviderWrapper>
    </HelmetProvider>
  );
}

export default App;
