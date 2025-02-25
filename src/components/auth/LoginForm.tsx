import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { PiPlantFill } from 'react-icons/pi';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types/auth';

// Валидационная схема для формы входа
const loginSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно'),
  password: z.string().min(1, 'Пароль обязателен'),
});

// Тип данных формы
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError(null);
      await login(data as LoginCredentials);
    } catch (error: any) {
      setLoginError(
        error.response?.data?.message || 'Ошибка при входе в систему'
      );
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md'>
      <div className='flex flex-col items-center mb-6'>
        <PiPlantFill className='text-primary-600 text-5xl mb-2' />
        <h2 className='text-2xl font-serif font-bold text-center text-gray-800'>
          Вход в Ботанический Сад
        </h2>
        <p className='text-center text-gray-600 mt-1'>
          Введите ваши данные для входа в систему
        </p>
      </div>

      {(loginError || error) && (
        <div className='bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm'>
          {loginError || error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Имя пользователя
          </label>
          <input
            id='username'
            type='text'
            {...register('username')}
            className={`input ${errors.username ? 'border-red-500' : ''}`}
            placeholder='Введите имя пользователя'
            disabled={isLoading}
          />
          {errors.username && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Пароль
          </label>
          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`input pr-10 ${
                errors.password ? 'border-red-500' : ''
              }`}
              placeholder='Введите пароль'
              disabled={isLoading}
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.password.message}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-700'
            >
              Запомнить меня
            </label>
          </div>
          <div className='text-sm'>
            <button
              type='button'
              onClick={() =>
                console.log('Переход на страницу восстановления пароля')
              }
              className='font-medium text-primary-600 hover:text-primary-700'
            >
              Забыли пароль?
            </button>
          </div>
        </div>

        <button
          type='submit'
          className='btn-primary w-full flex justify-center'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Вход...
            </>
          ) : (
            'Войти'
          )}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Нет учетной записи?{' '}
          <a
            href='/register'
            className='font-medium text-primary-600 hover:text-primary-700'
          >
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
