import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Предполагаемый URL API
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок
    if (error.response) {
      console.error('Ошибка API:', error.response.data);
      
      // Обработка ошибок аутентификации
      if (error.response.status === 401) {
        // Редирект на страницу входа или другая логика
        console.error('Необходима аутентификация');
      }
    } else if (error.request) {
      console.error('Сервер не отвечает:', error.request);
    } else {
      console.error('Ошибка запроса:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 