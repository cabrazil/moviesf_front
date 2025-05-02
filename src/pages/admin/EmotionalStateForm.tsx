import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getEmotionalState, createEmotionalState, updateEmotionalState, getMainSentiments } from '../../services/api';
import { EmotionalState, MainSentiment } from '../../services/api';

interface JourneyStep {
  question: string;
  options: {
    text: string;
    nextStepId: number | null;
    isEndState: boolean;
  }[];
}

const EmotionalStateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mainSentimentId: 0,
    isActive: true,
    journeySteps: [] as JourneyStep[]
  });
  const [currentStep, setCurrentStep] = useState<JourneyStep>({
    question: '',
    options: []
  });
  const [currentOption, setCurrentOption] = useState({
    text: '',
    nextStepId: null,
    isEndState: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const sentiments = await getMainSentiments();
        setMainSentiments(sentiments);

        if (id) {
          const state = await getEmotionalState(parseInt(id));
          setFormData({
            name: state.name,
            description: state.description,
            mainSentimentId: state.mainSentimentId,
            isActive: state.isActive,
            journeySteps: state.journeySteps.map(step => ({
              question: step.question,
              options: step.options.map(opt => ({
                text: opt.text,
                nextStepId: opt.nextStepId,
                isEndState: opt.isEndState
              }))
            }))
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentStep(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentOption(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addOption = () => {
    if (currentOption.text) {
      setCurrentStep(prev => ({
        ...prev,
        options: [...prev.options, { ...currentOption }]
      }));
      setCurrentOption({
        text: '',
        nextStepId: null,
        isEndState: false
      });
    }
  };

  const addStep = () => {
    if (currentStep.question && currentStep.options.length > 0) {
      setFormData(prev => ({
        ...prev,
        journeySteps: [...prev.journeySteps, { ...currentStep }]
      }));
      setCurrentStep({
        question: '',
        options: []
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        await updateEmotionalState(parseInt(id), formData);
        setSuccess('Estado emocional atualizado com sucesso!');
      } else {
        await createEmotionalState(formData);
        setSuccess('Estado emocional criado com sucesso!');
      }
      setTimeout(() => navigate('/admin/emotional-states'), 1500);
    } catch (error) {
      console.error('Erro ao salvar estado emocional:', error);
      setError('Erro ao salvar estado emocional. Por favor, tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Editar Estado Emocional' : 'Novo Estado Emocional'}
            </h1>
            <Link
              to="/admin/emotional-states"
              className="text-blue-600 hover:text-blue-800"
            >
              Voltar para a lista
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Informações Básicas */}
              <div className="mb-6">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mainSentimentId" className="block text-sm font-medium text-gray-700 mb-1">
                      Sentimento Principal
                    </label>
                    <select
                      id="mainSentimentId"
                      name="mainSentimentId"
                      value={formData.mainSentimentId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione um sentimento</option>
                      {mainSentiments.map(sentiment => (
                        <option key={sentiment.id} value={sentiment.id}>
                          {sentiment.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Estado ativo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Jornada do Usuário */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Jornada do Usuário</h2>
                
                {/* Lista de Passos */}
                <div className="space-y-4 mb-6">
                  {formData.journeySteps.map((step, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Passo {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              journeySteps: prev.journeySteps.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{step.question}</p>
                      <div className="pl-4 space-y-2">
                        {step.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center text-sm text-gray-600">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 mr-2 text-xs">
                              {optIndex + 1}
                            </span>
                            <span className="flex-1">{option.text}</span>
                            {option.isEndState && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Final
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de Novo Passo */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Adicionar Novo Passo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pergunta
                      </label>
                      <input
                        type="text"
                        name="question"
                        value={currentStep.question}
                        onChange={handleStepChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite a pergunta para este passo"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Opções de Resposta
                        </label>
                        <span className="text-xs text-gray-500">
                          {currentStep.options.length} opções
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {currentStep.options.map((option, index) => (
                          <div key={index} className="flex items-center bg-white p-2 rounded-md border border-gray-200">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 mr-2 text-xs">
                              {index + 1}
                            </span>
                            <span className="flex-1 text-sm">{option.text}</span>
                            {option.isEndState && (
                              <span className="mx-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Final
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentStep(prev => ({
                                  ...prev,
                                  options: prev.options.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            name="text"
                            value={currentOption.text}
                            onChange={handleOptionChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Digite o texto da opção"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="isEndState"
                              checked={currentOption.isEndState}
                              onChange={handleOptionChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Opção Final</span>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={addOption}
                          disabled={!currentOption.text}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addStep}
                        disabled={!currentStep.question || currentStep.options.length === 0}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Adicionar Passo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  {success}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Link
                  to="/admin/emotional-states"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmotionalStateForm; 