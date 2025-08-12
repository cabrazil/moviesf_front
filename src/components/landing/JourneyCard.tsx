import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, Users } from 'lucide-react';

interface JourneyFlow {
  id: number;
  mainSentiment: {
    name: string;
  };
  _count?: {
    steps: number;
  };
}

interface JourneyCardProps {
  journey: JourneyFlow;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({ journey }) => {
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

  const slug = generateSlug(journey.mainSentiment.name);

  const getJourneyDescription = (name: string) => {
    switch (name.toLowerCase()) {
      case 'feliz':
        return 'Mantenha sua energia positiva e espalhe alegria através de filmes inspiradores.';
      case 'triste':
        return 'Processe seus sentimentos e encontre consolo em histórias que ressoam com sua dor.';
      case 'calmo':
        return 'Aproveite a serenidade e explore filmes que promovem paz interior.';
      case 'ansioso':
        return 'Encontre alívio e técnicas de relaxamento através do cinema terapêutico.';
      case 'energético':
        return 'Canalize sua energia em filmes motivacionais e cheios de ação.';
      case 'reflexivo':
        return 'Mergulhe em filmes profundos que estimulam o pensamento filosófico.';
      default:
        return 'Descubra filmes que se conectam com seu estado emocional atual.';
    }
  };

  return (
    <Link to={`/jornadas/${slug}`}>
      <div className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-all duration-300 group cursor-pointer h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Map className="w-6 h-6 text-white" />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>

        <h3 className="text-white font-semibold text-xl mb-3 group-hover:text-purple-300 transition-colors">
          Jornada: {journey.mainSentiment.name}
        </h3>

        <p className="text-gray-300 text-sm mb-6 line-clamp-3">
          {getJourneyDescription(journey.mainSentiment.name)}
        </p>

        <div className="flex items-center justify-between">
          {journey._count && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">
                {journey._count.steps} etapas
              </span>
            </div>
          )}
          <span className="text-gray-400 text-sm">
            Iniciar jornada →
          </span>
        </div>
      </div>
    </Link>
  );
};
