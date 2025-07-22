import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import DataViewer from './pages/admin/DataViewer';
import AdminLayout from './pages/admin/AdminLayout';
import MovieJourneyTrackerPage from './pages/admin/MovieJourneyTrackerPage';

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
        path: '/admin',
        element: <AdminLayout />,
        children: [
      {
            path: 'data',
        element: <DataViewer />,
          },
          {
            path: 'movie-journeys',
            element: <MovieJourneyTrackerPage />,
          },
        ],
      },
    ],
  },
]); 