import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RideService } from '../../lib/rideService';
import { Ride } from '../../types/database';
import DriverRating from '../../components/passenger/DriverRating';

const PassengerRideHistoryPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [rideToRate, setRideToRate] = useState<string | null>(null);
  const location = useLocation();
  
  // Verificar se há um ID de corrida para avaliar na URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const rateRideId = searchParams.get('rate');
    if (rateRideId) {
      setRideToRate(rateRideId);
    }
  }, [location]);
  
  // Carregar histórico de corridas
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const history = RideService.getPassengerRideHistory(user.id);
        setRideHistory(history);
      } catch (error) {
        console.error('Erro ao carregar histórico de corridas:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);
  
  // Fechar modal de avaliação
  const handleCloseRating = () => {
    setRideToRate(null);
    // Remover o parâmetro da URL
    const url = new URL(window.location.href);
    url.searchParams.delete('rate');
    window.history.replaceState({}, '', url.toString());
  };
  
  // Submeter avaliação
  const handleSubmitRating = (rideId: string, rating: number, comment: string) => {
    setIsLoading(true);
    try {
      const updatedRide = RideService.rateRide(rideId, rating, comment);
      if (updatedRide) {
        // Atualizar a corrida na lista
        setRideHistory(prev => 
          prev.map(ride => ride.id === rideId ? updatedRide : ride)
        );
      }
      handleCloseRating();
    } catch (error) {
      console.error('Erro ao avaliar corrida:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra lateral (visível apenas em desktop) */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-blue-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-900">
          <Link to="/" className="text-white font-bold text-xl">Rotas Pro</Link>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-4 py-4 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Usuário'}</p>
                <p className="text-xs text-blue-200">Passageiro</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-2 flex-1 px-2 space-y-1">
            <Link
              to="/passenger"
              className="text-blue-100 hover:bg-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <Link
              to="/passenger/profile"
              className="text-blue-100 hover:bg-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meu Perfil
            </Link>
            
            <Link
              to="/passenger/history"
              className="bg-blue-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Histórico
            </Link>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
          <button
            onClick={() => signOut()}
            className="flex-shrink-0 w-full group block text-blue-100 hover:text-white"
          >
            <div className="flex items-center">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Sair</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Barra superior móvel */}
        <div className="md:hidden bg-blue-800 px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-xl">Rotas Pro</Link>
          <button
            type="button"
            className="text-white focus:outline-none"
            onClick={() => {
              // Implementar toggle do menu mobile
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Menu móvel */}
        <div id="mobile-menu" className="md:hidden hidden bg-blue-800">
          <div className="px-4 py-3 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Usuário'}</p>
                <p className="text-xs text-blue-200">Passageiro</p>
              </div>
            </div>
          </div>
          
          <nav className="px-2 py-3 space-y-1">
            <Link
              to="/passenger"
              className="text-blue-100 hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
              }}
            >
              Dashboard
            </Link>
            
            <Link
              to="/passenger/profile"
              className="text-blue-100 hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
              }}
            >
              Meu Perfil
            </Link>
            
            <Link
              to="/passenger/history"
              className="bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
              }}
            >
              Histórico
            </Link>
            
            <button
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
                signOut();
              }}
              className="text-blue-100 hover:bg-blue-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Sair
            </button>
          </nav>
        </div>
        
        {/* Conteúdo da página */}
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Histórico de Corridas</h1>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Suas corridas anteriores
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Visualize e avalie suas corridas passadas.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`inline-flex items-center px-3 py-1.5 border ${
                        viewMode === 'cards'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700'
                      } rounded-md text-sm font-medium`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center px-3 py-1.5 border ${
                        viewMode === 'table'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700'
                      } rounded-md text-sm font-medium`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                      </svg>
                      Tabela
                    </button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">Carregando histórico de corridas...</p>
                  </div>
                ) : rideHistory.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">Você ainda não realizou nenhuma corrida.</p>
                    <Link
                      to="/passenger"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Solicitar uma corrida
                    </Link>
                  </div>
                ) : viewMode === 'cards' ? (
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rideHistory.map(ride => (
                        <div key={ride.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{ride.destination}</h4>
                            <p className="text-sm text-gray-500">De: {ride.pickup_location}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {ride.pickup_date} às {ride.pickup_time}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                ride.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {ride.status === 'completed' ? 'Concluída' : 'Cancelada'}
                              </span>
                              
                              {ride.status === 'completed' && !ride.rating && (
                                <button
                                  onClick={() => setRideToRate(ride.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Avaliar motorista
                                </button>
                              )}
                            </div>
                            
                            {ride.status === 'completed' && ride.rating && (
                              <div className="mt-2">
                                <div className="flex items-center">
                                  <p className="text-sm text-gray-500 mr-2">Sua avaliação:</p>
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= ride.rating
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Destino
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data/Hora
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Avaliação
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {rideHistory.map(ride => (
                            <tr key={ride.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{ride.destination}</div>
                                <div className="text-sm text-gray-500">De: {ride.pickup_location}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{ride.pickup_date}</div>
                                <div className="text-sm text-gray-500">{ride.pickup_time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  ride.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {ride.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {ride.status === 'completed' && ride.rating ? (
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= ride.rating
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {ride.status === 'completed' && !ride.rating && (
                                  <button
                                    onClick={() => setRideToRate(ride.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Avaliar
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modal de avaliação */}
      {rideToRate && (
        <DriverRating
          rideId={rideToRate}
          onClose={handleCloseRating}
          onSubmit={handleSubmitRating}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default PassengerRideHistoryPage;
