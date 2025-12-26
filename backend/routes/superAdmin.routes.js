const express = require('express');
const router = express.Router();
const { createSuperAdmin,verifySuperAdmin } = require('../controllers/superAdmin.controller');

// ⚠️ Protect this route in production
router.post('/create', createSuperAdmin);
router.post('/verify', verifySuperAdmin);
module.exports = router;