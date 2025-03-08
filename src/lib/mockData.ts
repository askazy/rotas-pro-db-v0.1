// Dados simulados para desenvolvimento

// Usuários
export const users = [
  {
    id: '1',
    email: 'admin@rotaspro.com',
    user_metadata: {
      full_name: 'Administrador',
      role: 'admin'
    }
  },
  {
    id: '2',
    email: 'motorista@rotaspro.com',
    user_metadata: {
      full_name: 'João Motorista',
      role: 'driver'
    }
  },
  {
    id: '3',
    email: 'passageiro@rotaspro.com',
    user_metadata: {
      full_name: 'Maria Passageira',
      role: 'passenger'
    }
  }
];

// Adicionando a exportação que está faltando
export const mockUsers = users;

// Corridas
export const rides = [
  {
    id: '101',
    passengerId: '3',
    driverId: '2',
    origin: 'Rua das Flores, 123',
    destination: 'Avenida Principal, 456',
    status: 'completed',
    requestTime: '2023-05-10T14:30:00Z',
    passengerName: 'Maria Passageira',
    driverName: 'João Motorista'
  },
  {
    id: '102',
    passengerId: '3',
    driverId: null,
    origin: 'Shopping Center',
    destination: 'Aeroporto',
    status: 'requested',
    requestTime: '2023-05-11T09:15:00Z',
    passengerName: 'Maria Passageira'
  },
  {
    id: '103',
    passengerId: '3',
    driverId: '2',
    origin: 'Escritório Central',
    destination: 'Restaurante Gourmet',
    status: 'in_progress',
    requestTime: '2023-05-11T12:00:00Z',
    passengerName: 'Maria Passageira',
    driverName: 'João Motorista'
  }
];

// Adicionando a exportação que está faltando
export const mockRides = rides;

// Motoristas
export const drivers = [
  {
    id: '2',
    name: 'João Motorista',
    email: 'motorista@rotaspro.com',
    phone: '(11) 98765-4321',
    carModel: 'Toyota Corolla',
    carColor: 'Preto',
    licensePlate: 'ABC-1234',
    rating: 4.8,
    status: 'active',
    totalRides: 156
  },
  {
    id: '4',
    name: 'Pedro Motorista',
    email: 'pedro@rotaspro.com',
    phone: '(11) 91234-5678',
    carModel: 'Honda Civic',
    carColor: 'Prata',
    licensePlate: 'DEF-5678',
    rating: 4.5,
    status: 'active',
    totalRides: 89
  }
];

// Passageiros
export const passengers = [
  {
    id: '3',
    name: 'Maria Passageira',
    email: 'passageiro@rotaspro.com',
    phone: '(11) 99876-5432',
    totalRides: 42,
    rating: 4.9
  },
  {
    id: '5',
    name: 'Ana Passageira',
    email: 'ana@rotaspro.com',
    phone: '(11) 98765-1234',
    totalRides: 15,
    rating: 4.7
  }
];

// Chaves de motorista
export const driverKeys = [
  {
    id: '1',
    key: 'DRIVER-KEY-123456',
    isUsed: true,
    usedBy: '2',
    createdAt: '2023-04-01T10:00:00Z'
  },
  {
    id: '2',
    key: 'DRIVER-KEY-789012',
    isUsed: true,
    usedBy: '4',
    createdAt: '2023-04-15T14:30:00Z'
  },
  {
    id: '3',
    key: 'DRIVER-KEY-345678',
    isUsed: false,
    usedBy: null,
    createdAt: '2023-05-01T09:15:00Z'
  }
];

// Funções auxiliares para simular API
export const getAllPassengers = () => {
  return Promise.resolve(passengers);
};

export const getAllDriverKeys = () => {
  return Promise.resolve(driverKeys);
};

export const createDriverKey = () => {
  const newKey = {
    id: `${driverKeys.length + 1}`,
    key: `DRIVER-KEY-${Math.floor(Math.random() * 1000000)}`,
    isUsed: false,
    usedBy: null,
    createdAt: new Date().toISOString()
  };
  
  driverKeys.push(newKey);
  return Promise.resolve(newKey);
};

export const deleteDriverKey = (keyId: string) => {
  const index = driverKeys.findIndex(key => key.id === keyId);
  if (index !== -1) {
    driverKeys.splice(index, 1);
  }
  return Promise.resolve({ success: true });
};
