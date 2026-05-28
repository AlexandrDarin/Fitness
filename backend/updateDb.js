const pool = require('./src/db');
const update = async () => {
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(200);`);
    console.log("✅ Колонка 'password' успешно добавлена в базу!");
  } catch(e) {
    console.log("❌ Ошибка:", e.message);
  } finally {
    process.exit();
  }
};
update();
