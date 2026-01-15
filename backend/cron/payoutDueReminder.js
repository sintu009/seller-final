const cron = require("node-cron");
const Payout = require("../models/payout.model.js");
const User = require("../models/user.model.js");
const createNotification = require("../utils/notification.helper.js");

// Run every day at 10 AM
cron.schedule("0 10 * * *", async () => {
  try {
    console.log("⏰ Checking payouts due in 2 days");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(23, 59, 59, 999);

    // Find payouts due in exactly 2 days
    const payouts = await Payout.find({
      dueDate: {
        $gte: today,
        $lte: targetDate,
      },
      payoutStatus: "pending",
      isDeleted: false,
      reminderSent: false,
    }).populate("order payee");

    if (!payouts.length) return;

    // Fetch admins
    const admins = await User.find({
      role: "admin",
      isActive: true,
    });

    for (const payout of payouts) {
      for (const admin of admins) {
        await createNotification({
          user: admin._id,
          title: "Payout Due Reminder",
          message: `Payout of ₹${payout.payableAmount} to ${payout.payee.name} is due in 2 days.`,
          type: "warning",
          entityType: "payout",
          entityId: payout._id,
        });
      }
    }

    // Mark reminders as sent
    await Payout.updateOne({ _id: payout._id }, { reminderSent: true });

    console.log("✅ Payout reminders sent");
  } catch (error) {
    console.error("❌ Payout reminder failed", error);
  }
});
