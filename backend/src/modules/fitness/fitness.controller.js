const db = require('../../db');

// ==================== ТРЕНИРОВКИ (CRUD) ====================
exports.getTrainings = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM trainings ORDER BY date, time ASC`);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getTrainings:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addTraining = async (req, res) => {
  try {
    const { title, description, trainerId, trainerName, date, time, duration, location, category, maxSpots } = req.body;
    const { rows } = await db.query(`
      INSERT INTO trainings (title, description, trainer_id, trainer_name, date, time, duration, location, category, max_spots)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `, [parseInt(trainerId), description, parseInt(trainerId), trainerName, date, time, parseInt(duration), location, category, parseInt(maxSpots)]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка addTraining:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, duration, location, category, maxSpots } = req.body;
    const { rows } = await db.query(`
      UPDATE trainings SET title = $1, description = $2, date = $3, time = $4, duration = $5, location = $6, category = $7, max_spots = $8
      WHERE id = $9 RETURNING *
    `, [title, description, date, time, parseInt(duration), location, category, parseInt(maxSpots), parseInt(id)]);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка updateTraining:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM trainings WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка deleteTraining:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== БРОНИРОВАНИЯ И ПОСЕЩЕНИЯ ====================
exports.getBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `SELECT * FROM bookings`;
    let values = [];
    if (userId) {
      query += ` WHERE user_id = $1`;
      values.push(parseInt(userId));
    }
    const { rows } = await db.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getBookings:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { userId, trainingId } = req.body;
    const uId = parseInt(userId);
    const tId = parseInt(trainingId);

    const { rows: [training] } = await db.query(`SELECT booked_spots, max_spots FROM trainings WHERE id = $1`, [tId]);
    if (!training) return res.status(404).json({ error: 'Тренировка не найдена' });
    if (Number(training.booked_spots) >= Number(training.max_spots)) return res.status(400).json({ error: 'Нет свободных мест!' });

    const { rows } = await db.query(
      `INSERT INTO bookings (user_id, training_id, status) VALUES ($1, $2, 'confirmed') RETURNING *`,
      [uId, tId]
    );
    await db.query(`UPDATE trainings SET booked_spots = booked_spots + 1 WHERE id = $1`, [tId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка createBooking:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const bId = parseInt(id);

    const { rows: [booking] } = await db.query(`SELECT training_id FROM bookings WHERE id = $1`, [bId]);
    if (!booking) return res.status(404).json({ error: 'Запись не найдена' });

    await db.query(`DELETE FROM bookings WHERE id = $1`, [bId]);
    await db.query(`UPDATE trainings SET booked_spots = GREATEST(0, booked_spots - 1) WHERE id = $1`, [booking.training_id]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка cancelBooking:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getVisits = async (req, res) => {
  try {
    const { userId } = req.query;
    const { rows } = await db.query(`SELECT * FROM visits WHERE user_id = $1 ORDER BY date DESC, time DESC`, [parseInt(userId)]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getVisits:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { bookingId, attended } = req.body;
    const bId = parseInt(bookingId);
    
    const { rows: [booking] } = await db.query(`
      SELECT b.user_id, b.training_id, t.title, t.date, t.time 
      FROM bookings b
      JOIN trainings t ON b.training_id = t.id
      WHERE b.id = $1
    `, [bId]);
    
    if (!booking) return res.status(404).json({ error: 'Запись не найдена' });

    const status = attended ? 'completed' : 'missed';
    await db.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, bId]);

    if (attended) {
      await db.query(`
        INSERT INTO visits (user_id, training_id, date, time, activity, check_in_time)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [booking.user_id, booking.training_id, booking.date, booking.time, booking.title, booking.time]);
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error("❌ Ошибка markAttendance:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== АБОНЕМЕНТЫ И ПОКУПКИ ====================
exports.getMembership = async (req, res) => {
  try {
    const { userId } = req.query;
    const { rows } = await db.query(
      `SELECT * FROM memberships WHERE user_id = $1 AND status = 'active' ORDER BY valid_until DESC LIMIT 1`,
      [parseInt(userId)]
    );
    res.json(rows[0] || null);
  } catch (error) {
    console.error("❌ Ошибка getMembership:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.purchaseMembership = async (req, res) => {
  try {
    const { userId, type } = req.body;
    const uId = parseInt(userId);
    const prices = { basic: 4990, premium: 7990, vip: 14990 };
    const price = prices[type];
    
    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    const visitsLeft = type === 'basic' ? '20' : 'unlimited';

    const { rows: [membership] } = await db.query(`
      INSERT INTO memberships (user_id, type, valid_from, valid_until, visits_left, status, price)
      VALUES ($1, $2, $3, $4, $5, 'active', $6) RETURNING *
    `, [uId, type, validFrom, validUntil, visitsLeft, price]);

    await db.query(`
      INSERT INTO purchases (user_id, type, item_id, amount)
      VALUES ($1, 'membership', $2, $3)
    `, [uId, String(membership.id), price]);

    res.status(201).json(membership);
  } catch (error) {
    console.error("❌ Ошибка purchaseMembership:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    const { userId } = req.query;
    const { rows } = await db.query(`SELECT * FROM purchases WHERE user_id = $1 ORDER BY date DESC`, [parseInt(userId)]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getPurchases:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ТРЕНЕРЫ И КЛИЕНТЫ ====================
exports.getTrainers = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM trainers ORDER BY name ASC`);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getTrainers:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addTrainer = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, bio } = req.body;
    const specs = Array.isArray(specialization) ? specialization : specialization.split(',').map((s) => s.trim());
    const { rows } = await db.query(`
      INSERT INTO trainers (name, email, phone, specialization, experience, bio)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [name, email, phone, specs, parseInt(experience), bio]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка addTrainer:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialization, experience, bio } = req.body;
    const specs = Array.isArray(specialization) ? specialization : specialization.split(',').map((s) => s.trim());
    const { rows } = await db.query(`
      UPDATE trainers SET name = $1, email = $2, phone = $3, specialization = $4, experience = $5, bio = $6
      WHERE id = $7 RETURNING *
    `, [name, email, phone, specs, parseInt(experience), bio, parseInt(id)]);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка updateTrainer:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM trainers WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка deleteTrainer:", error.message);
    res.status(500).json({ error: error.message });
  }
};

<<<<<<< HEAD
=======
// 👇 УМНЫЙ SQL ЗАПРОС: Автоматически находит всех клиентов, записанных к тренеру!
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
exports.getTrainerClients = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = parseInt(id);
    const { rows } = await db.query(`
      SELECT DISTINCT u.id, u.name, u.email, u.phone, u.status 
      FROM users u
      JOIN bookings b ON u.id = b.user_id
      JOIN trainings t ON b.training_id = t.id
      WHERE t.trainer_id = $1 AND b.status = 'confirmed'
      UNION
      SELECT u.id, u.name, u.email, u.phone, u.status 
      FROM users u
      JOIN trainer_clients tc ON u.id = tc.client_id
      WHERE tc.trainer_id = $1
    `, [trainerId]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getTrainerClients:", error.message);
    res.status(500).json({ error: error.message });
  }
};

<<<<<<< HEAD
// ==================== ПОЛЬЗОВАТЕЛЬСКИЕ ТРЕНИРОВКИ КБЖУ ====================
exports.getUserWorkouts = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(
      `SELECT * FROM user_workouts WHERE user_id = $1 AND date = $2 ORDER BY created_at DESC`,
      [parseInt(userId), targetDate]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getUserWorkouts:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addUserWorkout = async (req, res) => {
  try {
    const { userId, category, activityName, durationMinutes, burnedCalories, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { rows } = await db.query(`
      INSERT INTO user_workouts (user_id, category, activity_name, duration_minutes, burned_calories, date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [parseInt(userId), category, activityName, parseInt(durationMinutes), parseInt(burnedCalories), targetDate]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка addUserWorkout:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM user_workouts WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка deleteUserWorkout:", error.message);
    res.status(500).json({ error: error.message });
  }
};

=======
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
// ==================== АКЦИИ (CRUD) ====================
exports.getPromotions = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM promotions ORDER BY id DESC`);
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getPromotions:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const { title, description, discount, validFrom, validUntil } = req.body;
    const { rows } = await db.query(`
      INSERT INTO promotions (title, description, discount, valid_from, valid_until)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [title, description, parseInt(discount), validFrom, validUntil]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка createPromotion:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount, validFrom, validUntil, status } = req.body;
    const { rows } = await db.query(`
      UPDATE promotions SET title = $1, description = $2, discount = $3, valid_from = $4, valid_until = $5, status = $6
      WHERE id = $7 RETURNING *
    `, [title, description, parseInt(discount), validFrom, validUntil, status, parseInt(id)]);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка updatePromotion:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM promotions WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка deletePromotion:", error.message);
    res.status(500).json({ error: error.message });
  }
};
<<<<<<< HEAD
=======

// ==================== ПОЛЬЗОВАТЕЛЬСКИЕ ТРЕНИРОВКИ КБЖУ ====================
exports.getUserWorkouts = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(
      `SELECT * FROM user_workouts WHERE user_id = $1 AND date = $2 ORDER BY created_at DESC`,
      [parseInt(userId), targetDate]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Ошибка getUserWorkouts:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.addUserWorkout = async (req, res) => {
  try {
    const { userId, category, activityName, durationMinutes, burnedCalories, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { rows } = await db.query(`
      INSERT INTO user_workouts (user_id, category, activity_name, duration_minutes, burned_calories, date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [parseInt(userId), category, activityName, parseInt(durationMinutes), parseInt(burnedCalories), targetDate]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Ошибка addUserWorkout:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM user_workouts WHERE id = $1`, [parseInt(id)]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка deleteUserWorkout:", error.message);
    res.status(500).json({ error: error.message });
  }
};
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
