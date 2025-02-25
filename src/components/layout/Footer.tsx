import React from 'react';
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi';
import { PiPlantFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Логотип и краткое описание */}
          <div className='md:col-span-1'>
            <Link to='/' className='flex items-center'>
              <PiPlantFill className='h-8 w-8 text-primary-600' />
              <span className='ml-2 text-xl font-serif font-semibold text-gray-900'>
                Ботанический Сад ВятГУ
              </span>
            </Link>
            <p className='mt-4 text-sm text-gray-600'>
              Заботимся о растениях и делимся знаниями о природных богатствах
              нашей планеты.
            </p>
          </div>

          {/* Ссылки */}
          <div>
            <h3 className='font-medium text-gray-900'>Информация</h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  to='/about'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  to='/visit'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Для посетителей
                </Link>
              </li>
              <li>
                <Link
                  to='/news'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Новости
                </Link>
              </li>
              <li>
                <Link
                  to='/research'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Исследования
                </Link>
              </li>
            </ul>
          </div>

          {/* Вторая колонка ссылок */}
          <div>
            <h3 className='font-medium text-gray-900'>Растения</h3>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  to='/plants'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Каталог растений
                </Link>
              </li>
              <li>
                <Link
                  to='/collections'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Коллекции
                </Link>
              </li>
              <li>
                <Link
                  to='/calendar'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Календарь цветения
                </Link>
              </li>
              <li>
                <Link
                  to='/rare-plants'
                  className='text-sm text-gray-600 hover:text-primary-600'
                >
                  Редкие виды
                </Link>
              </li>
            </ul>
          </div>

          {/* Контактная информация */}
          <div>
            <h3 className='font-medium text-gray-900'>Контакты</h3>
            <ul className='mt-4 space-y-2'>
              <li className='flex items-start'>
                <FiMapPin className='mt-1 h-5 w-5 text-gray-500' />
                <span className='ml-2 text-sm text-gray-600'>
                  ул. Карла Маркса, 95, Киров, Кировская обл., 610017
                </span>
              </li>
              <li className='flex items-center'>
                <FiPhone className='h-5 w-5 text-gray-500' />
                <span className='ml-2 text-sm text-gray-600'>
                  8 (833) 274-24-33
                </span>
              </li>
              <li className='flex items-center'>
                <FiMail className='h-5 w-5 text-gray-500' />
                <span className='ml-2 text-sm text-gray-600'>
                  botgarden@vyatsu.ru
                </span>
              </li>
              <li className='flex items-center mt-4 space-x-4'>
                <a
                  href='https://facebook.com/botgarden'
                  className='text-gray-500 hover:text-primary-600'
                >
                  <FiFacebook className='h-5 w-5' />
                </a>
                <a
                  href='https://instagram.com/botgarden'
                  className='text-gray-500 hover:text-primary-600'
                >
                  <FiInstagram className='h-5 w-5' />
                </a>
                <a
                  href='https://twitter.com/botgarden'
                  className='text-gray-500 hover:text-primary-600'
                >
                  <FiTwitter className='h-5 w-5' />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className='mt-12 border-t border-gray-200 pt-8'>
          <p className='text-center text-sm text-gray-500'>
            © {currentYear} Ботанический Сад ВятГУ. Все права защищены.
          </p>
          <div className='mt-4 flex justify-center space-x-6'>
            <Link
              to='/privacy'
              className='text-xs text-gray-500 hover:text-primary-600'
            >
              Политика конфиденциальности
            </Link>
            <Link
              to='/terms'
              className='text-xs text-gray-500 hover:text-primary-600'
            >
              Условия использования
            </Link>
            <Link
              to='/cookies'
              className='text-xs text-gray-500 hover:text-primary-600'
            >
              Политика cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
