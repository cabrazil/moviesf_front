import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'movies' | 'emotional-states' | 'suggestions'>('movies');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('movies')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'movies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Filmes
              </button>
              <button
                onClick={() => setActiveTab('emotional-states')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'emotional-states'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Estados Emocionais
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'suggestions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sugestões
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'movies' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Filmes</h2>
                {/* TODO: Implementar lista e formulário de filmes */}
              </div>
            )}
            {activeTab === 'emotional-states' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Estados Emocionais</h2>
                {/* TODO: Implementar lista e formulário de estados emocionais */}
              </div>
            )}
            {activeTab === 'suggestions' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Sugestões</h2>
                {/* TODO: Implementar lista e formulário de sugestões */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 