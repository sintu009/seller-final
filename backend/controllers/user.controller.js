const User = require('../models/user.model');
const { createNotification } = require('../utils/notification.helper');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const allowedUpdates = ['name', 'phoneNumber', 'businessName', 'address'];
    const actualUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        actualUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      actualUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { role, kycStatus } = req.query;
    const filter = {
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }, // 🔥 handles old data
      ],
    };
    
    if (role) filter.role = role;
    if (kycStatus) filter.kycStatus = kycStatus;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'active';
    await user.save();

    await createNotification({
      user: user._id,
      title: 'Account Approved',
      message: 'Your account has been approved successfully.',
      type: 'success',
      entityType: 'user', // ✅ valid enum
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'rejected';
    user.rejectionReason = reason;
    await user.save();

     await createNotification({
      user: user._id,
      title: 'Account Rejected',
      message: 'Your account has been rejected.',
      type: 'success',
      entityType: 'user',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'User rejected successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;
    console.log(reason);
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Block reason is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'blocked';
    user.isActive = false;
    user.blockedAt = new Date();
    user.blockReason = reason;
    await user.save();

    await createNotification({
      user: user._id,
      title: 'Account Blocked',
      message: 'Your account has been blocked.',
      type: 'success',
      entityType: 'user',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const unBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;
    console.log(reason);
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Unblock reason is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = 'active';
    user.isActive = true;
    user.blockedAt = new Date();
    user.blockReason = reason;
    await user.save();

    await createNotification({
      user: user._id,
      title: 'Account Unblocked',
      message: 'Your account has been unblocked successfully.',
      type: 'success',
      entityType: 'user',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      data: user
    });

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can delete users'
      });
    }

    const user = await User.findById(id);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isDeleted = true;
    user.deletedBy = req.user.id;
    user.deletedOn = new Date();
    user.isActive = false;
    user.status = 'blocked';

    await user.save();

    await createNotification({
      user: user._id,
      title: 'Account Deleted',
      message: 'Your account has been deleted successfully.',
      type: 'success',
      entityType: 'user',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully (soft delete)',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await User.findOne({
      _id: id,
      isDeleted: false,
    }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: 'User phone number not found. Cannot reset password.',
      });
    }

    // 🔐 Reset password = phone number
    user.password = user.phone;
    await user.save(); // pre-save hook hashes password

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Default password is user phone number.',
      data: {
        userId: user._id,
        email: user.email,
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
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  approveUser,
  rejectUser,
  blockUser,
  unBlockUser,
  deleteUser,
  resetUserPassword
};
