import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'

export function Header() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/moviesf-logo.png"
              alt="emoFilms Logo"
              className="h-6 w-auto mr-2"
            />
            <span className="text-xl font-semibold text-gray-900">
              emoFilms
            </span>
          </Link>

          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`
                inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${!isAdminPage
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              <Home className="h-3 w-3 mr-1" />
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 