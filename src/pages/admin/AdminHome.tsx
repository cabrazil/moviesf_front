import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bem-vindo à Área Administrativa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/movies"
          className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Filmes</h2>
          <p className="text-gray-600">Gerencie o catálogo de filmes disponíveis</p>
        </Link>

        <Link
          to="/admin/emotional-states"
          className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-green-800 mb-2">Estados Emocionais</h2>
          <p className="text-gray-600">Configure os estados emocionais e suas características</p>
        </Link>

        <Link
          to="/admin/movie-suggestions"
          className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-purple-800 mb-2">Sugestões</h2>
          <p className="text-gray-600">Gerencie as sugestões de filmes por estado emocional</p>
        </Link>

        <Link
          to="/admin/movie-sentiments"
          className="bg-yellow-50 p-6 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Sentimentos</h2>
          <p className="text-gray-600">Configure a relação entre filmes e sentimentos</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome; 