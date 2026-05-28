const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/role', authController.updateRole);
router.put('/profile', authController.updateProfile);
router.delete('/profile/:id', authController.deleteProfile);
router.get('/users', authController.getUsers);
router.put('/status', authController.toggleStatus);

module.exports = router;
