const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;
