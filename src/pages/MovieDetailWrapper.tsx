import React from 'react';
import { useParams } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';
import { MovieDetail } from './landing/MovieDetail';

const MovieDetailWrapper: React.FC = () => {
  const { identifier } = useParams();

  // Detectar se é UUID ou slug
  const isUUID = identifier && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  
  // Debug: Verificar o identifier e se é UUID
  console.log('🎬 MovieDetailWrapper - identifier:', identifier);
  console.log('🎬 MovieDetailWrapper - isUUID:', isUUID);
  
  // Se for UUID, usar MovieDetailsPage (aplicação principal)
  // Se for slug, usar MovieDetail (landing page)
  if (isUUID) {
    return <MovieDetailsPage />;
  } else {
    // Para slug, usar a Landing Page
    return <MovieDetail slug={identifier} />;
  }
};

export default MovieDetailWrapper;
