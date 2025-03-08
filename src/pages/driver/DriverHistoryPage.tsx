import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { mockRides } from '../../lib/mockData';
import RideCard from '../../components/rides/RideCard';

const DriverHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Itens de navegação para o motorista
  const navItems = [
    {
      path: '/driver',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/driver/profile',
      label: 'Meu Perfil',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      path: '/driver/history',
      label: 'Histórico',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Filtrar histórico de corridas do motorista (status: 'completed' ou 'cancelled')
  const rideHistory = mockRides.filter(
    ride => 
      (ride.status === 'completed' || ride.status === 'cancelled') && 
      ride.driver_id === user?.id
  );

  return (
    <DashboardLayout title="Histórico de Corridas" navItems={navItems}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumo de Atividades
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Estatísticas das suas corridas.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">
                Total de corridas
              </dt>
              <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-blue-600">
                  {rideHistory.length}
                </div>
              </dd>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">
                Corridas concluídas
              </dt>
              <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-green-600">
                  {rideHistory.filter(ride => ride.status === 'completed').length}
                </div>
              </dd>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">
                Corridas canceladas
              </dt>
              <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-red-600">
                  {rideHistory.filter(ride => ride.status === 'cancelled').length}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rideHistory.length > 0 ? (
          rideHistory.map(ride => (
            <RideCard key={ride.id} ride={ride} userType="driver" />
          ))
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-gray-500">Você ainda não realizou nenhuma corrida.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DriverHistoryPage;
