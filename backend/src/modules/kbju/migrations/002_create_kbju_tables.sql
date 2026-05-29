CREATE TABLE IF NOT EXISTS food_categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  icon  VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS food_products (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(200) NOT NULL,
  category_id       INTEGER REFERENCES food_categories(id),
  calories_per_100g NUMERIC(8,2) NOT NULL,
  proteins_per_100g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fats_per_100g     NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_per_100g    NUMERIC(8,2) NOT NULL DEFAULT 0,
  is_custom         BOOLEAN DEFAULT false,
  created_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_approved       BOOLEAN DEFAULT true,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS food_diary_entries (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_product_id INTEGER NOT NULL REFERENCES food_products(id),
  amount_grams    NUMERIC(8,2) NOT NULL,
  meal_type       VARCHAR(20) CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nutrition_goals (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calories_goal  INTEGER DEFAULT 2000,
  proteins_goal  NUMERIC(6,1) DEFAULT 120,
  fats_goal      NUMERIC(6,1) DEFAULT 60,
  carbs_goal     NUMERIC(6,1) DEFAULT 250,
  updated_at     TIMESTAMP DEFAULT NOW()
);
