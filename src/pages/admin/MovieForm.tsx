import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminForm from '../../components/admin/AdminForm';
import { getMovie, createMovie, updateMovie } from '../../services/api';
import { Movie } from '../../types';

const MovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState<Partial<Movie>>({
    title: '',
    year: undefined,
    director: '',
    description: '',
    genres: [],
    streamingPlatforms: [],
    runtime: undefined
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadMovie();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadMovie = async () => {
    try {
      const data = await getMovie(id!);
      setMovie(data);
    } catch (error) {
      console.error('Erro ao carregar filme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (id === 'new') {
        await createMovie(movie as Movie);
      } else {
        await updateMovie(id!, movie as Movie);
      }
      navigate('/admin/movies');
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/movies');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie((prev: Partial<Movie>) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovie((prev: Partial<Movie>) => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AdminForm
      title={id === 'new' ? 'Novo Filme' : 'Editar Filme'}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={movie.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Ano
          </label>
          <input
            type="number"
            name="year"
            id="year"
            value={movie.year}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="director" className="block text-sm font-medium text-gray-700">
            Diretor
          </label>
          <input
            type="text"
            name="director"
            id="director"
            value={movie.director}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            name="description"
            id="description"
            value={movie.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="genres" className="block text-sm font-medium text-gray-700">
            Gêneros (separados por vírgula)
          </label>
          <input
            type="text"
            name="genres"
            id="genres"
            value={movie.genres?.join(', ')}
            onChange={handleArrayChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="streamingPlatforms" className="block text-sm font-medium text-gray-700">
            Plataformas de Streaming (separadas por vírgula)
          </label>
          <input
            type="text"
            name="streamingPlatforms"
            id="streamingPlatforms"
            value={movie.streamingPlatforms?.join(', ')}
            onChange={handleArrayChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </AdminForm>
  );
};

export default MovieForm; 