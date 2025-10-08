const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('supplier'), productController.createProduct);
router.get('/supplier/my-products', protect, authorize('supplier'), productController.getSupplierProducts);
router.get('/seller/available', protect, authorize('seller'), productController.getProductsForSellers);
router.get('/admin/all', protect, authorize('admin'), productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);
router.post('/:id/notify', protect, productController.notifyProductToSellers);

module.exports = router;
