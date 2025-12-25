const Notification = require('../models/notification.model');

// 🔔 Get logged-in user's notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔔 Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔔 Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
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
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationCount
};
