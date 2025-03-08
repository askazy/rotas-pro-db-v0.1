import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getAvailableRides, getRides, updateRideStatus } from '../lib/rideService';
import RideCard from '../components/rides/RideCard';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [driverStatus, setDriverStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const loadRides = async () => {
      try {
        if (user?.id) {
          const userRides = await getRides(user.id, 'driver');
          setActiveRides(userRides.filter((ride: any) => 
            ride.status === 'accepted' || ride.status === 'in_progress'
          ));
        }
      } catch (error) {
        console.error('Erro ao carregar corridas ativas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRides();
  }, [user]);

  useEffect(() => {
    const loadAvailableRides = async () => {
      if (driverStatus === 'online') {
        setLoadingAvailable(true);
        try {
          const rides = await getAvailableRides();
          setAvailableRides(rides);
        } catch (error) {
          console.error('Erro ao carregar corridas disponíveis:', error);
        } finally {
          setLoadingAvailable(false);
        }
      } else {
        setAvailableRides([]);
      }
    };

    loadAvailableRides();
    
    // Atualizar corridas disponíveis a cada 30 segundos quando online
    let interval: NodeJS.Timeout;
    if (driverStatus === 'online') {
      interval = setInterval(loadAvailableRides, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [driverStatus]);

  const toggleDriverStatus = () => {
    setDriverStatus(driverStatus === 'online' ? 'offline' : 'online');
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      await updateRideStatus(rideId, 'accepted', user?.id);
      
      // Atualizar listas de corridas
      const updatedAvailable = availableRides.filter(ride => ride.id !== rideId);
      setAvailableRides(updatedAvailable);
      
      const acceptedRide = availableRides.find(ride => ride.id === rideId);
      if (acceptedRide) {
        acceptedRide.status = 'accepted';
        acceptedRide.driverId = user?.id;
        setActiveRides([...activeRides, acceptedRide]);
      }
    } catch (error) {
      console.error('Erro ao aceitar corrida:', error);
    }
  };

  const handleStartRide = async (rideId: string) => {
    try {
      await updateRideStatus(rideId, 'in_progress');
      
      // Atualizar status na lista local
      const updatedRides = activeRides.map(ride => {
        if (ride.id === rideId) {
          return { ...ride, status: 'in_progress' };
        }
        return ride;
      });
      
      setActiveRides(updatedRides);
    } catch (error) {
      console.error('Erro ao iniciar corrida:', error);
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      await updateRideStatus(rideId, 'completed');
      
      // Remover da lista de corridas ativas
      const updatedRides = activeRides.filter(ride => ride.id !== rideId);
      setActiveRides(updatedRides);
    } catch (error) {
      console.error('Erro ao completar corrida:', error);
    }
  };

  return (
    <DashboardLayout title="Dashboard do Motorista" userType="driver">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Bem-vindo, {user?.user_metadata?.full_name || 'Motorista'}</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Status:</span>
            <Button
              onClick={toggleDriverStatus}
              variant={driverStatus === 'online' ? 'success' : 'secondary'}
              size="sm"
              leftIcon={
                <span className="material-symbols-outlined">
                  {driverStatus === 'online' ? 'check_circle' : 'cancel'}
                </span>
              }
            >
              {driverStatus === 'online' ? 'Online' : 'Offline'}
            </Button>
          </div>
        </div>
      </div>

      {/* Corridas ativas do motorista */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Suas Corridas Ativas</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-500">Carregando corridas...</p>
          </div>
        ) : activeRides.length > 0 ? (
          <div className="space-y-4">
            {activeRides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                userType="driver"
                onStartRide={() => handleStartRide(ride.id)}
                onCompleteRide={() => handleCompleteRide(ride.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-gray-400">directions_car</span>
            <p className="mt-2 text-gray-500">Você não tem corridas ativas no momento.</p>
          </div>
        )}
      </div>

      {/* Corridas disponíveis para aceitar */}
      {driverStatus === 'online' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Corridas Disponíveis</h2>
          
          {loadingAvailable ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-500">Buscando corridas disponíveis...</p>
            </div>
          ) : availableRides.length > 0 ? (
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  userType="driver"
                  onAcceptRide={() => handleAcceptRide(ride.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <span className="material-symbols-outlined text-4xl text-gray-400">search</span>
              <p className="mt-2 text-gray-500">Não há corridas disponíveis no momento.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DriverDashboard;
