import { notificationConfig } from "./notification.js";

export const mapNotificationsForUI = (notifications) =>
  notifications.map((n) => {
    const entityConfig =
      notificationConfig[n.entityType] || notificationConfig.default;

    const typeConfig = entityConfig[n.type] || entityConfig.default;

    return {
      id: n._id,
      message: n.message,
      time: formatTimeAgo(n.createdAt),
      icon: typeConfig.icon,
      color: typeConfig.color,
      isRead: n.isRead,
    };
  });

const formatTimeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
