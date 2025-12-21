const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('seller'), orderController.createOrder);
router.get('/admin', protect, authorize('admin'), orderController.getOrdersForAdmin);
router.get('/supplier', protect, authorize('supplier'), orderController.getOrdersForSupplier);
router.get('/seller', protect, authorize('seller'), orderController.getOrdersForSeller);
router.get('/:id', protect, orderController.getOrderById);
router.get('/:id/history', protect, orderController.getOrderStatusHistory);
router.put('/:id/status', protect, orderController.updateOrderStatus);
router.put('/:id/approve', protect, authorize('admin'), orderController.adminApproveOrder);
router.put('/:id/reject', protect, authorize('admin'), orderController.adminRejectOrder);

module.exports = router;
