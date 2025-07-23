import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import Home from './pages/Home';
import JourneyIntro from './components/JourneyIntro';
import MovieJourneyWrapper from './components/MovieJourneyWrapper';
import MovieSuggestionsPage from './components/MovieSuggestionsPage';
import MovieSuggestionsPageMinimal from './components/MovieSuggestionsPageMinimal';
import MovieListPage from './pages/admin/MovieList';
import MainSentimentList from './pages/admin/MainSentimentList';
import JourneyFlowList from './pages/admin/JourneyFlowList';
import JourneyOptionFlowDetails from './pages/admin/JourneyOptionFlowDetails';
import AdminLayout from './components/AdminLayout';
import MovieJourneyTrackerPage from './pages/admin/MovieJourneyTrackerPage';

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
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="movies" element={<MovieListPage />} />
            <Route path="main-sentiments" element={<MainSentimentList />} />
            <Route path="journey-flows" element={<JourneyFlowList />} />
            <Route path="journey-option-flows" element={<JourneyOptionFlowDetails />} />
            <Route path="journey-option-flows/:id" element={<JourneyOptionFlowDetails />} />
            <Route path="movie-journeys" element={<MovieJourneyTrackerPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
