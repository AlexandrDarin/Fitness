-- 1. Пользователи
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'client',
  status VARCHAR(20) DEFAULT 'active',
  weight DECIMAL(5,2) DEFAULT 75.0,
  height DECIMAL(5,2) DEFAULT 180.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тестовые пользователи для показа
INSERT INTO users (name, email, password, role, phone, status, weight, height) VALUES 
('Иван Иванов', 'ivan@example.com', '123456', 'client', '+7 (495) 123-45-67', 'active', 78.5, 182),
('Мария Петрова', 'maria@example.com', '123456', 'trainer', '+7 (495) 234-56-78', 'active', 55.0, 168),
('Алексей Смирнов', 'alex@example.com', '123456', 'trainer', '+7 (495) 345-67-89', 'active', 95.0, 188),
('Елена Волкова', 'elena@example.com', '123456', 'trainer', '+7 (495) 456-78-90', 'active', 52.0, 164),
('Администратор Системы', 'admin@WireFitness.com', 'admin123', 'admin', '+7 (495) 100-00-00', 'active', 80.0, 180),
('Анна Соколова', 'anna@example.com', '123456', 'client', '+7 (495) 567-89-01', 'active', 60.0, 170)
ON CONFLICT DO NOTHING;

-- 2. Тренеры
CREATE TABLE IF NOT EXISTS trainers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  specialization TEXT[] NOT NULL,
  experience INT NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  bio TEXT,
  status VARCHAR(50) DEFAULT 'active'
);

-- Наполняем тренеров
INSERT INTO trainers (id, name, email, phone, specialization, experience, rating, bio, status) VALUES
(2, 'Мария Петрова', 'maria@wirefitness.ru', '+7 (495) 234-56-78', ARRAY['Групповые тренировки', 'Функциональный тренинг', 'Растяжка'], 8, 5.0, 'Сертифицированный тренер по функциональному тренингу.', 'active'),
(3, 'Алексей Смирнов', 'alexey@wirefitness.ru', '+7 (495) 123-45-67', ARRAY['Силовой тренинг', 'Пауэрлифтинг', 'Реабилитация'], 12, 5.0, 'Мастер спорта по пауэрлифтингу.', 'active'),
(4, 'Елена Волкова', 'elena@wirefitness.ru', '+7 (495) 456-78-90', ARRAY['Йога', 'Пилатес', 'Стретчинг'], 6, 4.9, 'Сертифицированный инструктор по йоге.', 'active')
ON CONFLICT DO NOTHING;

-- 3. Связующая таблица Тренер-Клиент (многие-ко-многим)
CREATE TABLE IF NOT EXISTS trainer_clients (
  trainer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (trainer_id, client_id)
);

-- Привязка клиентов к тренерам
INSERT INTO trainer_clients (trainer_id, client_id) VALUES (2, 1), (2, 6), (3, 1);

-- 4. Абонементы
CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- basic | premium | vip
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL,
  visits_left VARCHAR(50) DEFAULT 'unlimited',
  status VARCHAR(50) DEFAULT 'active',
  price INT NOT NULL
);

<<<<<<< HEAD
-- 5. Расписание тренировок
=======
-- 5. Расписание тренировок (Сразу привязываем к реальным ID тренеров 2, 3, 4!)
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
CREATE TABLE IF NOT EXISTS trainings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  trainer_id INT, 
  trainer_name VARCHAR(200),
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  duration INT NOT NULL,
  location VARCHAR(100),
  type VARCHAR(50) DEFAULT 'group',
  category VARCHAR(100),
  max_spots INT NOT NULL DEFAULT 10,
  booked_spots INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'scheduled',
  price INT
);

<<<<<<< HEAD
-- Наполняем расписание тренировок
INSERT INTO trainings (title, description, trainer_name, date, time, duration, location, type, category, max_spots, booked_spots)
VALUES 
('Функциональный тренинг', 'Комплексная тренировка для развития силы, выносливости и координации.', 'Мария Петрова', CURRENT_DATE, '18:00', 60, 'Групповой зал', 'group', 'Групповые', 15, 0),
('Йога', 'Практика асан для гибкости, баланса и внутренней гармонии.', 'Елена Волкова', CURRENT_DATE + 1, '19:00', 90, 'Зал йоги', 'group', 'Йога', 20, 0),
('HIIT тренировка', 'Высокоинтенсивная интервальная тренировка для жиросжигания.', 'Мария Петрова', CURRENT_DATE + 2, '17:00', 45, 'Групповой зал', 'group', 'Кардио', 15, 0),
('Силовая тренировка', 'Работа с весами для набора качественной мышечной массы.', 'Алексей Смирнов', CURRENT_DATE + 2, '11:00', 90, 'Тренажёрный зал', 'group', 'Силовые', 10, 0);
=======
-- Наполняем расписание тренировок (с реальными ID!)
INSERT INTO trainings (title, description, trainer_id, trainer_name, date, time, duration, location, type, category, max_spots, booked_spots)
VALUES 
('Функциональный тренинг', 'Комплексная тренировка для развития силы, выносливости и координации.', 2, 'Мария Петрова', CURRENT_DATE, '18:00', 60, 'Групповой зал', 'group', 'Групповые', 15, 0),
('Йога', 'Практика асан для гибкости, баланса и внутренней гармонии.', 4, 'Елена Волкова', CURRENT_DATE + 1, '19:00', 90, 'Зал йоги', 'group', 'Йога', 20, 0),
('HIIT тренировка', 'Высокоинтенсивная интервальная тренировка для жиросжигания.', 2, 'Мария Петрова', CURRENT_DATE + 2, '17:00', 45, 'Групповой зал', 'group', 'Кардио', 15, 0),
('Силовая тренировка', 'Работа с весами для набора качественной мышечной массы.', 3, 'Алексей Смирнов', CURRENT_DATE + 2, '11:00', 90, 'Тренажёрный зал', 'group', 'Силовые', 10, 0);
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

