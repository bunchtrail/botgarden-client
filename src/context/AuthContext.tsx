import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchCurrentUser,
  getCurrentUserFromStorage,
  getToken,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '../services/authService';
import { AuthState, LoginCredentials, RegisterData } from '../types/auth';

// Начальное состояние аутентификации
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Создаем тип для контекста
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Компонент-провайдер контекста аутентификации
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Функция для обновления состояния
  const updateState = (newState: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // Проверяем наличие сохраненного токена при загрузке
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const user = getCurrentUserFromStorage();

      if (token && user) {
        try {
          // Проверяем валидность токена, получая текущего пользователя
          const currentUser = await fetchCurrentUser();
          updateState({
            user: currentUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Если токен недействителен, очищаем localStorage
          logoutService();
          updateState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Сессия истекла. Пожалуйста, войдите снова.',
          });
        }
      } else {
        updateState({
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // Функция логина
  const login = async (credentials: LoginCredentials) => {
    updateState({ isLoading: true, error: null });

    try {
      const { user, token } = await loginService(credentials);
      updateState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Ошибка при входе в систему';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  // Функция регистрации
  const register = async (data: RegisterData) => {
    updateState({ isLoading: true, error: null });

    try {
      const { user, token } = await registerService(data);
      updateState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Ошибка при регистрации';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  // Функция выхода
  const logout = async () => {
    updateState({ isLoading: true });

    try {
      await logoutService();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      updateState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  // Значение контекста
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
