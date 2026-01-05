const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

const { createNotification } = require("../utils/notification.helper");
const { uploadFilesToAzure } = require("../utils/azureUpload");

const createProduct = async (req, res) => {
  try {
    console.log("Product creation request received");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("User:", req.user);

    const supplierId = req.user.id;
    const user = await User.findById(supplierId);

    if (!user) {
      console.log("User not found:", supplierId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User found:", {
      id: user._id,
      role: user.role,
      kycStatus: user.kycStatus,
    });

    if (user.role !== "supplier" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only suppliers and admins can create products",
      });
    }

    // Skip KYC check for admins, and for suppliers check if KYC is actually required
    if (user.role === "supplier") {
      console.log("Supplier KYC status check:", user.kycStatus);
      // Only block if KYC is explicitly rejected, allow pending and approved
      if (user.kycStatus === "rejected") {
        return res.status(403).json({
          success: false,
          message: "Your KYC was rejected. Please resubmit your KYC documents.",
        });
      }
    }

    //chech here if same product name exists for the same supplier
    const existingProduct = await Product.findOne({
      name: req.body.name,
      supplier: supplierId,
      isDeleted: { $ne: true },
    });

    if (existingProduct) {
      return res.status(403).json({
        success: false,
        message:
          "You already have a product with this name. Please choose a different name.",
      });
    }

    // ================= UPLOAD TO AZURE =================
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = await uploadFilesToAzure(req.files, "product-images");
    }

    console.log("Uploaded image URLs:", imageUrls);

    // ================= CREATE PRODUCT =================
    const productData = {
      ...req.body,
      supplier: supplierId,
      images: imageUrls,
    };

    console.log("Product data to create:", productData);

    const product = await Product.create(productData);
    await product.populate("supplier", "name email");

    console.log("Product created successfully:", product._id);

    if (user.role === "supplier" && global.io) {
      global.io.emit("NEW_PRODUCT_ADDED", {
        id: product._id,
        name: product.name,
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    console.error("Error stack:", error.stack);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { status, search, includeDeleted } = req.query;

    const filter = { supplier: supplierId };
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }

    if (includeDeleted !== "true") {
      filter.isDeleted = { $ne: true };
    }

    const products = await Product.find(filter)
      .populate("supplier", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductsForSellers = async (req, res) => {
  try {
    const { category, search, notified, includeDeleted } = req.query;

    const filter = {
      status: "active",
      approvalStatus: "approved",
      adminApproved: true,
    };
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }
    if (notified !== undefined) {
      filter.isNotifiedToSellers = notified === "true";
    }
    if (includeDeleted !== "true") {
      filter.isDeleted = { $ne: true };
    }

    const products = await Product.find(filter)
      .populate("supplier", "name email phoneNumber businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplier",
      "name email phone address"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.supplier.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    Object.assign(product, req.body);
    await product.save();
    await product.populate("supplier", "name email");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Authorization
    if (
      product.supplier.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // 🔒 Block deletion if product is used in non-rejected orders
    const activeOrderExists = await Order.exists({
      product: product._id,
      status: { $ne: "admin_rejected" },
    });

    if (activeOrderExists) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete product because it is associated with active orders",
      });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user.id;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const notifyProductToSellers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.supplier.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to notify this product",
      });
    }

    product.isNotifiedToSellers = true;
    product.notifiedAt = new Date();
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product notified to sellers successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { status, category, supplier, approvalStatus, includeDeleted } =
      req.query;
    const filter = {};

    if (includeDeleted !== "true") {
      filter.isDeleted = { $ne: true };
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (supplier) filter.supplier = supplier;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    const products = await Product.find(filter)
      .populate("supplier", "name email businessName phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { margin } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can approve products",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!margin || margin < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid margin amount",
      });
    }

    product.approvalStatus = "approved";
    product.adminApproved = true;
    product.approvedBy = req.user.id;
    product.approvedAt = new Date();
    product.margin = parseFloat(margin);
    product.finalPrice = parseFloat(product.price) + parseFloat(margin);

    await product.save();

    await createNotification({
      user: product.supplier,
      title: "Product Approved",
      message: `Your product "${product.name}" has been approved.`,
      type: "success",
      entityType: "product",
      entityId: product._id,
    });

    if (req.user.role === "admin" && global.io) {
      global.io.emit("PRODUCT_APPROVED", {
        id: product._id,
        name: product.name,
      });
    }

    await product.populate("supplier", "name email businessName phoneNumber");

    res.status(200).json({
      success: true,
      message: "Product approved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can reject products",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a rejection reason",
      });
    }

    product.approvalStatus = "rejected";
    product.adminApproved = false;
    product.rejectionReason = reason;
    product.approvedBy = req.user.id;
    product.approvedAt = new Date();

    await product.save();

    await createNotification({
      user: product.supplier,
      title: "Product Rejected",
      message: `Your product "${product.name}" was rejected. Reason: ${reason}`,
      type: "error",
      entityType: "product",
      entityId: product._id,
    });

    if (req.user.role === "admin" && global.io) {
      global.io.emit("PRODUCT_REJECTED", {
        id: product._id,
        name: product.name,
      });
    }

    await product.populate("supplier", "name email businessName phoneNumber");

    res.status(200).json({
      success: true,
      message: "Product rejected successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingProducts = async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view pending products",
      });
    }

    const pendingProducts = await Product.find({
      approvalStatus: "pending",
      adminApproved: false,
    })
      .populate("supplier", "name email businessName phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingProducts.length,
      data: pendingProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getSupplierProducts,
  getProductsForSellers,
  getPendingProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  notifyProductToSellers,
  getAllProducts,
  approveProduct,
  rejectProduct,
};
