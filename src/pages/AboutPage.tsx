import React from 'react';
import { FiClock, FiMapPin, FiPhone } from 'react-icons/fi';
import Layout from '../components/layout/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif'>
            О Ботаническом саде ВятГУ
          </h1>
          <p className='mt-4 max-w-3xl mx-auto text-xl text-gray-500'>
            Уникальная коллекция растений и образовательное пространство
          </p>
        </div>

        {/* Основная информация */}
        <div className='bg-white shadow overflow-hidden rounded-lg mb-10'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Контактная информация
            </h2>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Как нас найти и связаться с нами
            </p>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-6'>
            <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2'>
              <div className='sm:col-span-1'>
                <dt className='text-sm font-medium text-gray-500 flex items-center'>
                  <FiMapPin className='mr-2 h-5 w-5 text-primary-500' />
                  Адрес
                </dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  ул. Карла Маркса, 95, Киров, Кировская обл., 610017
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-sm font-medium text-gray-500 flex items-center'>
                  <FiPhone className='mr-2 h-5 w-5 text-primary-500' />
                  Телефон
                </dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  8 (833) 274-24-33
                </dd>
              </div>
              <div className='sm:col-span-2'>
                <dt className='text-sm font-medium text-gray-500 flex items-center'>
                  <FiClock className='mr-2 h-5 w-5 text-primary-500' />
                  Часы работы
                </dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                    <div>Понедельник: Закрыто</div>
                    <div>Вторник: 10:00–21:00</div>
                    <div>Среда: 10:00–21:00</div>
                    <div>Четверг: 10:00–21:00</div>
                    <div>Пятница: 10:00–21:00</div>
                    <div>Суббота: 10:00–21:00</div>
                    <div>Воскресенье: 10:00–21:00</div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Льготы */}
        <div className='bg-white shadow overflow-hidden rounded-lg mb-10'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Льготное посещение
            </h2>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Категории посетителей, имеющих право на бесплатное посещение
            </p>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-6'>
            <div className='prose max-w-none'>
              <p className='text-sm text-gray-500 mb-4'>
                На бесплатное посещение имеют право (при наличии удостоверения,
                подтверждающего льготу):
              </p>
              <ul className='list-disc pl-5 text-sm text-gray-900 space-y-2'>
                <li>Сотрудники Института биологии и биотехнологии</li>
                <li>
                  Студенты ВятГУ при проведении учебных экскурсий
                  преподавателями университета согласно учебным планам (с
                  регистрацией в журнале учета Ботанического сада)
                </li>
                <li>Дети до 4-х лет включительно (в сопровождении взрослых)</li>
                <li>
                  Участники ВОВ, приравненные к ним, и участники боевых действий
                </li>
                <li>
                  Инвалиды I и II групп (один сопровождающий имеет право на
                  бесплатный вход, совместно с инвалидом)
                </li>
                <li>
                  Дети-инвалиды (один сопровождающий имеет право на бесплатный
                  вход, совместно с ребенком-инвалидом при предъявлении
                  удостоверения)
                </li>
                <li>
                  Посетители в инвалидных колясках (один сопровождающий имеет
                  право на бесплатный вход)
                </li>
                <li>
                  Сироты, воспитанники детских домов (при предъявлении
                  удостоверения, в сопровождении взрослых)
                </li>
                <li>
                  Многодетные семьи (3 и более детей, при предъявлении
                  удостоверения)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Стоимость услуг */}
        <div className='bg-white shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 sm:px-6 bg-primary-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Стоимость услуг
            </h2>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Цены на посещение и дополнительные услуги
            </p>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-6 overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Наименование услуги
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Пенсионеры, сотрудники музеев, студенты, дети 4-7 лет,
                    школьники
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Инвалиды, многодетные семьи, ветераны войн
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Остальные категории посетителей
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход без посещения с мастер-классом (зимнее время)
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>200,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>120,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>250,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) без экскурсии, мастер-класса, лекции
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>100,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Бесплатно ***
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>150,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с аудиоэкскурсией
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>180,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>100,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>180,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с экскурсией, лекцией С.М. Дождевых «Люди и
                    судьбы»
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>150,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>150,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>250,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с экскурсией, лекцией
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>180,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>150,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>230,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с экскурсией по оранжерее
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>200,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>180,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>230,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с мастер-классом
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>250,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>200,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>300,00</td>
                </tr>
                <tr>
                  <td className='px-3 py-4 text-sm text-gray-900'>
                    Вход (посещение) с квестом для детей (группа не менее 20
                    человек)
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-900'>-</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>200,00</td>
                  <td className='px-3 py-4 text-sm text-gray-900'>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
