import { BiometryData, PaginatedResponse, PhenologyData, Plant, PlantFilters } from '../types';
import api from './api';

// Получение списка растений с пагинацией и фильтрацией
export const getPlants = async (page = 1, limit = 10, filters?: PlantFilters): Promise<PaginatedResponse<Plant>> => {
  const response = await api.get('/plants', {
    params: {
      page,
      limit,
      ...filters
    }
  });
  return response.data;
};

// Получение одного растения по ID
export const getPlantById = async (id: number): Promise<Plant> => {
  const response = await api.get(`/plants/${id}`);
  return response.data;
};

// Создание нового растения
export const createPlant = async (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plant> => {
  const response = await api.post('/plants', plant);
  return response.data;
};

// Обновление растения
export const updatePlant = async (id: number, plant: Partial<Plant>): Promise<Plant> => {
  const response = await api.put(`/plants/${id}`, plant);
  return response.data;
};

// Удаление растения
export const deletePlant = async (id: number): Promise<void> => {
  await api.delete(`/plants/${id}`);
};

// Получение фенологических данных для растения
export const getPhenologyData = async (plantId: number): Promise<PhenologyData[]> => {
  const response = await api.get(`/plants/${plantId}/phenology`);
  return response.data;
};

// Добавление фенологических данных
export const addPhenologyData = async (data: Omit<PhenologyData, 'id'>): Promise<PhenologyData> => {
  const response = await api.post(`/plants/${data.plantId}/phenology`, data);
  return response.data;
};

// Обновление фенологических данных
export const updatePhenologyData = async (id: number, data: Partial<PhenologyData>): Promise<PhenologyData> => {
  const response = await api.put(`/phenology/${id}`, data);
  return response.data;
};

// Получение биометрических данных для растения
export const getBiometryData = async (plantId: number): Promise<BiometryData[]> => {
  const response = await api.get(`/plants/${plantId}/biometry`);
  return response.data;
};

// Добавление биометрических данных
export const addBiometryData = async (data: Omit<BiometryData, 'id'>): Promise<BiometryData> => {
  const response = await api.post(`/plants/${data.plantId}/biometry`, data);
  return response.data;
};

// Обновление биометрических данных
export const updateBiometryData = async (id: number, data: Partial<BiometryData>): Promise<BiometryData> => {
  const response = await api.put(`/biometry/${id}`, data);
  return response.data;
};

// Экспорт данных в разные форматы
export const exportData = async (format: 'pdf' | 'excel' | 'word', filters?: PlantFilters): Promise<Blob> => {
  const response = await api.get(`/export/${format}`, {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
}; 