import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import MovieJourney from './pages/MovieJourney';
import AdminLayout from './components/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import MovieList from './pages/admin/MovieList';
import MovieForm from './pages/admin/MovieForm';
import EmotionalStateList from './pages/admin/EmotionalStateList';
import EmotionalStateForm from './pages/admin/EmotionalStateForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
