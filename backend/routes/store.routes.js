const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");

const {
  connectStore,
  getAllStores,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore,
  setActiveStore,
} = require("../controllers/store.controller.js");

router.use(protect);
router.use(authorize("seller"));

router.post("/", connectStore);
router.get("/me", getMyStores);
router.get("/:id", getStoreById);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);
router.patch("/:id/activate", setActiveStore);

module.exports = router;
