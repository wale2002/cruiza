const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

exports.bookRide = async (tripId, userId, seats) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");
  // Check available seats logic (placeholder)
  const booking = new Booking({ user: userId, trip: tripId, seats });
  await booking.save();
  return booking;
};
