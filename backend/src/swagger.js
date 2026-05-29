const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'Wire Fitness API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:5005' }],
  paths: {
    // === AUTH ===
    '/api/auth/register': {
      post: { tags: ['🔑 Auth'], summary: 'Регистрация', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: {type: 'string'}, email: {type: 'string'}, password: {type: 'string'}, phone: {type: 'string'} }, example: { name: "Артем", email: "test@mail.ru", password: "123456", phone: "89990000000" } } } } }, responses: { 201: { description: 'OK' } } }
    },
    '/api/auth/login': {
      post: { tags: ['🔑 Auth'], summary: 'Вход', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: {type: 'string'}, password: {type: 'string'} }, example: { email: "ivan@example.com", password: "123456" } } } } }, responses: { 200: { description: 'OK' } } }
    },
    '/api/auth/profile': {
      put: { tags: ['🔑 Auth'], summary: 'Обновить профиль', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { id: {type: 'integer'}, name: {type: 'string'}, email: {type: 'string'}, phone: {type: 'string'}, weight: {type: 'number'}, height: {type: 'number'} } } } } }, responses: { 200: { description: 'OK' } } }
    },
    '/api/auth/profile/{id}': {
      delete: { tags: ['🔑 Auth'], summary: 'Удалить аккаунт', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
    },
    
    // === KBJU ===
    '/api/kbju/products': {
      get: { tags: ['🍎 КБЖУ'], summary: 'Поиск продуктов', parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } }
    },
    '/api/kbju/diary': {
      get: { tags: ['🍎 КБЖУ'], summary: 'Дневник за дату', parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'integer' } }, { name: 'date', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      post: { tags: ['🍎 КБЖУ'], summary: 'Добавить еду', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: {type: 'integer'}, product_id: {type: 'integer'}, grams: {type: 'integer'}, meal_type: {type: 'string'}, date: {type: 'string'} } } } } }, responses: { 201: { description: 'OK' } } }
    },
    '/api/kbju/diary/{id}': {
      delete: { tags: ['🍎 КБЖУ'], summary: 'Удалить запись', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
    },
    '/api/kbju/goals': {
      get: { tags: ['🍎 КБЖУ'], summary: 'Получить цели', parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['🍎 КБЖУ'], summary: 'Обновить цели', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: {type: 'integer'}, calories: {type: 'number'}, proteins: {type: 'number'}, fats: {type: 'number'}, carbs: {type: 'number'} } } } } }, responses: { 200: { description: 'OK' } } }
    },

    // === FITNESS ACTIVITY ===
    '/api/fitness/user-workouts': {
      get: { tags: ['💪 Активность'], summary: 'Список упражнений', parameters: [{ name: 'userId', in: 'query', required: true, schema: { type: 'integer' } }, { name: 'date', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'OK' } } },
      post: { tags: ['💪 Активность'], summary: 'Записать подход', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: {type: 'integer'}, category: {type: 'string'}, activityName: {type: 'string'}, durationMinutes: {type: 'integer'}, burnedCalories: {type: 'integer'}, date: {type: 'string'} } } } } }, responses: { 201: { description: 'OK' } } }
    },
    '/api/fitness/user-workouts/{id}': {
      delete: { tags: ['💪 Активность'], summary: 'Удалить подход', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
    },

    // === FITNESS CLUB ===
    '/api/fitness/trainings': {
      get: { tags: ['🏢 Клуб'], summary: 'Расписание' },
      post: { tags: ['🏢 Клуб'], summary: 'Создать тренировку', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { title: {type: 'string'}, description: {type: 'string'}, trainerId: {type: 'integer'}, trainerName: {type: 'string'}, date: {type: 'string'}, time: {type: 'string'}, duration: {type: 'integer'}, location: {type: 'string'}, category: {type: 'string'}, maxSpots: {type: 'integer'} } } } } }, responses: { 201: { description: 'OK' } } }
    },
    '/api/fitness/bookings': {
      get: { tags: ['🏢 Клуб'], summary: 'Список записей', parameters: [{ name: 'userId', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      post: { tags: ['🏢 Клуб'], summary: 'Записаться', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: {type: 'integer'}, trainingId: {type: 'integer'} } } } } }, responses: { 201: { description: 'OK' } } }
    },
    '/api/fitness/bookings/{id}': {
      delete: { tags: ['🏢 Клуб'], summary: 'Отменить запись', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
    },
    '/api/fitness/membership': {
      post: { tags: ['🏢 Клуб'], summary: 'Купить абонемент', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { userId: {type: 'integer'}, type: {type: 'string'} } } } } }, responses: { 201: { description: 'OK' } } }
    }
  }
};

module.exports = { swaggerUi, swaggerDocument };
