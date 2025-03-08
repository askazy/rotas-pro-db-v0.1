import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SideNavigation from './SideNavigation';
import MobileNavigation from './MobileNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userType: 'admin' | 'driver' | 'passenger';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, userType }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Definir links de navegação com base no tipo de usuário
  const getNavigationLinks = () => {
    switch (userType) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
          { name: 'Motoristas', href: '/admin/drivers', icon: 'directions_car' },
          { name: 'Passageiros', href: '/admin/passengers', icon: 'people' },
          { name: 'Relatórios', href: '/admin/reports', icon: 'assessment' }
        ];
      case 'driver':
        return [
          { name: 'Dashboard', href: '/driver', icon: 'dashboard' },
          { name: 'Perfil', href: '/driver/profile', icon: 'person' },
          { name: 'Histórico', href: '/driver/history', icon: 'history' }
        ];
      case 'passenger':
        return [
          { name: 'Dashboard', href: '/passenger', icon: 'dashboard' },
          { name: 'Perfil', href: '/passenger/profile', icon: 'person' },
          { name: 'Histórico', href: '/passenger/history', icon: 'history' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <SideNavigation 
        links={getNavigationLinks()} 
        userType={userType}
        onSignOut={handleSignOut}
        userName={user?.user_metadata?.full_name || 'Usuário'}
      />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho móvel */}
        <MobileNavigation 
          title={title}
          links={getNavigationLinks()}
          userType={userType}
          onSignOut={handleSignOut}
          userName={user?.user_metadata?.full_name || 'Usuário'}
        />
        
        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
