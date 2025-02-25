import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import apiClient from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  GET_CURRENT_USER: '/auth/me',
};

// Сохранение данных пользователя в localStorage
const saveUserData = (data: AuthResponse): void => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

// Получение пользователя из localStorage
export const getCurrentUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Ошибка при парсинге данных пользователя:', error);
      return null;
    }
  }
  return null;
};

// Получение токена из localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Функция логина
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    saveUserData(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция регистрации
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);
    saveUserData(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция выхода
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
  } finally {
    // Даже если вызов API завершился с ошибкой, очищаем localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Получение текущего пользователя с сервера
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.GET_CURRENT_USER);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Проверка аутентификации пользователя
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getCurrentUserFromStorage();
};

const authService = {
  login,
  register,
  logout,
  fetchCurrentUser,
  isAuthenticated,
  getCurrentUserFromStorage,
  getToken,
};

export default authService; 