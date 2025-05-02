import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';

interface MainSentiment {
  id: number;
  name: string;
  description: string;
  keywords: string[];
  subSentiments: SubSentiment[];
}

interface SubSentiment {
  id: number;
  name: string;
  description: string;
  keywords: string[];
  mainSentimentId: number;
}

interface EditingMainSentiment extends Partial<MainSentiment> {
  id?: number;
  name?: string;
  description?: string;
  keywords?: string[];
}

interface EditingSubSentiment extends Partial<SubSentiment> {
  id?: number;
  name?: string;
  description?: string;
  keywords?: string[];
  mainSentimentId: number;
}

export function SentimentsManager() {
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMain, setEditingMain] = useState<EditingMainSentiment | null>(null);
  const [editingSub, setEditingSub] = useState<EditingSubSentiment | null>(null);

  useEffect(() => {
    loadSentiments();
  }, []);

  const loadSentiments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sentiments');
      setMainSentiments(response.data);
    } catch (err) {
      setError('Erro ao carregar sentimentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMainSentiment = async (sentiment: EditingMainSentiment) => {
    try {
      if (editingMain?.id) {
        await api.put(`/admin/sentiments/${editingMain.id}`, sentiment);
      } else {
        await api.post('/admin/sentiments', sentiment);
      }
      loadSentiments();
      setEditingMain(null);
    } catch (err) {
      setError('Erro ao salvar sentimento');
      console.error(err);
    }
  };

  const handleSaveSubSentiment = async (subSentiment: EditingSubSentiment) => {
    try {
      if (editingSub?.id) {
        await api.put(`/admin/sub-sentiments/${editingSub.id}`, subSentiment);
      } else {
        await api.post('/admin/sub-sentiments', subSentiment);
      }
      loadSentiments();
      setEditingSub(null);
    } catch (err) {
      setError('Erro ao salvar sub-sentimento');
      console.error(err);
    }
  };

  const handleDeleteMainSentiment = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este sentimento?')) return;
    
    try {
      await api.delete(`/admin/sentiments/${id}`);
      loadSentiments();
    } catch (err) {
      setError('Erro ao excluir sentimento');
      console.error(err);
    }
  };

  const handleDeleteSubSentiment = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este sub-sentimento?')) return;
    
    try {
      await api.delete(`/admin/sub-sentiments/${id}`);
      loadSentiments();
    } catch (err) {
      setError('Erro ao excluir sub-sentimento');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Sentimentos</h2>
        <button
          onClick={() => setEditingMain({ name: '', description: '', keywords: [] })}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Sentimento
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {mainSentiments.map((sentiment) => (
          <div key={sentiment.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{sentiment.name}</h3>
                <p className="text-gray-600">{sentiment.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sentiment.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingMain(sentiment)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteMainSentiment(sentiment.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Sub-sentimentos</h4>
                <button
                  onClick={() => setEditingSub({ mainSentimentId: sentiment.id, name: '', description: '', keywords: [] })}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {sentiment.subSentiments.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-gray-600">{sub.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSub(sub)}
                        className="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubSentiment(sub.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edição do sentimento principal */}
      {editingMain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {editingMain.id ? 'Editar' : 'Novo'} Sentimento
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name')?.toString() || '';
                const description = formData.get('description')?.toString() || '';
                const keywords = formData.get('keywords')?.toString().split(',').map(k => k.trim()).filter(Boolean) || [];
                
                handleSaveMainSentiment({
                  name,
                  description,
                  keywords,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingMain.name || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
                  defaultValue={editingMain.description || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Palavras-chave (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="keywords"
                  defaultValue={editingMain.keywords?.join(', ') || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMain(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edição do sub-sentimento */}
      {editingSub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {editingSub.id ? 'Editar' : 'Novo'} Sub-sentimento
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name')?.toString() || '';
                const description = formData.get('description')?.toString() || '';
                const keywords = formData.get('keywords')?.toString().split(',').map(k => k.trim()).filter(Boolean) || [];
                
                handleSaveSubSentiment({
                  name,
                  description,
                  keywords,
                  mainSentimentId: editingSub.mainSentimentId,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSub.name || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
                  defaultValue={editingSub.description || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Palavras-chave (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="keywords"
                  defaultValue={editingSub.keywords?.join(', ') || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 