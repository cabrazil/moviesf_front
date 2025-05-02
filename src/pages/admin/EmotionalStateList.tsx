import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmotionalStates, deleteEmotionalState } from '../../services/api';
import AdminList from '../../components/admin/AdminList';
import { EmotionalState } from '../../services/api';

const EmotionalStateList: React.FC = () => {
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmotionalStates = async () => {
      try {
        const states = await getEmotionalStates();
        setEmotionalStates(states);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar estados emocionais');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmotionalStates();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este estado emocional?')) {
      try {
        await deleteEmotionalState(id);
        setEmotionalStates(states => states.filter(state => state.id !== id));
      } catch (err) {
        console.error('Erro ao excluir estado emocional:', err);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <AdminList
      title="Estados Emocionais"
      addButtonText="Novo Estado Emocional"
      addButtonLink="/admin/emotional-states/new"
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/6">Sentimento</th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/6">Jornada</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900 w-1/12">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-semibold text-gray-900 w-1/12">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emotionalStates.map((state) => (
              <tr key={state.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 truncate">{state.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate">{state.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate">{state.mainSentiment.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {state.journeySteps.length} passos, {state.journeySteps.reduce((acc, step) => acc + step.options.length, 0)} opções
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    state.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {state.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-3">
                    <Link
                      to={`/admin/emotional-states/${state.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(state.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminList>
  );
};

export default EmotionalStateList; 