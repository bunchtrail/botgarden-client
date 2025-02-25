import React from 'react';
import { PiFlowerFill, PiPlantFill, PiTreeFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Баннер */}
      <div className='relative bg-primary-800'>
        <div className='absolute inset-0'>
          <img
            className='w-full h-full object-cover opacity-30'
            src='https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            alt='Ботанический сад'
          />
          <div className='absolute inset-0 bg-primary-800 mix-blend-multiply' />
        </div>
        <div className='relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-serif'>
            Добро пожаловать в Ботанический Сад
          </h1>
          <p className='mt-6 max-w-3xl text-xl text-gray-100'>
            Исследуйте удивительное разнообразие флоры, насладитесь красотой
            природы и узнайте больше о растениях со всего мира.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6'>
            <Link
              to='/plants'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700'
            >
              Каталог растений
            </Link>
            <Link
              to='/map'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50'
            >
              Карта сада
            </Link>
          </div>
        </div>
      </div>

      {/* Секция "О нас" */}
      <div className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif'>
              О нашем ботаническом саде
            </h2>
            <p className='mt-4 max-w-2xl text-xl text-gray-500 mx-auto'>
              Наш сад - это уникальное собрание растений со всего мира, служащее
              целям сохранения, исследования и образования.
            </p>
          </div>

          <div className='mt-16'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <div className='flex flex-col items-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600'>
                  <PiPlantFill className='h-8 w-8' />
                </div>
                <h3 className='mt-4 text-lg font-medium text-gray-900'>
                  Коллекция растений
                </h3>
                <p className='mt-2 text-base text-gray-500 text-center'>
                  Более 5000 видов растений из различных климатических зон,
                  включая редкие и исчезающие виды.
                </p>
              </div>

              <div className='flex flex-col items-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600'>
                  <PiFlowerFill className='h-8 w-8' />
                </div>
                <h3 className='mt-4 text-lg font-medium text-gray-900'>
                  Исследования
                </h3>
                <p className='mt-2 text-base text-gray-500 text-center'>
                  Научная работа по изучению биоразнообразия, сохранению
                  генофонда и селекции растений.
                </p>
              </div>

              <div className='flex flex-col items-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600'>
                  <PiTreeFill className='h-8 w-8' />
                </div>
                <h3 className='mt-4 text-lg font-medium text-gray-900'>
                  Образование
                </h3>
                <p className='mt-2 text-base text-gray-500 text-center'>
                  Экскурсии, лекции и мастер-классы для посетителей всех
                  возрастов, интересующихся растениями.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Секция для привлечения к использованию каталога */}
      <div className='bg-primary-50 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-8 items-center'>
            <div>
              <h2 className='text-3xl font-extrabold text-gray-900 font-serif'>
                Исследуйте наш каталог растений
              </h2>
              <p className='mt-4 text-lg text-gray-500'>
                Наша система позволяет легко находить информацию о растениях, их
                местоположении в саду, фенологических наблюдениях и многом
                другом.
              </p>
              <div className='mt-8'>
                <Link
                  to='/plants'
                  className='btn-primary inline-flex items-center'
                >
                  Перейти к каталогу
                </Link>
              </div>
            </div>
            <div className='mt-12 lg:mt-0'>
              <div className='aspect-w-5 aspect-h-3 rounded-lg overflow-hidden shadow-xl'>
                <img
                  src='https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                  alt='Каталог растений'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
