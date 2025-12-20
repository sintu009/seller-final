const User = require('../models/user.model');

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

module.exports = {
  getUserProfile,
  updateUserProfile
};