-- 6. Бронирования (Записи на занятия)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  training_id INT NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed | cancelled | completed | missed
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Посещения (История)
CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  training_id INT REFERENCES trainings(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  activity VARCHAR(200) NOT NULL,
  check_in_time VARCHAR(10) NOT NULL,
  check_out_time VARCHAR(10)
);

-- 8. Покупки (История транзакций)
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- membership | personal_training | group_training
  item_id VARCHAR(50) NOT NULL,
  amount INT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'paid', -- paid | pending | cancelled
  payment_method VARCHAR(100) DEFAULT 'Банковская карта'
);

-- 9. Акции и спецпредложения
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  discount INT NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active'
);

-- Наполняем акции
INSERT INTO promotions (title, description, discount, valid_from, valid_until, status) VALUES
('Весенняя скидка 20%', 'Скидка 20% на все абонементы при покупке до конца апреля', 20, CURRENT_DATE, CURRENT_DATE + 30, 'active'),
('Приведи друга', 'Приведи друга и получите оба скидку 15% на следующий месяц', 15, CURRENT_DATE, CURRENT_DATE + 60, 'active');

<<<<<<< HEAD
-- 10. Силовые тренировки КБЖУ
=======
-- 10. Силовые тренировки КБЖУ (УПРОЩЕННЫЙ ВАРИАНТ БЕЗ ПОДХОДОВ - ТОЛЬКО КАТЕГОРИИ, ВРЕМЯ И КАЛОРИИ!)
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
CREATE TABLE IF NOT EXISTS user_workouts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL, -- Кардио | Силовая | Йога | Единоборства | Бассейн
  activity_name VARCHAR(200) NOT NULL, -- Название упражнения
  duration_minutes INT NOT NULL DEFAULT 30, -- Время в минутах
  burned_calories INT NOT NULL, -- Сожженные ккал
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
-- 11. Твои таблицы (КБЖУ) — ДОБАВИЛИ ЧИСТУЮ КОЛОНКУ DATE!
=======
-- 11. Твои таблицы (КБЖУ)
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  calories_per_100g DECIMAL(7,2) NOT NULL,
  proteins_per_100g DECIMAL(5,2) DEFAULT 0,
  fats_per_100g DECIMAL(5,2) DEFAULT 0,
  carbs_per_100g DECIMAL(5,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  grams INT NOT NULL,
  meal_type VARCHAR(50),
<<<<<<< HEAD
  date DATE NOT NULL DEFAULT CURRENT_DATE, -- 👈 Чистая колонка даты без часовых поясов!
=======
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kbju_goals (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  calories DECIMAL(7,2) DEFAULT 2000,
  proteins DECIMAL(5,2) DEFAULT 120,
  fats DECIMAL(5,2) DEFAULT 67,
  carbs DECIMAL(5,2) DEFAULT 200
);

INSERT INTO products (name, calories_per_100g, proteins_per_100g, fats_per_100g, carbs_per_100g) 
VALUES 
('Куриная грудка (отварная)', 137, 29.8, 1.8, 0),
('Куриное филе (запеченное)', 150, 30.1, 3.2, 0),
('Куриная грудка (жареная на масле)', 197, 28.5, 9.2, 0),
('Куриное бедро (без кожи, отварное)', 170, 25.0, 8.0, 0),
('Заготовка с Фаршем Индейки', 181, 16.0, 7.3, 20.0),
('Яйцо куриное (отварное)', 157, 12.7, 11.5, 0.7),
('Овсянка на воде', 88, 3.0, 1.7, 15.0),
('Творог 5%', 121, 17.2, 5.0, 1.8),
('Банан', 95, 1.5, 0.2, 21.8),
('Кока-Кола (Coca-Cola)', 42, 0, 0, 10.6),
('Кола Зеро (Coca-Cola Zero)', 0.3, 0, 0, 0),
('Молоко 2.5% (Домик в деревне)', 53, 3.0, 2.5, 4.7),
('Бекон Орловский Варено-Копченый', 290, 14.0, 26.0, 0);
