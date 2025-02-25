import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VisitPage from './pages/VisitPage';
import { UserRole } from './types/auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/visit' element={<VisitPage />} />

          {/* Защищенные маршруты */}
          <Route
            path='/plants'
            element={
              <ProtectedRoute>
                <div>Страница растений</div>
              </ProtectedRoute>
            }
          />

          <Route
            path='/map'
            element={
              <ProtectedRoute>
                <div>Карта сада</div>
              </ProtectedRoute>
            }
          />

          {/* Маршруты с проверкой роли пользователя */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute requiredRoles={[UserRole.Admin]}>
                <div>Страница администратора</div>
              </ProtectedRoute>
            }
          />

          <Route
            path='/plants/add'
            element={
              <ProtectedRoute
                requiredRoles={[UserRole.Admin, UserRole.Botanist]}
              >
                <div>Добавление растения</div>
              </ProtectedRoute>
            }
          />

          {/* Страница "Доступ запрещен" */}
          <Route
            path='/forbidden'
            element={
              <div className='min-h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold text-red-500'>
                  Доступ запрещен
                </h1>
                <p className='mt-4 text-gray-600'>
                  У вас нет необходимых прав для доступа к этой странице.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className='mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700'
                >
                  Вернуться назад
                </button>
              </div>
            }
          />

          {/* Перенаправление для несуществующих маршрутов */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
