const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadProductImages } = require('../middleware/upload.middleware');

router.post('/', protect, authorize('supplier'), uploadProductImages, productController.createProduct);
router.get('/', protect, productController.getAllProducts);
router.get('/supplier', protect, authorize('supplier'), productController.getSupplierProducts);
router.put('/:productId', protect, authorize('supplier'), productController.updateProduct);
router.delete('/:productId', protect, authorize('supplier'), productController.deleteProduct);

module.exports = router;
