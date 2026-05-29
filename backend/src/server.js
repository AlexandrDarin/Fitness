const express = require('express');
const cors = require('cors');

// Импортируем роутеры
const authRouter = require('./modules/auth/auth.router');
const kbjuRouter = require('./modules/kbju/kbju.router');
const fitnessRouter = require('./modules/fitness/fitness.router');

// Импортируем Swagger
const { swaggerUi, swaggerDocument } = require('./swagger');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// Регистрируем Swagger на адресе /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Маршруты монолита
app.use('/api/auth', authRouter);
app.use('/api/kbju', kbjuRouter);
app.use('/api/fitness', fitnessRouter);

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`✅ Сервер Фитнес-Клуба запущен на порту ${PORT}`);
  console.log(`🔑 Авторизация: http://localhost:${PORT}/api/auth`);
  console.log(`🍎 КБЖУ: http://localhost:${PORT}/api/kbju`);
  console.log(`💪 Фитнес: http://localhost:${PORT}/api/fitness`);
  console.log(`📖 Документация API (Swagger): http://localhost:${PORT}/api-docs 👈 ТВОЯ ССЫЛКА!`);
});
