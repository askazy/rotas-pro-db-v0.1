// Serviço para gerenciar motoristas
import { drivers } from './mockData';

// Obter todos os motoristas
export const getAllDrivers = () => {
  return Promise.resolve(drivers);
};

// Obter motorista por ID
export const getDriverById = (driverId: string) => {
  const driver = drivers.find(d => d.id === driverId);
  return Promise.resolve(driver);
};

// Atualizar status do motorista
export const updateDriverStatus = (driverId: string, status: 'active' | 'inactive') => {
  const driver = drivers.find(d => d.id === driverId);
  
  if (driver) {
    driver.status = status;
  }
  
  return Promise.resolve(driver);
};

// Atualizar perfil do motorista
export const updateDriverProfile = (driverId: string, profileData: Partial<typeof drivers[0]>) => {
  const driver = drivers.find(d => d.id === driverId);
  
  if (driver) {
    Object.assign(driver, profileData);
  }
  
  return Promise.resolve(driver);
};
