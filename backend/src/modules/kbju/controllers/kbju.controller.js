const db = require('../../../db');

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q ? `SELECT * FROM products WHERE name ILIKE $1` : `SELECT * FROM products`;
    const values = q ? [`%${q}%`] : [];
    const { rows } = await db.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка searchProducts:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getDiary = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { rows } = await db.query(`
      SELECT d.id, d.grams, d.meal_type, p.id as product_id, p.name, p.calories_per_100g, p.proteins_per_100g, fats_per_100g, p.carbs_per_100g 
      FROM diary_entries d
      JOIN products p ON d.product_id = p.id
      WHERE d.user_id = $1 AND d.date = $2
      ORDER BY d.created_at DESC
    `, [parseInt(userId), targetDate]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getDiary:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.addDiaryEntry = async (req, res) => {
  try {
    const { userId, product_id, grams, meal_type, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { rows } = await db.query(
      `INSERT INTO diary_entries (user_id, product_id, grams, meal_type, date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [parseInt(userId), parseInt(product_id), parseInt(grams), meal_type, targetDate]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка addDiaryEntry:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.removeDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM diary_entries WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка removeDiaryEntry:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    const { rows } = await db.query(`SELECT calories, proteins, fats, carbs FROM kbju_goals WHERE user_id = $1`, [parseInt(userId)]);
    if (rows.length === 0) {
      return res.json({ calories: 2000, proteins: 120, fats: 67, carbs: 200 });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка getGoals:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateGoals = async (req, res) => {
  try {
    const { userId, calories, proteins, fats, carbs } = req.body;
    const uId = parseInt(userId);
    console.log(`[KBJU] Обновление целей: Калории=${calories}, Belki=${proteins}, Fats=${fats}, Carbs=${carbs}`);
    
    const { rows } = await db.query(`
      INSERT INTO kbju_goals (user_id, calories, proteins, fats, carbs)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE 
      SET calories = $2, proteins = $3, fats = $4, carbs = $5
      RETURNING calories, proteins, fats, carbs
    `, [uId, parseFloat(calories), parseFloat(proteins), parseFloat(fats), parseFloat(carbs)]);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка updateGoals:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const { userId } = req.query;
    const { rows } = await db.query(`
      SELECT 
        TO_CHAR(d.date, 'YYYY-MM-DD') as date,
        ROUND(SUM(p.calories_per_100g * d.grams / 100)) as calories,
        ROUND(SUM(p.proteins_per_100g * d.grams / 100), 1) as proteins,
        ROUND(SUM(p.fats_per_100g * d.grams / 100), 1) as fats,
        ROUND(SUM(p.carbs_per_100g * d.grams / 100), 1) as carbs
      FROM diary_entries d
      JOIN products p ON d.product_id = p.id
      WHERE d.user_id = $1 AND d.date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(d.date, 'YYYY-MM-DD')
      ORDER BY date ASC
    `, [parseInt(userId)]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getWeeklyStats:", error.message);
    res.status(500).json({ error: error.message });
  }
};
