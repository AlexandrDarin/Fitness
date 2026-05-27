const express = require('express');
const cors = require('cors');

// Импортируем ВСЕ роутеры нашего распределенного монолита
const authRouter = require('./modules/auth/auth.router');
const kbjuRouter = require('./modules/kbju/kbju.router');
const fitnessRouter = require('./modules/fitness/fitness.router'); // 👈 Подключили фитнес!

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// Регистрируем маршруты в Express
app.use('/api/auth', authRouter);
app.use('/api/kbju', kbjuRouter);
app.use('/api/fitness', fitnessRouter); // 👈 Добавили обработку путей фитнеса

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`✅ Сервер Фитнес-Клуба запущен на порту ${PORT}`);
  console.log(`🔑 Авторизация: http://localhost:${PORT}/api/auth`);
  console.log(`🍎 КБЖУ: http://localhost:${PORT}/api/kbju`);
  console.log(`💪 Фитнес (Записи, Тренеры, Акции): http://localhost:${PORT}/api/fitness`); // 👈 Теперь лог выведет и фитнес!
});
