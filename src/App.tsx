import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Home from './pages/Home';
import MovieJourney from './pages/MovieJourney';
import AdminLayout from './components/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import MovieList from './pages/admin/MovieList';
import MovieForm from './pages/admin/MovieForm';
import EmotionalStateList from './pages/admin/EmotionalStateList';
import EmotionalStateForm from './pages/admin/EmotionalStateForm';
import Admin from './pages/Admin';
import DataViewer from './pages/admin/DataViewer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<MovieJourney />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="movies" element={<MovieList />} />
              <Route path="movies/:id" element={<MovieForm />} />
              <Route path="movies/new" element={<MovieForm />} />
              <Route path="emotional-states" element={<EmotionalStateList />} />
              <Route path="emotional-states/:id" element={<EmotionalStateForm />} />
              <Route path="emotional-states/new" element={<EmotionalStateForm />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/data" element={<DataViewer />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
