import { useState } from 'react';

type Movie = {
  id: string;
  title: string;
  year?: number;
  director?: string;
  description?: string;
  genres: string[];
  streamingPlatforms: string[];
  runtime?: number;
};

type MovieResultsProps = {
  movies: Movie[];
  onBack: () => void;
};

const MovieResults = ({ movies, onBack }: MovieResultsProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Filmes Recomendados
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedMovie?.id === movie.id
                ? 'ring-2 ring-blue-500 scale-105'
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedMovie(movie)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {movie.title}
                {movie.year && <span className="text-gray-500 ml-2">({movie.year})</span>}
              </h3>
              
              {movie.director && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Diretor:</span> {movie.director}
                </p>
              )}
              
              {movie.description && (
                <p className="text-gray-700 mb-4">{movie.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {movie.streamingPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nova Busca
        </button>
      </div>
    </div>
  );
};

export default MovieResults; 