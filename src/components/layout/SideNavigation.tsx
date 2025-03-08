import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationLink {
  name: string;
  href: string;
  icon: string;
}

interface SideNavigationProps {
  links: NavigationLink[];
  userType: 'admin' | 'driver' | 'passenger';
  onSignOut: () => void;
  userName: string;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ links, userType, onSignOut, userName }) => {
  const location = useLocation();
  
  // Determinar a cor do tema com base no tipo de usuário
  const getThemeColor = () => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'driver':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'passenger':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };
  
  const getActiveClass = (href: string) => {
    return location.pathname === href
      ? `${getThemeColor()} text-white`
      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900';
  };

  const getHeaderColor = () => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-700';
      case 'driver':
        return 'bg-blue-700';
      case 'passenger':
        return 'bg-green-700';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className={`flex items-center h-16 flex-shrink-0 px-4 ${getHeaderColor()}`}>
            <span className="text-xl font-bold text-white">RotasPro</span>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {links.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${getActiveClass(item.href)}`}
                >
                  <span className="material-symbols-outlined mr-3 flex-shrink-0 h-6 w-6">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className={`h-9 w-9 rounded-full ${getHeaderColor()} flex items-center justify-center text-white`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {userName}
                  </p>
                  <button
                    onClick={onSignOut}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
