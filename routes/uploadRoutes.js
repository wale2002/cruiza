// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../utils/uploadMiddleware");
const uploadService = require("../services/uploadService");
const auth = require("../utils/middleware"); // your existing JWT auth

// POST /api/upload/luggage
router.post(
  "/luggage",
  auth,
  upload.single("luggageImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No image file uploaded" });
      }

      const imageUrl = await uploadService.uploadLuggage(req.file.buffer);

      res.json({
        success: true,
        message: "Luggage image uploaded successfully",
        imageUrl,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Upload failed" });
    }
  },
);

module.exports = router;
