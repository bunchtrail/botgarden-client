import React, { useState } from 'react';
import { FiChevronDown, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { PiPlantFill } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  // Определяем меню в зависимости от роли пользователя
  const getMenuItems = () => {
    // Базовое меню для всех пользователей
    const menuItems = [
      { label: 'Главная', path: '/' },
      { label: 'Растения', path: '/plants' },
      { label: 'Карта сада', path: '/map' },
    ];

    // Дополнительные элементы меню для ботаников и администраторов
    if (user?.role === UserRole.Botanist || user?.role === UserRole.Admin) {
      menuItems.push(
        { label: 'Добавить растение', path: '/plants/add' },
        { label: 'Управление областями', path: '/areas' }
      );
    }

    // Дополнительные элементы меню только для администраторов
    if (user?.role === UserRole.Admin) {
      menuItems.push(
        { label: 'Пользователи', path: '/users' },
        { label: 'Настройки', path: '/settings' }
      );
    }

    return menuItems;
  };

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Логотип и название */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center'>
              <PiPlantFill className='h-8 w-8 text-primary-600' />
              <span className='ml-2 text-xl font-serif font-semibold text-gray-900'>
                Ботанический Сад
              </span>
            </Link>
          </div>

          {/* Навигация - на десктопе */}
          <nav className='hidden md:flex items-center space-x-4'>
            {isAuthenticated &&
              getMenuItems().map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors'
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          {/* Правая панель с кнопками авторизации */}
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  onClick={toggleProfileDropdown}
                  className='flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none'
                >
                  <FiUser className='h-5 w-5' />
                  <span>{user?.firstName || user?.username}</span>
                  <FiChevronDown
                    className={`h-4 w-4 transition-transform ${
                      profileDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Выпадающее меню профиля */}
                {profileDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Профиль
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      <span className='flex items-center'>
                        <FiLogOut className='mr-2 h-4 w-4' />
                        Выйти
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium'
                >
                  Войти
                </Link>
                <Link to='/register' className='btn-primary'>
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Кнопка мобильного меню */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMobileMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none'
            >
              {mobileMenuOpen ? (
                <FiX className='h-6 w-6' />
              ) : (
                <FiMenu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white pt-2 pb-3 space-y-1 shadow-inner'>
          {isAuthenticated ? (
            <>
              {/* Информация о пользователе в мобильном меню */}
              <div className='px-4 py-2 border-b border-gray-200'>
                <div className='flex items-center'>
                  <div className='ml-3'>
                    <div className='text-base font-medium text-gray-800'>
                      {user?.firstName
                        ? `${user.firstName} ${user.lastName || ''}`
                        : user?.username}
                    </div>
                    <div className='text-sm font-medium text-gray-500'>
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Навигационные ссылки в мобильном меню */}
              {getMenuItems().map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className='block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}

              {/* Ссылка на профиль и кнопка выхода */}
              <Link
                to='/profile'
                className='block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                onClick={toggleMobileMenu}
              >
                Профиль
              </Link>
              <button
                onClick={() => {
                  toggleMobileMenu();
                  handleLogout();
                }}
                className='block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              >
                <span className='flex items-center'>
                  <FiLogOut className='mr-2 h-5 w-5' />
                  Выйти
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                onClick={toggleMobileMenu}
              >
                Войти
              </Link>
              <Link
                to='/register'
                className='block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                onClick={toggleMobileMenu}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
