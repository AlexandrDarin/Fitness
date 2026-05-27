const express = require('express');
const router = express.Router();
const fitnessController = require('./fitness.controller');

// Тренировки (CRUD)
router.get('/trainings', fitnessController.getTrainings);
router.post('/trainings', fitnessController.addTraining);
router.put('/trainings/:id', fitnessController.updateTraining);
router.delete('/trainings/:id', fitnessController.deleteTraining);

// Бронирования и визиты
router.get('/bookings', fitnessController.getBookings);
router.post('/bookings', fitnessController.createBooking);
router.delete('/bookings/:id', fitnessController.cancelBooking);
router.get('/visits', fitnessController.getVisits);
router.put('/attendance', fitnessController.markAttendance);

// Абонементы и покупки
router.get('/membership', fitnessController.getMembership);
router.post('/membership', fitnessController.purchaseMembership);
router.get('/purchases', fitnessController.getPurchases);

// Тренеры
router.get('/trainers', fitnessController.getTrainers);
router.post('/trainers', fitnessController.addTrainer);
router.put('/trainers/:id', fitnessController.updateTrainer);
router.delete('/trainers/:id', fitnessController.deleteTrainer);
router.get('/trainers/:id/clients', fitnessController.getTrainerClients);

// Акции (CRUD)
router.get('/promotions', fitnessController.getPromotions);
router.post('/promotions', fitnessController.createPromotion);
router.put('/promotions/:id', fitnessController.updatePromotion);
router.delete('/promotions/:id', fitnessController.deletePromotion);

module.exports = router;
