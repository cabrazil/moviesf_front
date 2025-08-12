import React from 'react';
import { useParams } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';
import { MovieDetail } from './landing/MovieDetail';

const MovieDetailWrapper: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  
  // Detectar se é um UUID (da aplicação principal) ou slug (da landing page)
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const movieIdentifier = id || slug;
  
  if (movieIdentifier && isUUID(movieIdentifier)) {
    // Se é UUID, usar a página da aplicação principal
    return <MovieDetailsPage />;
  } else {
    // Se é slug, usar a página da landing page
    return <MovieDetail slug={movieIdentifier} />;
  }
};

export default MovieDetailWrapper;
