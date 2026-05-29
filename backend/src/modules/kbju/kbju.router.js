const express = require('express');
const router = express.Router();
const kbjuController = require('./controllers/kbju.controller');

router.get('/products', kbjuController.searchProducts);
router.get('/diary', kbjuController.getDiary);
router.post('/diary', kbjuController.addDiaryEntry);
router.delete('/diary/:id', kbjuController.removeDiaryEntry);
router.get('/goals', kbjuController.getGoals);
router.put('/goals', kbjuController.updateGoals);
router.get('/stats/weekly', kbjuController.getWeeklyStats);

module.exports = router;