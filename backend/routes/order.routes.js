const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('seller'), orderController.createOrder);
router.get('/admin/all', protect, authorize('admin'), orderController.getOrdersForAdmin);
router.get('/supplier/my-orders', protect, authorize('supplier'), orderController.getOrdersForSupplier);
router.get('/seller/my-orders', protect, authorize('seller'), orderController.getOrdersForSeller);
router.get('/:id', protect, orderController.getOrderById);
router.get('/:id/history', protect, orderController.getOrderStatusHistory);
router.post('/:id/admin/approve', protect, authorize('admin'), orderController.adminApproveOrder);
router.post('/:id/admin/reject', protect, authorize('admin'), orderController.adminRejectOrder);
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;
