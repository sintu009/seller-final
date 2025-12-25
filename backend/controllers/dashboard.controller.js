const User = require('../models/user.model');
const Product = require('../models/product.model');


const getAdminDashboardCounts = async (req, res) => {
  try {
    // USERS
    const [totalSellers, totalSuppliers] = await Promise.all([
      User.countDocuments({
        role: 'seller',
         $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
          ],
      }),
      User.countDocuments({
        role: 'supplier',
        $or: [
          { isDeleted: false },
          { isDeleted: { $exists: false } },
        ],
      }),
    ]);

    // PRODUCTS
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({
      approvalStatus: 'pending',
    });

    // KYC
    const pendingKyc = await User.countDocuments({
      role: { $in: ['seller', 'supplier'] },
      kycStatus: 'pending',
    });

    res.status(200).json({
      success: true,
      data: {
        totalSellers,
        totalSuppliers,
        totalProducts,
        totalOrders: 0,      // plug later
        totalRevenue: null,  // plug later
        pendingApprovals: pendingProducts + pendingKyc,
        breakdown: {
          pendingProducts,
          pendingKyc,
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


module.exports = {
  getAdminDashboardCounts
};