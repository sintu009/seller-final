const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

const getAdminDashboardCounts = async (req, res) => {
  try {
    // USERS
    const [totalSellers, totalSuppliers] = await Promise.all([
      User.countDocuments({
        role: "seller",
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      }),
      User.countDocuments({
        role: "supplier",
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      }),
    ]);

    // Total products (not deleted OR isDelete field missing)
    const totalProducts = await Product.countDocuments({
      $and: [
        {
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      ],
    });

    const pendingProducts = await Product.countDocuments({
      approvalStatus: "pending",
      $and: [
        {
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      ],
    });

    // KYC
    const pendingKyc = await User.countDocuments({
      role: { $in: ["seller", "supplier"] },
      kycStatus: "pending",
    });

    const pendingOrders = await Order.countDocuments({
      status: "admin_review",
    });

    console.log("Pending Orders Count:", pendingOrders);

    res.status(200).json({
      success: true,
      data: {
        totalSellers,
        totalSuppliers,
        totalProducts,
        totalOrders: pendingOrders, // plug later
        totalRevenue: null, // plug later
        pendingApprovals: pendingProducts + pendingKyc,
        breakdown: {
          pendingProducts,
          pendingKyc,
          pendingOrders,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSellerDashboardCounts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Pending orders for this seller
    const pendingOrders = await Order.countDocuments({
      sellerId: sellerId,
      status: "admin_review",
    });

    res.status(200).json({
      success: true,
      data: {
        pendingOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupplierDashboardCounts = async (req, res) => {
  try {
    // Total products (not deleted OR isDelete field missing)
    const pendingProducts = await Product.countDocuments({
      approvalStatus: "pending",
      $and: [
        {
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      ],
    });

    const pendingOrders = await Order.countDocuments({
      status: "admin_review",
    });

    console.log("Pending Orders Count:", pendingOrders);

    res.status(200).json({
      success: true,
      data: {
        pendingProducts,
        pendingOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardCounts,
  getSellerDashboardCounts,
  getSupplierDashboardCounts,
};
