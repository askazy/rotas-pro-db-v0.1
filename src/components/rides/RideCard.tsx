import React from 'react';
import Button from '../ui/Button';

interface RideCardProps {
  ride: {
    id: string;
    passengerId: string;
    driverId?: string;
    origin: string;
    destination: string;
    status: string;
    requestTime: string;
    passengerName?: string;
    driverName?: string;
  };
  userType: 'admin' | 'driver' | 'passenger';
  onAcceptRide?: () => void;
  onStartRide?: () => void;
  onCompleteRide?: () => void;
  onCancelRide?: () => void;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  userType,
  onAcceptRide,
  onStartRide,
  onCompleteRide,
  onCancelRide
}) => {
  // Formatar data de solicitação
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obter cor de status
  const getStatusColor = () => {
    switch (ride.status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduzir status
  const getStatusText = () => {
    switch (ride.status) {
      case 'requested':
        return 'Solicitada';
      case 'accepted':
        return 'Aceita';
      case 'in_progress':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return ride.status;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Solicitada em {formatDate(ride.requestTime)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ID: {ride.id.substring(0, 8)}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <span className="material-symbols-outlined text-green-600 mr-2">trip_origin</span>
            <div>
              <p className="text-xs text-gray-500">Origem</p>
              <p className="text-sm font-medium text-gray-900">{ride.origin}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="material-symbols-outlined text-red-600 mr-2">location_on</span>
            <div>
              <p className="text-xs text-gray-500">Destino</p>
              <p className="text-sm font-medium text-gray-900">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Informações específicas por tipo de usuário */}
        {userType === 'passenger' && ride.driverName && (
          <div className="flex items-center mb-4 p-2 bg-gray-50 rounded">
            <span className="material-symbols-outlined text-gray-600 mr-2">person</span>
            <div>
              <p className="text-xs text-gray-500">Motorista</p>
              <p className="text-sm font-medium text-gray-900">{ride.driverName}</p>
            </div>
          </div>
        )}

        {userType === 'driver' && ride.passengerName && (
          <div className="flex items-center mb-4 p-2 bg-gray-50 rounded">
            <span className="material-symbols-outlined text-gray-600 mr-2">person</span>
            <div>
              <p className="text-xs text-gray-500">Passageiro</p>
              <p className="text-sm font-medium text-gray-900">{ride.passengerName}</p>
            </div>
          </div>
        )}

        {/* Botões de ação baseados no tipo de usuário e status da corrida */}
        <div className="flex flex-wrap gap-2 mt-4">
          {userType === 'driver' && ride.status === 'requested' && onAcceptRide && (
            <Button 
              onClick={onAcceptRide}
              variant="success"
              size="sm"
              leftIcon={<span className="material-symbols-outlined">check</span>}
            >
              Aceitar
            </Button>
          )}

          {userType === 'driver' && ride.status === 'accepted' && onStartRide && (
            <Button 
              onClick={onStartRide}
              variant="primary"
              size="sm"
              leftIcon={<span className="material-symbols-outlined">play_arrow</span>}
            >
              Iniciar
            </Button>
          )}

          {userType === 'driver' && ride.status === 'in_progress' && onCompleteRide && (
            <Button 
              onClick={onCompleteRide}
              variant="success"
              size="sm"
              leftIcon={<span className="material-symbols-outlined">done_all</span>}
            >
              Concluir
            </Button>
          )}

          {(userType === 'passenger' || userType === 'driver') && 
           ['requested', 'accepted'].includes(ride.status) && 
           onCancelRide && (
            <Button 
              onClick={onCancelRide}
              variant="danger"
              size="sm"
              leftIcon={<span className="material-symbols-outlined">close</span>}
            >
              Cancelar
            </Button>
          )}

          {userType === 'admin' && (
            <Button 
              variant="info"
              size="sm"
              leftIcon={<span className="material-symbols-outlined">visibility</span>}
            >
              Detalhes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
