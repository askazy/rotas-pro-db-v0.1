// Serviço para gerenciar chaves de motorista
import { driverKeys, createDriverKey as mockCreateDriverKey, deleteDriverKey as mockDeleteDriverKey } from './mockData';

// Obter todas as chaves de motorista
export const getAllDriverKeys = () => {
  return Promise.resolve(driverKeys);
};

// Criar uma nova chave de motorista
export const createDriverKey = () => {
  return mockCreateDriverKey();
};

// Excluir uma chave de motorista
export const deleteDriverKey = (keyId: string) => {
  return mockDeleteDriverKey(keyId);
};

// Verificar se uma chave é válida
export const validateDriverKey = (key: string) => {
  const driverKey = driverKeys.find(dk => dk.key === key && !dk.isUsed);
  return Promise.resolve(!!driverKey);
};

// Usar uma chave de motorista
export const useDriverKey = (key: string, driverId: string) => {
  const driverKey = driverKeys.find(dk => dk.key === key && !dk.isUsed);
  
  if (driverKey) {
    driverKey.isUsed = true;
    driverKey.usedBy = driverId;
    return Promise.resolve(true);
  }
  
  return Promise.resolve(false);
};
