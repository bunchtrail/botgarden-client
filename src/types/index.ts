// Определение типов для приложения ботанического сада

// Тип пользователя
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

// Тип отдела
export type Department = 'dendrology' | 'flora' | 'floriculture';

// Тип семейства растений
export interface Family {
  id: number;
  name: string;
}

// Тип местоположения (экспозиции)
export interface Location {
  id: number;
  name: string;
  description?: string;
}

// Тип основной записи растения
export interface Plant {
  id: number;
  inventoryNumber: string;
  genus: string;
  species: string;
  cultivar?: string;
  familyId: number;
  family?: Family;
  locationId: number;
  location?: Location;
  department: Department;
  hasHerbarium: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Тип фенологических данных
export interface PhenologyData {
  id: number;
  plantId: number;
  year: number;
  floweringStart?: string;
  floweringEnd?: string;
  fruitingStart?: string;
  fruitingEnd?: string;
  leafingStart?: string;
  leafingEnd?: string;
  notes?: string;
}

// Тип биометрических данных
export interface BiometryData {
  id: number;
  plantId: number;
  date: string;
  height?: number;
  diameter?: number;
  flowerSize?: number;
  leafSize?: number;
  otherParameters?: Record<string, number | string>;
  notes?: string;
}

// Типы фильтров для поиска
export interface PlantFilters {
  department?: Department;
  familyId?: number;
  locationId?: number;
  genus?: string;
  species?: string;
  inventoryNumber?: string;
  hasHerbarium?: boolean;
}

// Типы для пагинации
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

// Тип ответа от API с пагинацией
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 