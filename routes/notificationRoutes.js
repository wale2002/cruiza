const express = require("express");
const router = express.Router();
const notificationService = require("../services/notificationService");
const auth = require("../utils/middleware");

router.get("/", auth, async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications(
      req.user.id,
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
