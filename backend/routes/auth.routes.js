const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadDocuments } = require('../middleware/upload.middleware');

router.post('/register', uploadDocuments, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
