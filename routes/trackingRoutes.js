const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const auth = require("../utils/middleware");

router.get("/:tripId", auth, trackingController.getLiveLocation);
router.put("/:tripId", auth, trackingController.updateLocation);

module.exports = router;
