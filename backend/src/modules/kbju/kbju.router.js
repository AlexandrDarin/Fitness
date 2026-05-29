const express = require('express');
const router = express.Router();
const kbjuController = require('./controllers/kbju.controller');

router.get('/products', kbjuController.searchProducts);
router.get('/diary', kbjuController.getDiary);
router.post('/diary', kbjuController.addDiaryEntry);
router.delete('/diary/:id', kbjuController.removeDiaryEntry);
router.get('/goals', kbjuController.getGoals);
router.put('/goals', kbjuController.updateGoals);
<<<<<<< HEAD
=======
router.get('/stats/weekly', kbjuController.getWeeklyStats); // 👈 Добавили путь аналитики!
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

module.exports = router;
