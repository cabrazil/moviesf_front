import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {

  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          {/* Theme Toggle */}
          <button
            onClick={() => {/* TODO: Implementar toggle de tema */}}
            className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            title="Alternar tema"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
};
