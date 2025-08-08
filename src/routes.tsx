import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import StreamingFilters from './pages/StreamingFilters';

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
        path: '/filters',
        element: <StreamingFilters />,
      },
    ],
  },
]); 