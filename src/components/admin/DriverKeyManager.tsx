import React, { useState, useEffect } from 'react';
import { 
  generateDriverKey, 
  getAllDriverKeys, 
  revokeDriverKey,
  DriverKey
} from '../../lib/driverKeyService';

const DriverKeyManager: React.FC = () => {
  const [driverKeys, setDriverKeys] = useState<DriverKey[]>([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDriverKeys();
  }, []);

  const loadDriverKeys = () => {
    const keys = getAllDriverKeys();
    setDriverKeys(keys);
  };

  const handleGenerateKey = () => {
    setIsLoading(true);
    try {
      const newKey = generateDriverKey(description);
      setDriverKeys([newKey, ...driverKeys]);
      setDescription('');
    } catch (error) {
      console.error('Erro ao gerar chave:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeKey = (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja revogar esta chave?');
    if (confirmed) {
      const success = revokeDriverKey(id);
      if (success) {
        loadDriverKeys();
      } else {
        alert('Não foi possível revogar esta chave. Ela pode já ter sido utilizada.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Chaves de Motorista</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Gerencie as chaves de acesso para novos motoristas
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex">
            <input
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleGenerateKey}
              disabled={isLoading}
            >
              {isLoading ? 'Gerando...' : 'Gerar Chave'}
            </button>
          </div>
          
          {driverKeys.length > 0 ? (
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {driverKeys.map((key) => (
                  <li key={key.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {key.key}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            key.used_at 
                              ? 'bg-gray-100 text-gray-800' 
                              : key.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {key.used_at 
                              ? 'Utilizada' 
                              : key.isActive 
                                ? 'Não utilizada' 
                                : 'Revogada'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Gerada em: {formatDate(key.createdAt)}
                          </p>
                        </div>
                        <div>
                          {key.used_at ? (
                            <p className="text-sm text-gray-500">
                              Utilizada por: {key.used_by}
                            </p>
                          ) : key.isActive ? (
                            <button
                              type="button"
                              className="text-sm text-red-600 hover:text-red-900"
                              onClick={() => handleRevokeKey(key.id)}
                            >
                              Revogar
                            </button>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Revogada
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 text-center py-4 text-gray-500">
              Nenhuma chave de motorista encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverKeyManager;
