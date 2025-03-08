import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getAllRides } from '../lib/rideService';
import { getAllDrivers } from '../lib/driverService';
import { getAllPassengers } from '../lib/mockData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalDrivers: 0,
    totalPassengers: 0,
    completedRides: 0,
    cancelledRides: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Carregar dados para o dashboard
        const rides = await getAllRides();
        const drivers = await getAllDrivers();
        const passengers = await getAllPassengers();
        
        setStats({
          totalRides: rides.length,
          activeRides: rides.filter(ride => ['requested', 'accepted', 'in_progress'].includes(ride.status)).length,
          completedRides: rides.filter(ride => ride.status === 'completed').length,
          cancelledRides: rides.filter(ride => ride.status === 'cancelled').length,
          totalDrivers: drivers.length,
          totalPassengers: passengers.length
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          <span className="material-symbols-outlined text-white">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Dashboard Administrativo" userType="admin">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Bem-vindo, {user?.user_metadata?.full_name || 'Administrador'}</h2>
        <p className="text-gray-600">
          Este é o painel de controle administrativo do sistema RotasPro. Aqui você pode gerenciar motoristas, passageiros e visualizar relatórios.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
          <p className="mt-4 text-gray-500">Carregando dados do dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Total de Corridas" 
              value={stats.totalRides} 
              icon="route" 
              color="bg-blue-600" 
            />
            <StatCard 
              title="Corridas Ativas" 
              value={stats.activeRides} 
              icon="local_taxi" 
              color="bg-green-600" 
            />
            <StatCard 
              title="Motoristas" 
              value={stats.totalDrivers} 
              icon="directions_car" 
              color="bg-purple-600" 
            />
            <StatCard 
              title="Passageiros" 
              value={stats.totalPassengers} 
              icon="people" 
              color="bg-orange-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  leftIcon={<span className="material-symbols-outlined">person_add</span>}
                  onClick={() => window.location.href = '/admin/drivers'}
                >
                  Gerenciar Motoristas
                </Button>
                <Button 
                  fullWidth 
                  variant="secondary"
                  leftIcon={<span className="material-symbols-outlined">group</span>}
                  onClick={() => window.location.href = '/admin/passengers'}
                >
                  Gerenciar Passageiros
                </Button>
                <Button 
                  fullWidth 
                  variant="info"
                  leftIcon={<span className="material-symbols-outlined">assessment</span>}
                  onClick={() => window.location.href = '/admin/reports'}
                >
                  Ver Relatórios
                </Button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo de Corridas</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Corridas Completadas</span>
                  <span className="font-medium text-green-600">{stats.completedRides}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(stats.completedRides / stats.totalRides) * 100}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Corridas Ativas</span>
                  <span className="font-medium text-blue-600">{stats.activeRides}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(stats.activeRides / stats.totalRides) * 100}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Corridas Canceladas</span>
                  <span className="font-medium text-red-600">{stats.cancelledRides}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${(stats.cancelledRides / stats.totalRides) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
