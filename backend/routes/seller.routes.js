const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getProductsForSellers, getProductById } = require('../controllers/product.controller');

router.use(protect);
router.use(authorize('seller'));

router.get('/products', getProductsForSellers);
router.get('/products/:id', getProductById);

module.exports = router;
