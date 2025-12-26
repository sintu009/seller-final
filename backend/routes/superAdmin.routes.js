const express = require('express');
const router = express.Router();
const { createSuperAdmin } = require('../controllers/superAdmin.controller');

// ⚠️ Protect this route in production
router.post('/create', createSuperAdmin);

module.exports = router;