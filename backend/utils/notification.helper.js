const Notification = require("../models/notification.model");

const createNotification = async ({
  user,
  title,
  message,
  type = "info",
  entityType = null,
  entityId = null,
}) => {
  const notification = await Notification.create({
    user,
    title,
    message,
    type,
    entityType,
    entityId,
  });

  // 🔔 REAL-TIME SOCKET EVENT
  if (global.io) {
    global.io.emit("NEW_NOTIFICATION", {
      _id: notification._id,
      user: notification.user,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      entityType: notification.entityType,
      entityId: notification.entityId,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

module.exports = {
  createNotification,
};
