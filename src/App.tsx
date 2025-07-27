import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import Home from './pages/Home';
import JourneyIntro from './components/JourneyIntro';
import MovieJourneyWrapper from './components/MovieJourneyWrapper';
import MovieSuggestionsPage from './components/MovieSuggestionsPage';
import MovieSuggestionsPageMinimal from './components/MovieSuggestionsPageMinimal';
import MovieDetailsPage from './components/MovieDetailsPage';

function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<JourneyIntro />} />
          <Route path="/journey" element={<MovieJourneyWrapper />} />
          <Route path="/sugestoes" element={<MovieSuggestionsPage />} />
          <Route path="/sugestoes/minimal" element={<MovieSuggestionsPageMinimal />} />
          <Route path="/filme/:id" element={<MovieDetailsPage />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
