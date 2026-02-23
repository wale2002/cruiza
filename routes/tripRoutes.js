const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../utils/middleware"); // Assuming auth middleware

router.get("/assigned", auth, tripController.getAssignedTrips);
router.put("/:tripId/start", auth, tripController.startTrip);
router.put("/:tripId/complete", auth, tripController.completeTrip);

module.exports = router;
