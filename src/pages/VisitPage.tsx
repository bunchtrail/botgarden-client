import React from 'react';
import { FiClock, FiInfo, FiMapPin, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const VisitPage: React.FC = () => {
  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif'>
            Информация для посетителей
          </h1>
          <p className='mt-4 max-w-3xl mx-auto text-xl text-gray-500'>
            Всё, что нужно знать перед посещением Ботанического сада ВятГУ
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {/* Часы работы */}
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='px-4 py-5 sm:px-6 bg-primary-50'>
              <h2 className='text-lg font-medium text-gray-900 flex items-center'>
                <FiClock className='mr-2 h-5 w-5 text-primary-500' />
                Часы работы
              </h2>
            </div>
            <div className='px-4 py-5 sm:p-6'>
              <ul className='space-y-2 text-sm text-gray-700'>
                <li className='flex justify-between'>
                  <span>Понедельник:</span>
                  <span className='font-medium text-red-500'>Закрыто</span>
                </li>
                <li className='flex justify-between'>
                  <span>Вторник:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Среда:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Четверг:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Пятница:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Суббота:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Воскресенье:</span>
                  <span className='font-medium'>10:00–21:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Как добраться */}
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='px-4 py-5 sm:px-6 bg-primary-50'>
              <h2 className='text-lg font-medium text-gray-900 flex items-center'>
                <FiMapPin className='mr-2 h-5 w-5 text-primary-500' />
                Как добраться
              </h2>
            </div>
            <div className='px-4 py-5 sm:p-6'>
              <p className='text-sm text-gray-700 mb-4'>
                Ботанический сад ВятГУ расположен по адресу:
              </p>
              <p className='text-sm font-medium text-gray-900 mb-4'>
                ул. Карла Маркса, 95, Киров, Кировская обл., 610017
              </p>
              <p className='text-sm text-gray-700'>
                Вы можете добраться до нас на общественном транспорте или на
                личном автомобиле. Рядом с садом есть парковка для посетителей.
              </p>
            </div>
          </div>

          {/* Контакты */}
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='px-4 py-5 sm:px-6 bg-primary-50'>
              <h2 className='text-lg font-medium text-gray-900 flex items-center'>
                <FiPhone className='mr-2 h-5 w-5 text-primary-500' />
                Контакты
              </h2>
            </div>
            <div className='px-4 py-5 sm:p-6'>
              <p className='text-sm text-gray-700 mb-4'>
                Для получения дополнительной информации или бронирования
                экскурсий, пожалуйста, свяжитесь с нами:
              </p>
              <p className='text-sm font-medium text-gray-900 mb-2'>
                Телефон: 8 (833) 274-24-33
              </p>
              <p className='text-sm font-medium text-gray-900 mb-4'>
                Email: botgarden@vyatsu.ru
              </p>
              <p className='text-sm text-gray-700'>
                Мы будем рады ответить на все ваши вопросы и помочь спланировать
                ваш визит.
              </p>
            </div>
          </div>
        </div>

        {/* Правила посещения */}
        <div className='bg-white shadow rounded-lg overflow-hidden mb-12'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900 flex items-center'>
              <FiInfo className='mr-2 h-5 w-5 text-primary-500' />
              Правила посещения
            </h2>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <div className='prose max-w-none'>
              <p className='text-sm text-gray-700 mb-4'>
                Для комфортного и безопасного посещения Ботанического сада
                ВятГУ, пожалуйста, соблюдайте следующие правила:
              </p>
              <ul className='list-disc pl-5 text-sm text-gray-700 space-y-2'>
                <li>Не срывайте и не повреждайте растения</li>
                <li>Не кормите животных, обитающих на территории сада</li>
                <li>Соблюдайте чистоту и не оставляйте мусор</li>
                <li>Не курите на территории сада</li>
                <li>
                  Не приносите с собой еду и напитки (кроме воды в закрытых
                  бутылках)
                </li>
                <li>
                  Фотографировать можно без использования вспышки и штатива
                </li>
                <li>
                  Дети до 14 лет должны находиться под присмотром взрослых
                </li>
                <li>Соблюдайте тишину и не мешайте другим посетителям</li>
              </ul>
              <p className='text-sm text-gray-700 mt-4'>
                Благодарим за понимание и соблюдение правил!
              </p>
            </div>
          </div>
        </div>

        {/* Стоимость посещения */}
        <div className='bg-white shadow rounded-lg overflow-hidden mb-12'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Стоимость посещения
            </h2>
            <p className='mt-1 text-sm text-gray-500'>
              Цены на различные услуги и категории посетителей
            </p>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <p className='text-sm text-gray-700 mb-4'>
              Стоимость посещения зависит от выбранной услуги и категории
              посетителя. Подробную информацию о ценах вы можете найти на
              странице "О нас".
            </p>
            <div className='mt-4'>
              <Link
                to='/about'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700'
              >
                Узнать подробнее о ценах
              </Link>
            </div>
          </div>
        </div>

        {/* Экскурсии и мероприятия */}
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Экскурсии и мероприятия
            </h2>
            <p className='mt-1 text-sm text-gray-500'>
              Специальные программы для посетителей
            </p>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <p className='text-sm text-gray-700 mb-4'>
              Ботанический сад ВятГУ предлагает различные экскурсии, лекции и
              мастер-классы для посетителей всех возрастов:
            </p>
            <ul className='list-disc pl-5 text-sm text-gray-700 space-y-2'>
              <li>Обзорные экскурсии по саду</li>
              <li>Тематические экскурсии по коллекциям растений</li>
              <li>Экскурсии по оранжерее</li>
              <li>Лекции о растениях и ботанике</li>
              <li>Мастер-классы по садоводству и флористике</li>
              <li>Квесты для детей и школьников</li>
              <li>Специальная лекция С.М. Дождевых «Люди и судьбы»</li>
            </ul>
            <p className='text-sm text-gray-700 mt-4'>
              Для бронирования экскурсий и участия в мероприятиях, пожалуйста,
              свяжитесь с нами по телефону 8 (833) 274-24-33.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisitPage;
