const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/pending', protect, authorize('admin'), kycController.getPendingKYC);
router.get('/all', protect, authorize('admin'), kycController.getAllKYC);
router.get('/:id', protect, authorize('admin'), kycController.getKYCById);
router.post('/:id/approve', protect, authorize('admin'), kycController.approveKYC);
router.post('/:id/reject', protect, authorize('admin'), kycController.rejectKYC);
router.put('/documents', protect, kycController.updateKYCDocuments);

module.exports = router;
