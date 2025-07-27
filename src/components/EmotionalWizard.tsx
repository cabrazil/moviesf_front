import { useState, useEffect } from 'react';
import { getEmotionalFlow, getMovieSuggestions } from '../services/api';
import { JourneyFlow } from '../services/api';
import { MovieSuggestion } from '../types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export const EmotionalWizard = () => {
  const [flow, setFlow] = useState<JourneyFlow | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlow();
  }, []);

  const loadFlow = async (newPath?: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const currentPath = newPath?.join(',');
      const response = await getEmotionalFlow(currentPath);
      setFlow(response);

      if (response.isComplete) {
        const suggestions = await getMovieSuggestions(response.emotionalStateId!, newPath || []);
        setSuggestions(suggestions);
      }
    } catch (err) {
      setError('Erro ao carregar o fluxo. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (optionText: string) => {
    const newPath = [...path, optionText];
    setPath(newPath);
    loadFlow(newPath);
  };

  const handleBack = () => {
    const newPath = path.slice(0, -1);
    setPath(newPath);
    loadFlow(newPath);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => loadFlow()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!flow) return null;

  if (flow.isComplete && suggestions.length > 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">Filmes Sugeridos para Você</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.movie.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{suggestion.movie.title}</h3>
              <p className="text-gray-600 mb-2">{suggestion.movie.description}</p>
              <p className="text-sm text-gray-500">
                {suggestion.movie.year} • {suggestion.movie.director}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestion.movie.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-gray-700 italic">{suggestion.reason}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {path.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Voltar
        </button>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">{flow.currentQuestion}</h2>
        <div className="flex flex-col gap-4">
          {flow.options?.map((option: any) => (
            <button
              key={option.text}
              onClick={() => handleOptionClick(option.text)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 