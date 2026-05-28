const express = require('express');
const cors = require('cors');

<<<<<<< HEAD
// Импортируем роутеры
const authRouter = require('./modules/auth/auth.router');
const kbjuRouter = require('./modules/kbju/kbju.router');
const fitnessRouter = require('./modules/fitness/fitness.router');

// Импортируем Swagger
const { swaggerUi, swaggerDocument } = require('./swagger');
=======
// Импортируем ВСЕ роутеры нашего распределенного монолита
const authRouter = require('./modules/auth/auth.router');
const kbjuRouter = require('./modules/kbju/kbju.router');
const fitnessRouter = require('./modules/fitness/fitness.router'); // 👈 Подключили фитнес!
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

<<<<<<< HEAD
// Регистрируем Swagger на адресе /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Маршруты монолита
app.use('/api/auth', authRouter);
app.use('/api/kbju', kbjuRouter);
app.use('/api/fitness', fitnessRouter);
=======
// Регистрируем маршруты в Express
app.use('/api/auth', authRouter);
app.use('/api/kbju', kbjuRouter);
app.use('/api/fitness', fitnessRouter); // 👈 Добавили обработку путей фитнеса
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`✅ Сервер Фитнес-Клуба запущен на порту ${PORT}`);
  console.log(`🔑 Авторизация: http://localhost:${PORT}/api/auth`);
  console.log(`🍎 КБЖУ: http://localhost:${PORT}/api/kbju`);
<<<<<<< HEAD
  console.log(`💪 Фитнес: http://localhost:${PORT}/api/fitness`);
  console.log(`📖 Документация API (Swagger): http://localhost:${PORT}/api-docs 👈 ТВОЯ ССЫЛКА!`);
=======
  console.log(`💪 Фитнес (Записи, Тренеры, Акции): http://localhost:${PORT}/api/fitness`); // 👈 Теперь лог выведет и фитнес!
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
});
