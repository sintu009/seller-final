const Store = require("../models/store.model");
const User = require("../models/user.model");

const isAdmin = (user) =>
  user && (user.role === "admin" || user.role === "superadmin");

/**
 * ✅ Connect Store (Seller / Admin)
 */
const connectStore = async (req, res) => {
  try {
    const user = req.user;

    const { platform, storeName, storeUrl, connectionType, credentials } =
      req.body;

    if (!platform || !storeName || !storeUrl) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 🔍 Check if user already has an active store
    const existingActiveStore = await Store.findOne({
      owner: user._id,
      isActive: true,
      isDeleted: false,
    });

    const store = await Store.create({
      owner: user._id,
      platform,
      storeName,
      storeUrl,
      connectionType,
      credentials,
      isActive: !existingActiveStore, // ⭐ auto-active only if none exists
    });

    res.status(201).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🔐 Admin – Get All Stores
 */
const getAllStores = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all stores",
      });
    }

    const stores = await Store.find({ isDeleted: false })
      .populate("owner", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * My Stores (Seller)
 */
const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({
      owner: req.user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Store By ID
 */
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("owner", "name role");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (
      !isAdmin(req.user) &&
      store.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Store
 */
const updateStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (
      !isAdmin(req.user) &&
      store.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    Object.assign(store, req.body);
    await store.save();

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Store (Soft Delete)
 */
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (
      !isAdmin(req.user) &&
      store.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    store.isDeleted = true;
    store.deletedAt = new Date();
    store.deletedBy = req.user._id;

    await store.save();

    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const setActiveStore = async (req, res) => {
  try {
    const user = req.user;
    const storeId = req.params.id;

    const store = await Store.findOne({
      _id: storeId,
      owner: user._id,
      isDeleted: false,
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // 🔁 Deactivate all other stores
    await Store.updateMany(
      { owner: user._id, isActive: true },
      { $set: { isActive: false } }
    );

    // ✅ Activate selected store
    store.isActive = true;
    await store.save();

    res.status(200).json({
      success: true,
      message: "Store activated successfully",
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  connectStore,
  getAllStores,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore,
  setActiveStore,
};
