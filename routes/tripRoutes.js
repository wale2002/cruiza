// const express = require("express");
// const router = express.Router();
// const tripController = require("../controllers/tripController");
// const auth = require("../utils/middleware"); // Assuming auth middleware

// router.get("/assigned", auth, tripController.getAssignedTrips);
// router.put("/:tripId/start", auth, tripController.startTrip);
// router.put("/:tripId/complete", auth, tripController.completeTrip);

// module.exports = router;

// routes/tripRoutes.js
const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const auth = require("../utils/middleware"); // ← we'll create this right now

// ==================== DRIVER PROTECTED ROUTES ====================
router.get("/assigned", auth, tripController.getAssignedTrips); // Driver sees his assigned trips
router.put("/:tripId/start", auth, tripController.startTrip); // Driver starts the trip
router.put("/:tripId/complete", auth, tripController.completeTrip); // Driver marks trip as completed

// You can add more routes later (student routes, etc.)
// router.get("/", tripController.getTrips);
// router.post("/", tripController.createTrip);

module.exports = router;
