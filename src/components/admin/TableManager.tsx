import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

interface TableData {
  id: string
  nome: string
  conteudo: string
  status: 'Ativo' | 'Inativo'
}

export function TableManager() {
  const [tables] = useState<TableData[]>([
    {
      id: '1',
      nome: 'Sentimentos',
      conteudo: 'Gerencia os sentimentos e estados emocionais disponíveis no sistema.',
      status: 'Ativo'
    },
    {
      id: '2',
      nome: 'Estados Emocionais',
      conteudo: 'Configure as árvores de decisão para recomendação baseada em estados emocionais.',
      status: 'Ativo'
    },
    {
      id: '3',
      nome: 'Filmes',
      conteudo: 'Gerencia o catálogo de filmes e suas associações com sentimentos.',
      status: 'Ativo'
    }
  ])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gerenciamento de Tabelas
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as tabelas e modelos disponíveis no sistema
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Adicionar Tabela
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    NOME
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    CONTEÚDO
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    STATUS
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    AÇÕES
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tables.map((table) => (
                  <tr key={table.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {table.nome}
                    </td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-xl">
                      {table.conteudo}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        table.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {table.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => console.log('Editar', table.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => console.log('Excluir', table.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 