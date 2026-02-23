const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../utils/middleware");

router.post("/", auth, bookingController.createBooking);
router.get("/", auth, bookingController.getBookings);

module.exports = router;
