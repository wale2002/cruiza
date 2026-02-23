const Notification = require("../models/Notification");
const admin = require("firebase-admin"); // Assuming FCM setup

// Initialize FCM if not already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FCM_CLIENT_EMAIL,
    }),
  });
}

exports.sendNotification = async (userId, message, type) => {
  const notification = new Notification({ user: userId, message, type });
  await notification.save();
  // Send push via FCM (placeholder)
  console.log(`Push notification sent: ${message}`);
};

exports.getNotifications = async (userId) => {
  return await Notification.find({ user: userId });
};
