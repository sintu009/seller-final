const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/all', protect, authorize('admin'), kycController.getAllKYC);
router.get('/pending', protect, authorize('admin'), kycController.getPendingKYC);
router.get('/pending/count', protect, authorize('admin'), kycController.getPendingKycCount);
router.get('/:id', protect, authorize('admin'), kycController.getKYCById);
router.put('/approve/:id', protect, authorize('admin'), kycController.approveKYC);
router.put('/reject/:id', protect, authorize('admin'), kycController.rejectKYC);
router.put('/documents', protect, kycController.updateKYCDocuments);

module.exports = router;
