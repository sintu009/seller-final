const User = require("../models/user.model");

const getPendingKYC = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      kycStatus: "pending",
      role: { $in: ["seller", "supplier"] },
    }).select("-password");

    res.status(200).json({
      success: true,
      data: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllKYC = async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = { role: { $in: ["seller", "supplier"] } };

    if (status) {
      filter.kycStatus = status;
    }
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getKYCById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveKYC = async (req, res) => {
  try {
    const { plan, stores } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify admin KYC status",
      });
    }

    user.kycStatus = "approved";
    user.kycRejectionReason = undefined;

    if (user.role === "seller") {
      user.plan = plan;
      user.stores = stores;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "KYC approved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectKYC = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rejection reason",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify admin KYC status",
      });
    }

    user.kycStatus = "rejected";
    user.kycRejectionReason = reason;
    await user.save();

    res.status(200).json({
      success: true,
      message: "KYC rejected successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateKYCDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const kycData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin users do not need KYC",
      });
    }

    user.kycDocuments = {
      ...user.kycDocuments,
      ...kycData.kycDocuments,
    };

    if (kycData.phone) user.phone = kycData.phone;
    if (kycData.address) user.address = { ...user.address, ...kycData.address };

    user.kycStatus = "pending";
    user.kycRejectionReason = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "KYC documents updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingKycCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: { $in: ["seller", "supplier"] },
      kycStatus: "pending",
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPendingKYC,
  getAllKYC,
  getKYCById,
  approveKYC,
  rejectKYC,
  updateKYCDocuments,
  getPendingKycCount,
};
