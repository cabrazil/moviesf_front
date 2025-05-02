import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminList from '../../components/admin/AdminList';
import { Movie, getMovies, deleteMovie } from '../../services/api';

const MovieList = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/movies/${id}`);
  };

  const handleAdd = () => {
    navigate('/admin/movies/new');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await deleteMovie(id);
        await loadMovies();
      } catch (error) {
        console.error('Erro ao excluir filme:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AdminList title="Filmes" onAdd={handleAdd}>
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Título
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ano
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Diretor
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Gêneros
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {movies.map((movie) => (
          <tr key={movie.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{movie.title}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{movie.year}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{movie.director}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{movie.genres.join(', ')}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleEdit(movie.id)}
                className="text-blue-600 hover:text-blue-900 mr-4"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(movie.id)}
                className="text-red-600 hover:text-red-900"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </AdminList>
  );
};

export default MovieList; 