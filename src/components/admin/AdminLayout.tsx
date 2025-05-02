import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900">Área Administrativa</h1>
          </div>
          <nav className="mt-4">
            <Link
              to="/admin"
              className={`flex items-center px-4 py-2 ${isActive('/admin')}`}
            >
              <span className="ml-3">Dashboard</span>
            </Link>
            <Link
              to="/admin/movies"
              className={`flex items-center px-4 py-2 ${isActive('/admin/movies')}`}
            >
              <span className="ml-3">Filmes</span>
            </Link>
            <Link
              to="/admin/emotional-states"
              className={`flex items-center px-4 py-2 ${isActive('/admin/emotional-states')}`}
            >
              <span className="ml-3">Estados Emocionais</span>
            </Link>
            <Link
              to="/admin/movie-suggestions"
              className={`flex items-center px-4 py-2 ${isActive('/admin/movie-suggestions')}`}
            >
              <span className="ml-3">Sugestões de Filmes</span>
            </Link>
            <Link
              to="/admin/movie-sentiments"
              className={`flex items-center px-4 py-2 ${isActive('/admin/movie-sentiments')}`}
            >
              <span className="ml-3">Sentimentos de Filmes</span>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 