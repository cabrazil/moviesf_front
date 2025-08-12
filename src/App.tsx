import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import Home from './pages/Home';
import JourneyIntro from './pages/JourneyIntro';
import MovieSuggestionsPage from './pages/MovieSuggestionsPage';
import MovieSuggestionsPageMinimal from './pages/MovieSuggestionsPageMinimal';

import StreamingFilters from './pages/StreamingFilters';
import MovieDetailWrapper from './pages/MovieDetailWrapper';


function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<JourneyIntro />} />
          <Route path="/filters" element={<StreamingFilters />} />
          <Route path="/sugestoes" element={<MovieSuggestionsPage />} />
          <Route path="/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
          <Route path="/suggestions" element={<MovieSuggestionsPageMinimal />} />
          <Route path="/filme/:id" element={<MovieDetailWrapper />} />
          <Route path="/filme/:slug" element={<MovieDetailWrapper />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
