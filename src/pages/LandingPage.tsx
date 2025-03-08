import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">RotasPro</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="secondary" size="sm">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Transporte executivo</span>
              <span className="block text-blue-200">para profissionais</span>
            </h1>
            <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
              Serviço de transporte executivo para profissionais em Carapicuíba e região. 
              Conforto, segurança e pontualidade para suas viagens corporativas.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link to="/register">
                  <Button size="lg" fullWidth>
                    Comece agora
                  </Button>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/login">
                  <Button variant="secondary" size="lg" fullWidth>
                    Já tenho conta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Recursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Uma melhor maneira de se deslocar
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Oferecemos um serviço completo para suas necessidades de transporte executivo.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <span className="material-symbols-outlined text-white">schedule</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Pontualidade</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Nossos motoristas são treinados para chegar sempre no horário marcado, respeitando seu tempo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <span className="material-symbols-outlined text-white">security</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Segurança</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Todos os motoristas são verificados e os veículos passam por inspeções regulares.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <span className="material-symbols-outlined text-white">airline_seat_recline_normal</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Conforto</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Veículos executivos com ar-condicionado, Wi-Fi e outras comodidades para sua viagem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Empresa</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Sobre nós</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Carreiras</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Contato</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Serviços</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Transporte executivo</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Eventos corporativos</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Transfers</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Política de privacidade</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Termos de uso</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <span className="material-symbols-outlined">facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <span className="material-symbols-outlined">flutter_dash</span>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2023 RotasPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
