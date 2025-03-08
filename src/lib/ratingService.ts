// Serviço para gerenciar avaliações
import { rides } from './mockData';

// Avaliar um motorista
export const rateDriver = (rideId: string, rating: number, comment: string = '') => {
  const ride = rides.find(r => r.id === rideId);
  
  if (ride && ride.status === 'completed') {
    // Em um sistema real, isso seria salvo no banco de dados
    console.log(`Avaliação para corrida ${rideId}: ${rating} estrelas, comentário: ${comment}`);
    return Promise.resolve(true);
  }
  
  return Promise.resolve(false);
};

// Obter avaliação média de um motorista
export const getDriverAverageRating = (driverId: string) => {
  // Em um sistema real, isso seria calculado a partir do banco de dados
  return Promise.resolve(4.7);
};

// Obter avaliação média de um passageiro
export const getPassengerAverageRating = (passengerId: string) => {
  // Em um sistema real, isso seria calculado a partir do banco de dados
  return Promise.resolve(4.8);
};
