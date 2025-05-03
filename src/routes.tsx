import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import DataViewer from './pages/admin/DataViewer';
import MovieJourney from './components/MovieJourney';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/journey',
        element: <MovieJourney />,
      },
      {
        path: '/admin/data',
        element: <DataViewer />,
      },
    ],
  },
]); 