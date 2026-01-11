const Payout = require("../models/payout.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "superadmin");
};

const createPayout = async (req, res) => {
  try {
    const admin = req.user;

    // 🔒 Admin check
    if (!isAdmin(admin)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can create payouts",
      });
    }

    const {
      order,
      payee,
      payeeRole,
      payableAmount,
      payoutMode,
      remarks,
      proofImages,
    } = req.body;

    // Validate payee
    const payeeUser = await User.findOne({
      _id: payee,
      role: payeeRole,
      isDeleted: false,
    });

    if (!payeeUser || !["seller", "supplier"].includes(payeeRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payee or payee role",
      });
    }

    // Validate order
    const orderExists = await Order.findById(order);
    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payout = await Payout.create({
      order,
      payer: admin._id,
      payee,
      payeeRole,
      payableAmount,
      payoutMode,
      remarks,
      proofImages,
      processedBy: admin._id,
    });

    res.status(201).json({
      success: true,
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPayouts = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all payouts",
      });
    }

    const payouts = await Payout.find({ isDeleted: false })
      .populate({
        path: "payee",
        select: "name role",
      })
      .populate({
        path: "order",
        select: "_id product",
        populate: {
          path: "product",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    // 🔹 Shape response
    const formattedPayouts = payouts.map((payout) => ({
      payoutId: payout._id,
      orderId: payout.order?._id || null,
      productName: payout.order?.product?.name || "N/A",
      userName: payout.payee?.name || "N/A",
      userRole: payout.payeeRole,
      payoutStatus: payout.payoutStatus,
      payableAmount: payout.payableAmount,
      paidAmount: payout.paidAmount,
      dueDate: payout.dueDate,
      createdAt: payout.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedPayouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayoutById = async (req, res) => {
  try {
    const user = req.user;

    const payout = await Payout.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("order payee payer processedBy");

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    // 🔒 Access control
    if (!isAdmin(user) && payout.payee.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePayout = async (req, res) => {
  try {
    const admin = req.user;

    if (!isAdmin(admin)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update payouts",
      });
    }

    const payout = await Payout.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found or deleted",
      });
    }

    const { paidAmount, payoutMode, referenceNumber, remarks, proofImages } =
      req.body;

    if (paidAmount !== undefined) payout.paidAmount = paidAmount;
    if (payoutMode) payout.payoutMode = payoutMode;
    if (referenceNumber) payout.referenceNumber = referenceNumber;
    if (remarks) payout.remarks = remarks;
    if (proofImages) payout.proofImages = proofImages;

    payout.processedBy = admin._id;

    await payout.save();

    res.status(200).json({
      success: true,
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePayout = async (req, res) => {
  try {
    const admin = req.user;

    if (!isAdmin(admin)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete payouts",
      });
    }

    const payout = await Payout.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found or already deleted",
      });
    }

    payout.isDeleted = true;
    payout.deletedAt = new Date();
    payout.deletedBy = admin._id;

    await payout.save();

    res.status(200).json({
      success: true,
      message: "Payout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPayouts = async (req, res) => {
  try {
    const user = req.user;

    if (!["seller", "supplier"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const payouts = await Payout.find({
      payee: user._id,
      payeeRole: user.role,
      isDeleted: false,
    })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayout,
  getAllPayouts,
  getPayoutById,
  updatePayout,
  deletePayout,
  getMyPayouts,
};
