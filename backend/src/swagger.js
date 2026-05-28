const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Wire Fitness REST API',
    version: '1.0.0',
    description: 'Полная интерактивная спецификация всех эндпоинтов проекта (Распределенный монолит).'
  },
  servers: [{ url: 'http://localhost:5005' }],
  paths: {
    // ================= AUTH =================
    '/api/auth/register': { post: { summary: 'Регистрация пользователя', tags: ['🔑 Auth'] } },
    '/api/auth/login': { post: { summary: 'Вход в систему', tags: ['🔑 Auth'] } },
    '/api/auth/profile': { put: { summary: 'Обновить профиль (рост, вес, телефон)', tags: ['🔑 Auth'] } },
    '/api/auth/profile/{id}': { delete: { summary: 'Удалить аккаунт', tags: ['🔑 Auth'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] } },
    '/api/auth/users': { get: { summary: 'Получить всех пользователей (для Админа)', tags: ['🔑 Auth'] } },
    '/api/auth/status': { put: { summary: 'Заблокировать/разблокировать пользователя', tags: ['🔑 Auth'] } },
    '/api/auth/role': { put: { summary: 'Изменить роль пользователя', tags: ['🔑 Auth'] } },

    // ================= KBJU =================
    '/api/kbju/products': { get: { summary: 'Поиск продуктов', tags: ['🍎 КБЖУ (Питание)'] } },
    '/api/kbju/diary': { 
      get: { summary: 'Получить дневник за дату', tags: ['🍎 КБЖУ (Питание)'] },
      post: { summary: 'Добавить продукт в дневник', tags: ['🍎 КБЖУ (Питание)'] }
    },
    '/api/kbju/diary/{id}': { delete: { summary: 'Удалить продукт из дневника', tags: ['🍎 КБЖУ (Питание)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] } },
    '/api/kbju/goals': { 
      get: { summary: 'Получить суточные цели КБЖУ', tags: ['🍎 КБЖУ (Питание)'] },
      put: { summary: 'Обновить цели КБЖУ', tags: ['🍎 КБЖУ (Питание)'] }
    },
    '/api/kbju/stats/weekly': { get: { summary: 'Аналитика калорий за неделю', tags: ['🍎 КБЖУ (Питание)'] } },

    // ================= FITNESS WORKOUTS =================
    '/api/fitness/user-workouts': {
      get: { summary: 'Получить дневник силовых тренировок за день', tags: ['💪 Фитнес (Активность)'] },
      post: { summary: 'Записать силовую тренировку', tags: ['💪 Фитнес (Активность)'] }
    },
    '/api/fitness/user-workouts/{id}': { delete: { summary: 'Удалить тренировку', tags: ['💪 Фитнес (Активность)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] } },

    // ================= FITNESS CLUB =================
    '/api/fitness/trainings': {
      get: { summary: 'Расписание тренировок клуба', tags: ['🏢 Фитнес-клуб (Управление)'] },
      post: { summary: 'Добавить тренировку в расписание', tags: ['🏢 Фитнес-клуб (Управление)'] }
    },
    '/api/fitness/trainings/{id}': {
      put: { summary: 'Редактировать тренировку', tags: ['🏢 Фитнес-клуб (Управление)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] },
      delete: { summary: 'Удалить тренировку', tags: ['🏢 Фитнес-клуб (Управление)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] }
    },
    '/api/fitness/bookings': {
      get: { summary: 'Получить записи на тренировки', tags: ['🏢 Фитнес-клуб (Управление)'] },
      post: { summary: 'Записаться на тренировку', tags: ['🏢 Фитнес-клуб (Управление)'] }
    },
    '/api/fitness/bookings/{id}': { delete: { summary: 'Отменить запись', tags: ['🏢 Фитнес-клуб (Управление)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] } },
    '/api/fitness/attendance': { put: { summary: 'Отметить присутствие/пропуск', tags: ['🏢 Фитнес-клуб (Управление)'] } },
    '/api/fitness/visits': { get: { summary: 'История посещений клуба', tags: ['🏢 Фитнес-клуб (Управление)'] } },
    
    '/api/fitness/membership': {
      get: { summary: 'Текущий абонемент', tags: ['💳 Коммерция (Абонементы и Акции)'] },
      post: { summary: 'Купить абонемент', tags: ['💳 Коммерция (Абонементы и Акции)'] }
    },
    '/api/fitness/purchases': { get: { summary: 'История транзакций', tags: ['💳 Коммерция (Абонементы и Акции)'] } },
    
    '/api/fitness/promotions': {
      get: { summary: 'Список акций', tags: ['💳 Коммерция (Абонементы и Акции)'] },
      post: { summary: 'Создать акцию', tags: ['💳 Коммерция (Абонементы и Акции)'] }
    },
    '/api/fitness/promotions/{id}': {
      put: { summary: 'Редактировать акцию', tags: ['💳 Коммерция (Абонементы и Акции)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] },
      delete: { summary: 'Удалить акцию', tags: ['💳 Коммерция (Абонементы и Акции)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] }
    },

    '/api/fitness/trainers': {
      get: { summary: 'Список тренеров', tags: ['👥 Команда (Тренеры)'] },
      post: { summary: 'Добавить тренера', tags: ['👥 Команда (Тренеры)'] }
    },
    '/api/fitness/trainers/{id}': {
      put: { summary: 'Редактировать тренера', tags: ['👥 Команда (Тренеры)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] },
      delete: { summary: 'Удалить тренера', tags: ['👥 Команда (Тренеры)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] }
    },
    '/api/fitness/trainers/{id}/clients': { get: { summary: 'Получить клиентов тренера', tags: ['👥 Команда (Тренеры)'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] } },
    '/api/fitness/trainers/assign': { post: { summary: 'Назначить клиента тренеру', tags: ['👥 Команда (Тренеры)'] } }
  }
};

module.exports = { swaggerUi, swaggerDocument };
