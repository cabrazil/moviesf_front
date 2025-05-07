import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { Movie } from '../../types';
import api from '../../services/api';
import MovieEditForm from './MovieEditForm';

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMovie(null);
  };

  const handleSave = async (updatedMovie: Movie) => {
    try {
      await api.put(`/movies/${updatedMovie.id}`, updatedMovie);
      await fetchMovies();
      handleModalClose();
    } catch (error) {
      console.error('Erro ao atualizar filme:', error);
    }
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Movie, b: Movie) => a.title.localeCompare(b.title),
    },
    {
      title: 'Ano',
      dataIndex: 'year',
      key: 'year',
      sorter: (a: Movie, b: Movie) => (a.year || 0) - (b.year || 0),
    },
    {
      title: 'Diretor',
      dataIndex: 'director',
      key: 'director',
    },
    {
      title: 'Gêneros',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: string[]) => genres.join(', '),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Movie) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
    (movie.director && movie.director.toLowerCase().includes(searchText.toLowerCase())) ||
    movie.genres.some(genre => genre.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar por título, diretor ou gênero"
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredMovies}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total de ${total} filmes`,
        }}
      />

      <Modal
        title="Editar Filme"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        {selectedMovie && (
          <MovieEditForm
            key={selectedMovie.id}
            movie={selectedMovie}
            onSave={handleSave}
            onCancel={handleModalClose}
          />
        )}
      </Modal>
    </div>
  );
};

export default MoviesList; 