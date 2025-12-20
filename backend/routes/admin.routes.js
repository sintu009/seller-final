const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { approveProduct, rejectProduct, getAllProducts } = require('../controllers/product.controller');

router.use(protect);
router.use(authorize('admin'));

router.get('/products', getAllProducts);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);

module.exports = router;
