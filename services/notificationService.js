// services/notificationService.js
const Notification = require("../models/Notification");
const admin = require("firebase-admin");

// Safe initialization - runs ONLY when needed
let fcmReady = false;

const initFCM = () => {
  if (fcmReady || admin.apps.length > 0) return;

  const projectId = process.env.FCM_PROJECT_ID;
  const clientEmail = process.env.FCM_CLIENT_EMAIL;
  let privateKey = process.env.FCM_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "⚠️ FCM credentials missing in .env → Only database notifications will work for now",
    );
    return;
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    fcmReady = true;
    console.log("✅ Firebase Cloud Messaging (FCM) initialized successfully");
  } catch (err) {
    console.error("❌ FCM init failed:", err.message);
  }
};

exports.sendNotification = async (userId, message, type = "alert") => {
  initFCM(); // ← safe, never crashes

  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      read: false,
    });
    await notification.save();

    if (fcmReady) {
      console.log(`📲 FCM push ready for user ${userId}: ${message}`);
    } else {
      console.log(`💾 Notification saved to database only: ${message}`);
    }

    return notification;
  } catch (err) {
    console.error("Notification error:", err);
    throw err;
  }
};

exports.getNotifications = async (userId) => {
  try {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  } catch (err) {
    console.error(err);
    return [];
  }
};
