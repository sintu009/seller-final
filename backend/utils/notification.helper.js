const Notification = require('../models/notification.model');

const createNotification = async ({
  user,
  title,
  message,
  type = 'info',
  entityType = null,
  entityId = null,
}) => {
  return await Notification.create({
    user,
    title,
    message,
    type,
    entityType,
    entityId,
  });
};

module.exports = {
  createNotification,
};
