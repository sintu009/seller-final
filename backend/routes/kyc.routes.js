const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/all', protect, authorize('admin'), kycController.getAllKYCRequests);
router.put('/approve/:userId', protect, authorize('admin'), kycController.approveKYC);
router.put('/reject/:userId', protect, authorize('admin'), kycController.rejectKYC);

module.exports = router;
