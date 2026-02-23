const Booking = require("../models/Booking");
const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res) => {
  const { tripId, seats } = req.body;
  try {
    const booking = await bookingService.bookRide(tripId, req.user.id, seats);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
