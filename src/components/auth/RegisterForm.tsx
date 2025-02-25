import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { PiPlantFill } from 'react-icons/pi';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { RegisterData, UserRole } from '../../types/auth';

// Валидационная схема для формы регистрации
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Имя пользователя должно содержать минимум 3 символа'),
    email: z.string().email('Введите корректный email адрес'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

// Тип данных формы
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.Viewer, // По умолчанию - роль "Зритель"
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setRegisterError(null);
      // Исключаем поле confirmPassword из данных для регистрации
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData as RegisterData);
    } catch (error: any) {
      setRegisterError(
        error.response?.data?.message || 'Ошибка при регистрации'
      );
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md'>
      <div className='flex flex-col items-center mb-6'>
        <PiPlantFill className='text-primary-600 text-5xl mb-2' />
        <h2 className='text-2xl font-serif font-bold text-center text-gray-800'>
          Регистрация в Ботаническом Саду
        </h2>
        <p className='text-center text-gray-600 mt-1'>
          Создайте учетную запись для доступа к системе
        </p>
      </div>

      {(registerError || error) && (
        <div className='bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm'>
          {registerError || error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Имя
            </label>
            <input
              id='firstName'
              type='text'
              {...register('firstName')}
              className={`input ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder='Введите имя'
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Фамилия
            </label>
            <input
              id='lastName'
              type='text'
              {...register('lastName')}
              className={`input ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder='Введите фамилию'
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Имя пользователя *
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
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Email *
          </label>
          <input
            id='email'
            type='email'
            {...register('email')}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder='Введите email'
            disabled={isLoading}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Пароль *
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

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Подтверждение пароля *
          </label>
          <div className='relative'>
            <input
              id='confirmPassword'
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`input pr-10 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              placeholder='Подтвердите пароль'
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Роль *
          </label>
          <select
            id='role'
            {...register('role')}
            className='input'
            disabled={isLoading}
          >
            <option value={UserRole.Viewer}>Посетитель</option>
            <option value={UserRole.Researcher}>Исследователь</option>
            <option value={UserRole.Botanist}>Ботаник</option>
          </select>
          {errors.role && (
            <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>
          )}
        </div>

        <div className='flex items-center'>
          <input
            id='terms'
            name='terms'
            type='checkbox'
            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
            required
          />
          <label htmlFor='terms' className='ml-2 block text-sm text-gray-700'>
            Я согласен с{' '}
            <button
              type="button"
              onClick={() => console.log('Переход на страницу с условиями использования')}
              className='text-primary-600 hover:text-primary-700'
            >
              условиями использования
            </button>
          </label>
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
              Регистрация...
            </>
          ) : (
            'Зарегистрироваться'
          )}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Уже зарегистрированы?{' '}
          <a
            href='/login'
            className='font-medium text-primary-600 hover:text-primary-700'
          >
            Войти
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
