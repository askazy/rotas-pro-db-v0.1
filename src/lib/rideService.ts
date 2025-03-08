// Serviço para gerenciar corridas
import { rides } from './mockData';

// Classe de serviço para gerenciar corridas
export class RideService {
  // Obter todas as corridas
  static getAllRides() {
    return Promise.resolve(rides);
  }

  // Obter corridas por usuário (passageiro ou motorista)
  static getRides(userId: string | undefined, userType: 'passenger' | 'driver' = 'passenger') {
    if (!userId) return Promise.resolve([]);
    
    const filteredRides = rides.filter(ride => 
      userType === 'passenger' 
        ? ride.passengerId === userId 
        : ride.driverId === userId
    );
    
    return Promise.resolve(filteredRides);
  }

  // Obter corridas disponíveis para motoristas
  static getAvailableRides() {
    const availableRides = rides.filter(ride => ride.status === 'requested' && !ride.driverId);
    return Promise.resolve(availableRides);
  }

  // Solicitar uma nova corrida
  static requestRide(rideData: {
    passengerId: string | undefined;
    origin: string;
    destination: string;
    requestTime: string;
  }) {
    const newRide = {
      id: `${Date.now()}`,
      passengerId: rideData.passengerId || '',
      driverId: null,
      origin: rideData.origin,
      destination: rideData.destination,
      status: 'requested',
      requestTime: rideData.requestTime,
      passengerName: 'Usuário Atual' // Em um sistema real, isso viria do banco de dados
    };
    
    rides.push(newRide);
    return Promise.resolve(newRide);
  }

  // Atualizar status de uma corrida
  static updateRideStatus(rideId: string, status: string, driverId?: string | undefined) {
    const ride = rides.find(r => r.id === rideId);
    
    if (ride) {
      ride.status = status;
      if (driverId && status === 'accepted') {
        ride.driverId = driverId;
        ride.driverName = 'Motorista Atual'; // Em um sistema real, isso viria do banco de dados
      }
    }
    
    return Promise.resolve(ride);
  }

  // Cancelar uma corrida
  static cancelRide(rideId: string) {
    return this.updateRideStatus(rideId, 'cancelled');
  }
}

// Funções individuais para compatibilidade com código existente
export const getAllRides = () => {
  return RideService.getAllRides();
};

export const getRides = (userId: string | undefined, userType: 'passenger' | 'driver' = 'passenger') => {
  return RideService.getRides(userId, userType);
};

export const getAvailableRides = () => {
  return RideService.getAvailableRides();
};

export const requestRide = (rideData: {
  passengerId: string | undefined;
  origin: string;
  destination: string;
  requestTime: string;
}) => {
  return RideService.requestRide(rideData);
};

export const updateRideStatus = (rideId: string, status: string, driverId?: string | undefined) => {
  return RideService.updateRideStatus(rideId, status, driverId);
};

export const cancelRide = (rideId: string) => {
  return RideService.cancelRide(rideId);
};
