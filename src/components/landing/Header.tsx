import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Heart, Download } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar busca
      console.log('Buscar:', searchQuery);
    }
  };

  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">EmoFilms</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/filmes"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Filmes
            </Link>
            <Link
              to="/sentimentos"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sentimentos
            </Link>
            <Link
              to="/jornadas"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Jornadas
            </Link>
            <Link
              to="/como-funciona"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Como Funciona
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar filmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-white bg-opacity-10 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </form>

            <Link
              to="/app"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar App
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black bg-opacity-90 rounded-lg mt-2">
              <Link
                to="/filmes"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Filmes
              </Link>
              <Link
                to="/sentimentos"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sentimentos
              </Link>
              <Link
                to="/jornadas"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Jornadas
              </Link>
              <Link
                to="/como-funciona"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative px-3 py-2">
                <input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white bg-opacity-10 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-6 top-4 w-4 h-4 text-gray-400" />
              </form>

              <Link
                to="/app"
                className="block mx-3 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Download className="w-4 h-4" />
                Baixar App
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
