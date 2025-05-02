import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainSentiment, getMainSentiments } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSentiments = async () => {
      try {
        await getMainSentiments();
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar sentimentos:', error);
        setError('Erro ao carregar os sentimentos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadSentiments();
  }, []);

  const handleStart = () => {
    navigate('/journey');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">MovieSF</h1>
        <p className="text-gray-600 mb-8">
          Descubra filmes perfeitos para o seu momento atual. Conte-nos como você está se sentindo e nós sugeriremos filmes que combinam com seu estado emocional.
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors mb-4"
        >
          Vamos começar
        </button>
        <button
          onClick={handleAdmin}
          className="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          Área Admin
        </button>
      </div>
    </div>
  );
};

export default Home; 