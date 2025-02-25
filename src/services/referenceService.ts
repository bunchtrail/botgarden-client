import api from './api';
import { Family, Location } from '../types';

// Получение списка семейств растений
export const getFamilies = async (): Promise<Family[]> => {
  const response = await api.get('/families');
  return response.data;
};

// Создание нового семейства
export const createFamily = async (name: string): Promise<Family> => {
  const response = await api.post('/families', { name });
  return response.data;
};

// Обновление семейства
export const updateFamily = async (id: number, name: string): Promise<Family> => {
  const response = await api.put(`/families/${id}`, { name });
  return response.data;
};

// Удаление семейства
export const deleteFamily = async (id: number): Promise<void> => {
  await api.delete(`/families/${id}`);
};

// Получение списка местоположений (экспозиций)
export const getLocations = async (): Promise<Location[]> => {
  const response = await api.get('/locations');
  return response.data;
};

// Создание нового местоположения
export const createLocation = async (location: Omit<Location, 'id'>): Promise<Location> => {
  const response = await api.post('/locations', location);
  return response.data;
};

// Обновление местоположения
export const updateLocation = async (id: number, location: Partial<Location>): Promise<Location> => {
  const response = await api.put(`/locations/${id}`, location);
  return response.data;
};

// Удаление местоположения
export const deleteLocation = async (id: number): Promise<void> => {
  await api.delete(`/locations/${id}`);
}; 