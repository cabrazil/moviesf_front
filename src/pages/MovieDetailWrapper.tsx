import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const MovieDetailWrapper: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();

  if (!identifier) {
    return <Navigate to="/" replace />;
  }

  // Redirecionamento permanente para a Ficha Premium unificada
  return <Navigate to={`/filme/${identifier}`} replace />;
};

export default MovieDetailWrapper;
