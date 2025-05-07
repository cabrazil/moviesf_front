import React from 'react';
import { Typography } from 'antd';
import MoviesList from '../../components/admin/MoviesList';

const { Title } = Typography;

const MovieListPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Gerenciamento de Filmes</Title>
      <MoviesList />
    </div>
  );
};

export default MovieListPage; 