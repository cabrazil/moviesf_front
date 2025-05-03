import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Home from './pages/Home';
import JourneyIntro from './components/JourneyIntro';
import MovieJourney from './components/MovieJourney';
import MovieList from './pages/admin/MovieList';
import MainSentimentList from './pages/admin/MainSentimentList';
import JourneyFlowList from './pages/admin/JourneyFlowList';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<JourneyIntro />} />
          <Route path="/journey" element={<MovieJourney />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="movies" element={<MovieList />} />
            <Route path="main-sentiments" element={<MainSentimentList />} />
            <Route path="journey-flows" element={<JourneyFlowList />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
