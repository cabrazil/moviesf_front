import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

interface MainSentiment {
  id: number;
  name: string;
  description?: string;
  _count?: {
    movieSentiment: number;
  };
}

interface SentimentCardProps {
  sentiment: MainSentiment;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment }) => {
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
  };

  const slug = generateSlug(sentiment.name);

  const getSentimentColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'feliz':
        return 'from-yellow-400 to-orange-500';
      case 'triste':
        return 'from-blue-400 to-purple-500';
      case 'calmo':
        return 'from-green-400 to-teal-500';
      case 'ansioso':
        return 'from-red-400 to-pink-500';
      case 'energético':
        return 'from-orange-400 to-red-500';
      case 'reflexivo':
        return 'from-indigo-400 to-purple-500';
      default:
        return 'from-purple-400 to-pink-500';
    }
  };

  return (
    <Link to={`/sentimentos/${slug}`}>
      <div className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-all duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${getSentimentColor(sentiment.name)} rounded-full flex items-center justify-center`}>
            <Heart className="w-6 h-6 text-white" />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>

        <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-purple-300 transition-colors">
          {sentiment.name}
        </h3>

        {sentiment.description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {sentiment.description}
          </p>
        )}

        {sentiment._count && (
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm font-medium">
              {sentiment._count.movieSentiment} filmes
            </span>
            <span className="text-gray-400 text-sm">
              Descobrir →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
