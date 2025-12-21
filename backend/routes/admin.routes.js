const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { approveProduct, rejectProduct, getAllProducts } = require('../controllers/product.controller');
const { getAllUsers } = require('../controllers/user.controller');
const { getOrdersForAdmin, adminApproveOrder, adminRejectOrder } = require('../controllers/order.controller');

// Debug route without auth
router.get('/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Admin debug route working - no auth required',
    timestamp: new Date().toISOString()
  });
});

// Test route with minimal auth
router.get('/test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Admin test route with auth working',
    user: req.user ? { id: req.user.id, role: req.user.role } : null,
    timestamp: new Date().toISOString()
  });
});

// Orders route with detailed logging
router.get('/orders', protect, authorize('admin'), (req, res, next) => {
  console.log('Admin orders route hit!');
  console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
  getOrdersForAdmin(req, res, next);
});

// Apply auth middleware to remaining routes
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/products', getAllProducts);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);
router.put('/orders/:id/approve', adminApproveOrder);
router.put('/orders/:id/reject', adminRejectOrder);

module.exports = router;
