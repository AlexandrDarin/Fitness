const db = require('../../db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    console.log(`Попытка регистрации: ${name} (${email})`); 
    
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone, status, weight, height, created_at as "createdAt"`,
      [name, email, password, role || 'client', phone || '']
    );
    
    console.log("✅ Успешно зарегистрирован:", rows[0].email);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ ОШИБКА БД ПРИ РЕГИСТРАЦИИ:", error.message);
    res.status(400).json({ error: 'Такой email уже существует или ошибка БД' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Попытка входа: ${email}`);
    
    const { rows } = await db.query(
      `SELECT id, name, email, phone, role, status, weight, height, created_at as "createdAt" FROM users WHERE email = $1 AND password = $2`, 
      [email, password]
    );
    
    if (rows.length === 0) {
      console.log("❌ Неверный пароль или email");
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    console.log("✅ Успешный вход:", rows[0].email);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ ОШИБКА БД ПРИ ВХОДЕ:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    await db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, id]);
    console.log(`✅ Роль пользователя ${id} изменена на ${role}`);
    res.json({ success: true, role });
  } catch (error) {
    console.error("❌ ОШИБКА ОБНОВЛЕНИЯ РОЛИ:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, name, email, phone, weight, height } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET name = $1, email = $2, phone = $3, weight = $4, height = $5 WHERE id = $6 RETURNING id, name, email, phone, role, status, weight, height, created_at as "createdAt"`,
      [name, email, phone, parseFloat(weight || 0), parseFloat(height || 0), id]
    );
    console.log("✅ Профиль обновлен:", name);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ ОШИБКА ОБНОВЛЕНИЯ ПРОФИЛЯ:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ ОШИБКА УДАЛЕНИЯ ПРОФИЛЯ:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, phone, role, status, weight, height, created_at as "createdAt" FROM users ORDER BY id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ ОШИБКА ПОЛУЧЕНИЯ ПОЛЬЗОВАТЕЛЕЙ:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET status = CASE WHEN status = 'active' THEN 'blocked' ELSE 'active' END WHERE id = $1 RETURNING status`,
      [id]
    );
    res.json({ success: true, status: rows[0].status });
  } catch (error) {
    console.error("❌ Ошибка изменения статуса:", error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
