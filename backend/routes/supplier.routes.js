const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const { uploadProductImages } = require("../middleware/upload.middleware");
const {
  createProduct,
  getSupplierProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  notifyProductToSellers,
} = require("../controllers/product.controller");

const {
  getSupplierDashboardCounts,
} = require("../controllers/dashboard.controller");

router.use(protect);
router.use(authorize("supplier", "admin"));

router.get("/dashboard-counts", getSupplierDashboardCounts);

router.post("/products", uploadProductImages, createProduct);
router.get("/products", getSupplierProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id/notify", notifyProductToSellers);

module.exports = router;
