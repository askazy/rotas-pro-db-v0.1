import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getRides, requestRide } from '../lib/rideService';
import RideCard from '../components/rides/RideCard';

const PassengerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingRide, setRequestingRide] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    const loadRides = async () => {
      try {
        const userRides = await getRides(user?.id);
        setRides(userRides.filter((ride: any) => ride.status !== 'completed'));
      } catch (error) {
        console.error('Erro ao carregar corridas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadRides();
    }
  }, [user]);

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;

    setRequestingRide(true);
    try {
      await requestRide({
        passengerId: user?.id,
        origin,
        destination,
        requestTime: new Date().toISOString(),
      });
      
      // Recarregar corridas após solicitar uma nova
      const userRides = await getRides(user?.id);
      setRides(userRides.filter((ride: any) => ride.status !== 'completed'));
      
      // Limpar formulário e esconder
      setOrigin('');
      setDestination('');
      setShowRequestForm(false);
    } catch (error) {
      console.error('Erro ao solicitar corrida:', error);
    } finally {
      setRequestingRide(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard do Passageiro" userType="passenger">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Bem-vindo, {user?.user_metadata?.full_name || 'Passageiro'}</h2>
        
        {!showRequestForm ? (
          <Button 
            onClick={() => setShowRequestForm(true)}
            leftIcon={<span className="material-symbols-outlined">add</span>}
          >
            Solicitar Nova Corrida
          </Button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Nova Solicitação de Corrida</h3>
            <form onSubmit={handleRequestRide}>
              <div className="mb-3">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  Origem
                </label>
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destino
                </label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  isLoading={requestingRide}
                  variant="primary"
                >
                  Solicitar
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Suas Corridas Ativas</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-500">Carregando corridas...</p>
          </div>
        ) : rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} userType="passenger" />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-gray-400">directions_car</span>
            <p className="mt-2 text-gray-500">Você não tem corridas ativas no momento.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PassengerDashboard;
