const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadNotificationCount,
  markSingleNotificationAsRead,
} = require("../controllers/notification.controller");

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read", markAsRead);
router.patch("/single-read/:id", markSingleNotificationAsRead);
router.put("/read-all", markAllAsRead);
router.get("/unread-count", getUnreadNotificationCount);

module.exports = router;
