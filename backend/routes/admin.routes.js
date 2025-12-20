const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

module.exports = router;
