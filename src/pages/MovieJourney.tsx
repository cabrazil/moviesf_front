import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import JourneyStep from '../components/JourneyStep';
import MovieResults from '../components/MovieResults';
import { MainSentiment, getMainSentiments } from '../services/api';

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    description?: string;
  }[];
};

type Movie = {
  id: string;
  title: string;
  year?: number;
  director?: string;
  description?: string;
  genres: string[];
  streamingPlatforms: string[];
};

const MovieJourney = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [selectedMainSentiment, setSelectedMainSentiment] = useState<MainSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Question[]>([]);

  useEffect(() => {
    const loadSentiments = async () => {
      try {
        const data = await getMainSentiments();
        setMainSentiments(data);
        // Inicializa as etapas base
        setSteps([{
          id: 'main-sentiment',
          text: 'Como você está se sentindo principalmente agora?',
          options: []
        }]);
      } catch (error) {
        console.error('Erro ao carregar sentimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSentiments();
  }, []);

  // Atualiza as etapas quando o sentimento principal muda
  useEffect(() => {
    if (selectedMainSentiment) {
      const newSteps = getJourneySteps();
      setSteps(newSteps);
      // Garante que estamos na primeira etapa após a seleção do sentimento
      setCurrentStep(1);
    }
  }, [selectedMainSentiment]);

  const getJourneySteps = () => {
    console.log('Calculando etapas para:', selectedMainSentiment?.name);
    
    const baseSteps: Question[] = [
      {
        id: 'main-sentiment',
        text: 'Como você está se sentindo principalmente agora?',
        options: []
      }
    ];

    if (selectedMainSentiment?.name.includes('Feliz')) {
      console.log('Retornando etapas para Feliz/Alegre');
      return [
        ...baseSteps,
        {
          id: 'happy-mood',
          text: 'Ótimo! Para manter essa vibe positiva, você gostaria de assistir a um filme que te faça se sentir ainda mais...',
          options: [
            {
              id: '1',
              text: 'Com muitas gargalhadas e um humor contagiante?',
              description: 'Filmes que te façam rir muito'
            },
            {
              id: '2',
              text: 'Com um calor no coração e uma sensação adorável?',
              description: 'Histórias que aquecem o coração'
            },
            {
              id: '3',
              text: 'Empolgado(a) e cheio(a) de energia?',
              description: 'Filmes que te deixam animado'
            },
            {
              id: '4',
              text: 'Com aquela nostalgia gostosa de boas lembranças?',
              description: 'Filmes que trazem boas memórias'
            }
          ]
        },
        {
          id: 'comedy-style',
          text: 'Que tal...',
          options: [
            {
              id: '1',
              text: 'Escancarado e físico (pastelão, situações absurdas)?',
              description: 'Comédias com situações hilárias'
            },
            {
              id: '2',
              text: 'Inteligente e com diálogos afiados?',
              description: 'Comédias com humor refinado'
            },
            {
              id: '3',
              text: 'Satírico e que faz pensar enquanto diverte?',
              description: 'Comédias com crítica social'
            },
            {
              id: '4',
              text: 'Comédia romântica leve e divertida?',
              description: 'Histórias de amor com muito humor'
            }
          ]
        }
      ];
    } else if (selectedMainSentiment?.name.includes('Triste')) {
      console.log('Retornando etapas para Triste/Melancólico');
      return [
        ...baseSteps,
        {
          id: 'movie-preference',
          text: 'Entendo. Nesses momentos, você geralmente prefere um filme que...',
          options: [
            {
              id: '1',
              text: 'Me permita sentir essas emoções (uma catarse)?',
              description: 'Um filme que te permita viver e processar suas emoções'
            },
            {
              id: '2',
              text: 'Me ofereça um escape leve e divertido?',
              description: 'Algo que te distraia e traga leveza'
            },
            {
              id: '3',
              text: 'Me traga conforto e um senso de segurança?',
              description: 'Histórias reconfortantes e acolhedoras'
            },
            {
              id: '4',
              text: 'Me faça refletir sobre a vida e talvez encontrar algum significado?',
              description: 'Filmes que te façam pensar e encontrar insights'
            }
          ]
        },
        {
          id: 'movie-style',
          text: 'Que tal...',
          options: [
            {
              id: '1',
              text: 'Um drama profundo e tocante?',
              description: 'Histórias que mexem com as emoções'
            },
            {
              id: '2',
              text: 'Um romance melancólico e contemplativo?',
              description: 'Histórias de amor com profundidade emocional'
            },
            {
              id: '3',
              text: 'Uma história de superação em meio à adversidade?',
              description: 'Jornadas inspiradoras de superação'
            }
          ]
        }
      ];
    }

    console.log('Retornando etapas base');
    return baseSteps;
  };

  const getNextStepOptions = (currentStep: number, selectedOption: any) => {
    if (selectedMainSentiment?.name === 'Feliz / Alegre') {
      if (currentStep === 1) {
        if (selectedOption.text.includes('gargalhadas')) {
          return {
            id: 'comedy-style',
            text: 'Que tal...',
            options: [
              {
                id: '1',
                text: 'Escancarado e físico (pastelão, situações absurdas)?',
                description: 'Comédias com situações hilárias'
              },
              {
                id: '2',
                text: 'Inteligente e com diálogos afiados?',
                description: 'Comédias com humor refinado'
              },
              {
                id: '3',
                text: 'Satírico e que faz pensar enquanto diverte?',
                description: 'Comédias com crítica social'
              },
              {
                id: '4',
                text: 'Comédia romântica leve e divertida?',
                description: 'Histórias de amor com muito humor'
              }
            ]
          };
        } else if (selectedOption.text.includes('empolgado')) {
          return {
            id: 'energetic-style',
            text: 'Que tal...',
            options: [
              {
                id: '1',
                text: 'Uma aventura emocionante com muita ação?',
                description: 'Filmes cheios de adrenalina'
              },
              {
                id: '2',
                text: 'Um filme de esportes com uma história de superação e vitória?',
                description: 'Histórias inspiradoras de esporte'
              },
              {
                id: '3',
                text: 'Uma comédia musical vibrante e contagiante?',
                description: 'Filmes com música e dança'
              },
              {
                id: '4',
                text: 'Um filme de fantasia com um ritmo acelerado e mundos fantásticos?',
                description: 'Aventuras em mundos mágicos'
              }
            ]
          };
        }
      }
    }
    return null;
  };

  const mockMovies: Record<string, Movie[]> = {
    'comedy-romantic': [
      {
        id: '1',
        title: 'Todos Menos Você',
        year: 2023,
        director: 'Will Gluck',
        description: 'Uma comédia romântica sobre dois ex-namorados que fingem estar juntos em um casamento.',
        genres: ['Comédia', 'Romance'],
        streamingPlatforms: ['Netflix']
      },
      {
        id: '2',
        title: 'Uma Ideia de Você',
        year: 2024,
        director: 'Jennifer Westfeldt',
        description: 'Uma mãe solteira se envolve com um cantor famoso em uma história de amor inesperada.',
        genres: ['Comédia', 'Romance'],
        streamingPlatforms: ['Amazon Prime']
      },
      {
        id: '3',
        title: 'De Repente 30',
        year: 2004,
        director: 'Gary Winick',
        description: 'Uma adolescente de 13 anos acorda no corpo de uma mulher de 30 anos e precisa lidar com sua vida adulta.',
        genres: ['Comédia', 'Romance', 'Fantasia'],
        streamingPlatforms: ['Netflix', 'HBO Max']
      }
    ],
    'drama-superation': [
      {
        id: '1',
        title: 'À Procura da Felicidade',
        year: 2006,
        director: 'Gabriele Muccino',
        description: 'Um pai desempregado luta para criar seu filho enquanto enfrenta inúmeros desafios na busca por uma vida melhor.',
        genres: ['Drama', 'Biografia'],
        streamingPlatforms: ['Netflix', 'Amazon Prime']
      },
      {
        id: '2',
        title: 'Um Sonho Possível',
        year: 2009,
        director: 'John Lee Hancock',
        description: 'Baseado na história real de Michael Oher, um jovem sem-teto que encontra uma nova família e a chance de se tornar um jogador de futebol americano.',
        genres: ['Drama', 'Esporte'],
        streamingPlatforms: ['Disney+', 'HBO Max']
      },
      {
        id: '3',
        title: 'As Vantagens de Ser Invisível',
        year: 2012,
        director: 'Stephen Chbosky',
        description: 'A história de Charlie, um adolescente introspectivo que lida com traumas do passado enquanto tenta encontrar seu lugar no mundo.',
        genres: ['Drama', 'Romance'],
        streamingPlatforms: ['Netflix', 'Amazon Prime']
      }
    ]
  };

  const handleOptionSelect = (option: Question['options'][0]) => {
    console.log('Opção selecionada:', option);
    console.log('Etapa atual:', currentStep);
    console.log('Sentimento principal selecionado:', selectedMainSentiment);

    if (currentStep === 0) {
      // Primeira etapa: selecionou um sentimento principal
      const selectedSentiment = mainSentiments.find(s => s.id.toString() === option.id);
      console.log('Sentimento encontrado:', selectedSentiment);
      
      if (selectedSentiment) {
        setSelectedMainSentiment(selectedSentiment);
      }
    } else {
      setSelectedOptions(prev => ({
        ...prev,
        [currentStep]: option
      }));

      if (currentStep < steps.length - 1) {
        // Avança para a próxima etapa
        setCurrentStep(prev => prev + 1);
      } else {
        // Última etapa: mostra os resultados
        console.log('Mostrando resultados para:', selectedMainSentiment?.name);
        
        if (selectedMainSentiment?.name.includes('Feliz')) {
          setSuggestedMovies(mockMovies['comedy-romantic']);
        } else if (selectedMainSentiment?.name.includes('Triste')) {
          setSuggestedMovies(mockMovies['drama-superation']);
        }
        setShowResults(true);
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