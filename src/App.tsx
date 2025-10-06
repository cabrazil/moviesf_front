import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
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


function App() {
  return (
    <HelmetProvider>
      <ThemeProviderWrapper>
        <Router>
          <Routes>
            {/* App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/intro" element={<JourneyIntro />} />
            <Route path="/filters" element={<StreamingFilters />} />
            <Route path="/sugestoes" element={<MovieSuggestionsPage />} />
            <Route path="/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/suggestions" element={<MovieSuggestionsPageMinimal />} />
            <Route path="/filme/:identifier" element={<MovieDetailWrapper />} />
            <Route path="/filme-mobile/:identifier" element={<MovieDetailMobile />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogLayout><BlogHome /></BlogLayout>} />
            <Route path="/blog/categorias" element={<BlogLayout><CategoriesPage /></BlogLayout>} />
            <Route path="/blog/categoria/:categorySlug" element={<BlogLayout><CategoryPage /></BlogLayout>} />
            <Route path="/blog/sobre" element={<BlogLayout><AboutPage /></BlogLayout>} />
            <Route path="/blog/contato" element={<BlogLayout><ContactPage /></BlogLayout>} />
            <Route path="/blog/privacidade" element={<BlogLayout><PrivacyPage /></BlogLayout>} />
            <Route path="/blog/artigo/:slug" element={<BlogLayout><ArticlePage /></BlogLayout>} />
            <Route path="/blog/tag/:tagSlug" element={<BlogLayout><TagPage /></BlogLayout>} />
          </Routes>
        </Router>
      </ThemeProviderWrapper>
    </HelmetProvider>
  );
}

export default App;
