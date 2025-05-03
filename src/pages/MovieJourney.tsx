import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JourneyStep from '../components/JourneyStep';
import MovieResults from '../components/MovieResults';
import { 
  MainSentiment, 
  getMainSentiments, 
  getEmotionalStates,
  getMovieSuggestionsByEmotionalState,
  getMovie,
  EmotionalState,
  JourneyStep as JourneyStepType,
  JourneyOption,
  MovieSuggestion,
  Movie
} from '../services/api';

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    description?: string;
    isEndState?: boolean;
  }[];
};

const MovieJourney = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([]);
  const [selectedMainSentiment, setSelectedMainSentiment] = useState<MainSentiment | null>(null);
  const [selectedEmotionalState, setSelectedEmotionalState] = useState<EmotionalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Question[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [sentimentsData, statesData] = await Promise.all([
          getMainSentiments(),
          getEmotionalStates()
        ]);
        setMainSentiments(sentimentsData);
        setEmotionalStates(statesData);
        // Inicializa as etapas base
        setSteps([{
          id: 'main-sentiment',
          text: 'Como você está se sentindo principalmente agora?',
          options: sentimentsData.map(sentiment => ({
            id: sentiment.id.toString(),
            text: sentiment.name,
            description: sentiment.description || undefined
          }))
        }]);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleOptionSelect = async (option: Question['options'][0]) => {
    const newSelectedOptions = { ...selectedOptions, [currentStep]: option };
    setSelectedOptions(newSelectedOptions);

    if (currentStep === 0) {
      // Primeiro passo: seleção do sentimento principal
      const selectedSentiment = mainSentiments.find(s => s.id.toString() === option.id);
      if (selectedSentiment) {
        setSelectedMainSentiment(selectedSentiment);
        const relatedStates = emotionalStates.filter(state => state.mainSentimentId === selectedSentiment.id);
        setSteps([
      {
        id: 'main-sentiment',
        text: 'Como você está se sentindo principalmente agora?',
            options: mainSentiments.map(sentiment => ({
              id: sentiment.id.toString(),
              text: sentiment.name,
              description: sentiment.description || undefined
            }))
          },
          {
            id: 'emotional-state',
            text: 'Entendo. Nesses momentos, você geralmente prefere um filme que...',
            options: relatedStates.map(state => ({
              id: state.id.toString(),
              text: state.name,
              description: state.description || undefined
            }))
          }
        ]);
        setCurrentPath([option.id]);
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      // Segundo passo: seleção do estado emocional
      const selectedState = emotionalStates.find(s => s.id.toString() === option.id);
      if (selectedState) {
        setSelectedEmotionalState(selectedState);
        // Ordena os passos da jornada pelo campo 'order'
        const orderedSteps = [...selectedState.journeySteps].sort((a, b) => a.order - b.order);
        const firstJourneyStep = orderedSteps[0];
        
        if (firstJourneyStep) {
          setSteps(prevSteps => [
            ...prevSteps,
            {
              id: firstJourneyStep.id.toString(),
              text: firstJourneyStep.question,
              options: firstJourneyStep.options.map(opt => ({
                id: opt.id.toString(),
                text: opt.text,
                description: opt.isEndState ? 'Leva a sugestões de filmes' : undefined,
                isEndState: opt.isEndState
              }))
            }
          ]);
          setCurrentPath(prev => [...prev, option.id]);
          setCurrentStep(2);
        }
      }
    } else {
      // Passos subsequentes da jornada
      const currentJourneyStep = selectedEmotionalState?.journeySteps.find(
        step => step.id.toString() === steps[currentStep].id
      );
      
      if (currentJourneyStep) {
        const selectedOption = currentJourneyStep.options.find(
          opt => opt.id.toString() === option.id
        );

        if (selectedOption?.isEndState) {
          // Se chegamos a um estado final, buscar sugestões de filmes
          try {
            const suggestions = await getMovieSuggestionsByEmotionalState(
              selectedEmotionalState!.id,
              [...currentPath, option.id]
            );
            // Converter MovieSuggestion[] para Movie[]
            const movies = suggestions.map(suggestion => suggestion.movie);
            setSuggestedMovies(movies);
            setShowResults(true);
          } catch (error) {
            console.error('Erro ao buscar sugestões de filmes:', error);
          }
        } else if (selectedOption?.nextStepId) {
          // Se há próximo passo, carregá-lo
          const nextStep = selectedEmotionalState!.journeySteps.find(
            step => step.id === selectedOption.nextStepId
          );
          
          if (nextStep) {
            setSteps(prevSteps => [
              ...prevSteps,
              {
                id: nextStep.id.toString(),
                text: nextStep.question,
                options: nextStep.options.map(opt => ({
                  id: opt.id.toString(),
                  text: opt.text,
                  description: opt.isEndState ? 'Leva a sugestões de filmes' : undefined,
                  isEndState: opt.isEndState
                }))
              }
            ]);
            setCurrentPath(prev => [...prev, option.id]);
            setCurrentStep(prev => prev + 1);
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === 1) {
        setSelectedMainSentiment(null);
      }
    } else {
      navigate('/');
    }
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

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <MovieResults
          movies={suggestedMovies}
          onBack={handleBack}
        />
      </div>
    );
  }

  const currentStepData = steps[currentStep] || steps[0];

  const getCurrentOptions = () => {
    if (currentStep === 0) {
      return mainSentiments.map(sentiment => ({
        id: sentiment.id.toString(),
        text: sentiment.name,
        description: sentiment.description || undefined
      }));
    } else {
      return currentStepData?.options || [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <JourneyStep
          question={currentStepData?.text || ''}
          options={getCurrentOptions()}
          onSelect={handleOptionSelect}
          selectedOption={selectedOptions[currentStep]}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Voltar
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieJourney; 