import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year?: number;
  description?: string;
  thumbnail?: string;
  vote_average?: number;
  platforms: Array<{
    streamingPlatform: {
      name: string;
    };
  }>;
  movieSentiments: Array<{
    mainSentiment: {
      name: string;
    };
  }>;
}

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  };

  const slug = generateSlug(movie.title);

  return (
    <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden hover:bg-opacity-20 transition-all duration-300 group">
      {/* Movie Poster */}
      <div className="relative">
        <img
          src={movie.thumbnail || '/images/default-movie.jpg'}
          alt={movie.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/onde-assistir/${slug}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30"
          >
            <Play className="w-6 h-6 text-white" />
          </Link>
        </div>

        {/* Rating */}
        {movie.vote_average && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Streaming Platforms */}
        {movie.platforms.length > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full px-2 py-1">
            <span className="text-white text-xs font-semibold">
              {movie.platforms.length} plataforma{movie.platforms.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <Link to={`/onde-assistir/${slug}`}>
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">
            {movie.title}
            {movie.year && <span className="text-gray-400"> ({movie.year})</span>}
          </h3>
        </Link>

        {/* Description */}
        {movie.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {movie.description}
          </p>
        )}

        {/* Sentiments */}
        {movie.movieSentiments.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {movie.movieSentiments.slice(0, 2).map((sentiment, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-600 bg-opacity-50 text-white text-xs rounded-full"
                >
                  {sentiment.mainSentiment.name}
                </span>
              ))}
              {movie.movieSentiments.length > 2 && (
                <span className="px-2 py-1 bg-gray-600 bg-opacity-50 text-white text-xs rounded-full">
                  +{movie.movieSentiments.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Streaming Info */}
        {movie.platforms.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm font-medium">
                Disponível para streaming
              </span>
            </div>
            <Link
              to={`/onde-assistir/${slug}`}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Ver detalhes
            </Link>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-4">
          <Link
            to={`/onde-assistir/${slug}`}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Descobrir Jornada
          </Link>
        </div>
      </div>
    </div>
  );
};
