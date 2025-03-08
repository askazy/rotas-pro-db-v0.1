import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [driverKey, setDriverKey] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (role === 'driver' && !driverKey) {
      setError('A chave de motorista é obrigatória.');
      return;
    }

    try {
      // Em um sistema real, verificaríamos a chave do motorista aqui
      await signUp(email, password, {
        full_name: fullName,
        role,
        driver_key: role === 'driver' ? driverKey : undefined
      });
      
      // Redirecionar com base no papel do usuário
      if (role === 'driver') {
        navigate('/driver');
      } else {
        navigate('/passenger');
      }
    } catch (err) {
      setError('Erro ao criar conta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar uma nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              entre com sua conta existente
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome completo"
              label="Nome completo"
              leftIcon={<span className="material-symbols-outlined text-gray-400">person</span>}
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              label="E-mail"
              leftIcon={<span className="material-symbols-outlined text-gray-400">email</span>}
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              label="Senha"
              leftIcon={<span className="material-symbols-outlined text-gray-400">lock</span>}
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              label="Confirmar senha"
              leftIcon={<span className="material-symbols-outlined text-gray-400">lock</span>}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de conta
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="passenger"
                    name="role"
                    type="radio"
                    checked={role === 'passenger'}
                    onChange={() => setRole('passenger')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="passenger" className="ml-2 block text-sm text-gray-900">
                    Passageiro
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="driver"
                    name="role"
                    type="radio"
                    checked={role === 'driver'}
                    onChange={() => setRole('driver')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="driver" className="ml-2 block text-sm text-gray-900">
                    Motorista
                  </label>
                </div>
              </div>
            </div>
            
            {role === 'driver' && (
              <Input
                id="driverKey"
                name="driverKey"
                type="text"
                required
                value={driverKey}
                onChange={(e) => setDriverKey(e.target.value)}
                placeholder="Chave de motorista"
                label="Chave de motorista"
                leftIcon={<span className="material-symbols-outlined text-gray-400">key</span>}
                helperText="Insira a chave fornecida pelo administrador"
              />
            )}
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              leftIcon={<span className="material-symbols-outlined">person_add</span>}
            >
              Criar conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
