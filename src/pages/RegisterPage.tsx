import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
