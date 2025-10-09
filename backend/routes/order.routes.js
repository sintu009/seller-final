const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('seller'), orderController.createOrder);
router.get('/', protect, orderController.getAllOrders);
router.get('/:orderId', protect, orderController.getOrderById);
router.put('/:orderId/status', protect, orderController.updateOrderStatus);
router.put('/:orderId/approve', protect, authorize('admin'), orderController.approveOrder);
router.put('/:orderId/reject', protect, authorize('admin'), orderController.rejectOrder);

module.exports = router;
