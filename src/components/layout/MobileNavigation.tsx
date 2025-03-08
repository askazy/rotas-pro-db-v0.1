import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationLink {
  name: string;
  href: string;
  icon: string;
}

interface MobileNavigationProps {
  title: string;
  links: NavigationLink[];
  userType: 'admin' | 'driver' | 'passenger';
  onSignOut: () => void;
  userName: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  title, 
  links, 
  userType, 
  onSignOut,
  userName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Determinar a cor do tema com base no tipo de usuário
  const getThemeColor = () => {
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

  const getActiveClass = (href: string) => {
    return location.pathname === href
      ? `${getThemeColor()} text-white`
      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900';
  };

  return (
    <>
      <header className={`md:hidden flex items-center justify-between p-4 ${getThemeColor()}`}>
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="ml-4 text-lg font-semibold text-white">{title}</h1>
        </div>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-700">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Menu móvel deslizante */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay de fundo */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleMenu}
          ></div>
          
          {/* Painel de navegação */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={toggleMenu}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>
            
            <div className={`flex items-center h-16 flex-shrink-0 px-4 ${getThemeColor()}`}>
              <span className="text-xl font-bold text-white">RotasPro</span>
            </div>
            
            <div className="flex-1 h-0 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {links.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${getActiveClass(item.href)}`}
                    onClick={toggleMenu}
                  >
                    <span className="material-symbols-outlined mr-4 flex-shrink-0 h-6 w-6">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <div className={`h-9 w-9 rounded-full ${getThemeColor()} flex items-center justify-center text-white`}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {userName}
                    </p>
                    <button
                      onClick={() => {
                        onSignOut();
                        toggleMenu();
                      }}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14">
            {/* Espaço de força */}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
