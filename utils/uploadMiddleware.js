// utils/uploadMiddleware.js
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // keeps file in memory (no disk)
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
