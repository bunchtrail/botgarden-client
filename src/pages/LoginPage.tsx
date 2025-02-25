import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
