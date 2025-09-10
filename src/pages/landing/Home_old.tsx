import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Star, TrendingUp, Users, Film } from 'lucide-react';
import { MovieCard } from '../../components/landing/MovieCard';
import { SentimentCard } from '../../components/landing/SentimentCard';
import { JourneyCard } from '../../components/landing/JourneyCard';
import { Header } from '../../components/landing/Header';
import { Footer } from '../../components/landing/Footer';
import { api } from '../../services/api';

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

interface MainSentiment {
  id: number;
  name: string;
  description?: string;
  _count?: {
    movieSentiment: number;
  };
}

interface JourneyFlow {
  id: number;
  mainSentiment: {
    name: string;
  };
  _count?: {
    steps: number;
  };
}

export const Home: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [featuredJourneys, setFeaturedJourneys] = useState<JourneyFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/public/home');
        setFeaturedMovies(response.data.featuredMovies);
        setMainSentiments(response.data.mainSentiments);
        setFeaturedJourneys(response.data.featuredJourneys);
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Descubra Filmes para
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              {' '}Seu Estado Emocional
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Encontre o filme perfeito para cada momento da sua vida. 
            Nossa análise emocional te ajuda a escolher filmes que ressoam com seus sentimentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Começar Jornada Emocional
            </Link>
            <Link
              to="/filmes"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300"
            >
              Explorar Filmes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Filmes em Destaque
            </h2>
            <p className="text-gray-300 text-lg">
              Selecionados especialmente para diferentes estados emocionais
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Sentiments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Como Você Está Se Sentindo?
            </h2>
            <p className="text-gray-300 text-lg">
              Descubra filmes perfeitos para cada estado emocional
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainSentiments.map((sentiment) => (
              <SentimentCard key={sentiment.id} sentiment={sentiment} />
            ))}
          </div>
        </div>
      </section>

      {/* Journeys Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Jornadas Emocionais
            </h2>
            <p className="text-gray-300 text-lg">
              Transforme seus sentimentos através do cinema
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredJourneys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Film className="w-8 h-8 mr-2" />
                1000+
              </div>
              <p className="text-gray-300">Filmes Analisados</p>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Heart className="w-8 h-8 mr-2" />
                7
              </div>
              <p className="text-gray-300">Estados Emocionais</p>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Users className="w-8 h-8 mr-2" />
                50k+
              </div>
              <p className="text-gray-300">Usuários Satisfeitos</p>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Star className="w-8 h-8 mr-2" />
                4.8
              </div>
              <p className="text-gray-300">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Descobrir Seu Próximo Filme?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de pessoas que já transformaram suas experiências cinematográficas
          </p>
          <Link
            to="/app"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full font-semibold text-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center gap-3"
          >
            <TrendingUp className="w-6 h-6" />
            Começar Agora - É Grátis!
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
