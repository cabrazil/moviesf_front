import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Film, Target, Route, ArrowRight, Star, X } from 'lucide-react';
import { getMovieJourneys, getMovies, MovieJourneysResponse } from '../../services/api';
import { Movie } from '../../types';

interface MovieJourneyTrackerProps {}

const MovieJourneyTracker: React.FC<MovieJourneyTrackerProps> = () => {
  const [movieSearch, setMovieSearch] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [journeyData, setJourneyData] = useState<MovieJourneysResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [expandedJourneys, setExpandedJourneys] = useState<Set<number>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  // Função para limpar a pesquisa
  const handleClearSearch = () => {
    setMovieSearch('');
    setMovies([]);
    setSelectedMovie(null);
    setJourneyData(null);
    setExpandedJourneys(new Set());
    setExpandedSteps(new Set());
  };

  // Buscar filmes conforme o usuário digita
  const handleMovieSearch = async (searchTerm: string) => {
    setMovieSearch(searchTerm);
    if (searchTerm.length >= 2) {
      setSearchLoading(true);
      try {
        const allMovies = await getMovies();
        const filtered = allMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMovies(filtered.slice(0, 10)); // Limitar a 10 resultados
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setMovies([]);
    }
  };

  // Selecionar filme e buscar suas jornadas
  const handleMovieSelect = async (movie: Movie) => {
    setSelectedMovie(movie);
    setMovieSearch(movie.title);
    setMovies([]);
    setLoading(true);
    
    try {
      const data = await getMovieJourneys(movie.id);
      setJourneyData(data);
      
      // Debug log para verificar dados recebidos
      console.log(`🎬 Frontend - Dados recebidos para: ${movie.title}`);
      console.log(`📊 Jornadas encontradas: ${data.journeys.length}`);
      data.journeys.forEach((journey, index) => {
        console.log(`\n🎭 Jornada ${index + 1}:`);
        console.log(`  Sentimento: ${journey.mainSentiment.name}`);
        console.log(`  Tipo: ${journey.journeyType}`);
        console.log(`  Steps: ${journey.fullPath.length}`);
        
        journey.fullPath.forEach((step, stepIndex) => {
          const movieOptions = step.options.filter(opt => opt.hasMovieSuggestion);
          if (movieOptions.length > 0) {
            console.log(`    📍 Step ${stepIndex + 1}: "${step.question}"`);
            movieOptions.forEach(opt => {
              console.log(`      ⭐ Opção que leva ao filme: "${opt.text}"`);
            });
          }
        });
      });
      
      // Expandir a primeira jornada por padrão
      if (data.journeys.length > 0) {
        const firstJourneyId = data.journeys[0].journeyFlow?.id || data.journeys[0].emotionalIntention?.id || 0;
        setExpandedJourneys(new Set([firstJourneyId]));
      }
    } catch (error) {
      console.error('Erro ao buscar jornadas:', error);
      setJourneyData(null);
    } finally {
      setLoading(false);
    }
  };

  // Toggle de expansão das jornadas
  const toggleJourneyExpansion = (journeyId: number) => {
    const newExpanded = new Set(expandedJourneys);
    if (newExpanded.has(journeyId)) {
      newExpanded.delete(journeyId);
    } else {
      newExpanded.add(journeyId);
    }
    setExpandedJourneys(newExpanded);
  };

  // Toggle de expansão dos steps
  const toggleStepExpansion = (stepKey: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepKey)) {
      newExpanded.delete(stepKey);
    } else {
      newExpanded.add(stepKey);
    }
    setExpandedSteps(newExpanded);
  };

  // Função para obter a cor da intenção emocional
  const getIntentionColor = (type: string) => {
    switch (type) {
      case 'PROCESS': return 'bg-blue-100 text-blue-800';
      case 'TRANSFORM': return 'bg-purple-100 text-purple-800';
      case 'MAINTAIN': return 'bg-green-100 text-green-800';
      case 'EXPLORE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentionLabel = (type: string) => {
    switch (type) {
      case 'PROCESS': return 'Processar';
      case 'TRANSFORM': return 'Transformar';
      case 'MAINTAIN': return 'Manter';
      case 'EXPLORE': return 'Explorar';
      default: return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Route className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Jornadas do Filme
            </h2>
          </div>
          <p className="text-gray-600">
            Visualize todas as jornadas emocionais que levam a um filme específico
          </p>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={movieSearch}
                onChange={(e) => handleMovieSearch(e.target.value)}
                placeholder="Digite o nome do filme para rastrear suas jornadas..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            
            {/* Botão Limpar */}
            {(selectedMovie || movieSearch) && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition-colors duration-200 flex items-center gap-2"
                title="Limpar pesquisa"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Limpar</span>
              </button>
            )}
          </div>

          {/* Search Results */}
          {movies.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Film className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{movie.title}</div>
                      <div className="text-sm text-gray-500">
                        {movie.year} • {movie.director}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando jornadas do filme...</p>
          </div>
        )}

        {journeyData && !loading && (
          <div className="p-6">
            {/* Movie Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-4">
                {journeyData.movie.thumbnail && (
                  <img
                    src={journeyData.movie.thumbnail}
                    alt={journeyData.movie.title}
                    className="object-cover rounded-md"
                    style={{ width: '80px', height: '120px', minWidth: '80px', maxWidth: '80px' }}
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {journeyData.movie.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {journeyData.movie.year} • {journeyData.movie.director}
                  </p>
                  {journeyData.movie.description && (
                    <p className="text-sm text-gray-700 mb-2">
                      {journeyData.movie.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <Target className="h-4 w-4" />
                    {journeyData.totalJourneys} jornada(s) encontrada(s)
                  </div>
                </div>
              </div>
            </div>

            {/* Journeys */}
            {journeyData.journeys.map((journey, journeyIndex) => (
              <div key={journey.journeyFlow?.id || journey.emotionalIntention?.id || journeyIndex} className="mb-6 border border-gray-200 rounded-lg">
                {/* Journey Header */}
                                  <button
                    onClick={() => toggleJourneyExpansion(journey.journeyFlow?.id || journey.emotionalIntention?.id || 0)}
                    className="w-full p-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-t-lg"
                  >
                                          <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedJourneys.has(journey.journeyFlow?.id || journey.emotionalIntention?.id || 0) ? (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Jornada #{journeyIndex + 1}: {journey.mainSentiment.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {journey.mainSentiment.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {journey.emotionalIntention && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentionColor(journey.emotionalIntention.type)}`}
                        >
                          {getIntentionLabel(journey.emotionalIntention.type)}
                        </span>
                      )}
                      {journey.journeyType === 'traditional' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Tradicional
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Journey Details */}
                {expandedJourneys.has(journey.journeyFlow?.id || journey.emotionalIntention?.id || 0) && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="space-y-4">
                      {journey.fullPath.map((step, stepIndex) => {
                        const stepKey = `${journey.journeyFlow?.id || journey.emotionalIntention?.id || 0}-${step.id}`;
                        const hasMovieOptions = step.options.some(opt => opt.hasMovieSuggestion);
                        const isVirtual = step.isVirtual || false;
                        
                        return (
                          <div key={`${step.id}-${stepIndex}`} className={`border rounded-lg ${isVirtual ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
                            <button
                              onClick={() => toggleStepExpansion(stepKey)}
                              className="w-full p-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded-t-lg"
                            >
                              <div className="flex items-center gap-3">
                                {expandedSteps.has(stepKey) ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${isVirtual ? 'text-blue-700' : 'text-blue-600'}`}>
                                      Step {step.order + 1}
                                      {isVirtual && <span className="ml-1 text-xs">(Sistema)</span>}
                                    </span>
                                    {hasMovieOptions && (
                                      <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                                    )}
                                    {step.isRequired && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        Obrigatório
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm font-medium ${isVirtual ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {step.question}
                                  </p>
                                  {step.contextualHint && (
                                    <p className="text-xs text-gray-600 italic mt-1">
                                      💡 {step.contextualHint}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>

                            {expandedSteps.has(stepKey) && (
                              <div className="border-t border-gray-100 p-3">
                                <div className="space-y-2">
                                  {/* Filtrar apenas opções que levam ao filme ou steps virtuais */}
                                  {step.options
                                    .filter(option => option.hasMovieSuggestion || isVirtual)
                                    .length > 0 ? (
                                    step.options
                                      .filter(option => option.hasMovieSuggestion || isVirtual)
                                      .map((option) => (
                                      <div
                                        key={option.id}
                                        className={`p-2 rounded-md border ${
                                          option.hasMovieSuggestion
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                        }`}
                                      >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-900">
                                          {option.text}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {option.hasMovieSuggestion && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                              Sugere este filme
                                            </span>
                                          )}
                                          {option.nextStepId && !option.isEndState && (
                                            <ArrowRight className="h-3 w-3 text-gray-400" />
                                          )}
                                          {option.isEndState && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                              Estado Final
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Mostrar informações da sugestão se esta opção leva ao filme */}
                                      {option.hasMovieSuggestion && (
                                        <div className="mt-2 p-2 bg-white rounded border">
                                          {journey.paths
                                            .filter(path => path.option.id === option.id)
                                            .map((path, pathIndex) => (
                                              <div key={pathIndex} className="text-xs text-gray-600">
                                                <strong>Motivo:</strong> {path.suggestion.reason}
                                                <br />
                                                <strong>Relevância:</strong> {path.suggestion.relevance}/10
                                              </div>
                                            ))}
                                          {/* Se não há paths específicos, mas a opção tem sugestão, mostrar informação genérica */}
                                          {journey.paths.filter(path => path.option.id === option.id).length === 0 && (
                                            <div className="text-xs text-gray-600">
                                              <strong>✅ Esta opção leva ao filme:</strong> {journeyData?.movie.title}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                  ) : (
                                    <div className="p-2 text-sm text-gray-500 italic text-center">
                                      Este step não contém opções que levam ao filme pesquisado
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {journeyData.journeys.length === 0 && (
              <div className="text-center py-8">
                <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma jornada encontrada
                </h3>
                <p className="text-gray-600">
                  Este filme ainda não foi adicionado a nenhuma jornada emocional.
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedMovie && !loading && (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pesquise um filme
            </h3>
            <p className="text-gray-600">
              Digite o nome de um filme para visualizar todas as jornadas que levam até ele.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieJourneyTracker; 