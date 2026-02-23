const Trip = require("../models/Trip");

exports.getAssignedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user.id }); // Assuming req.user from auth middleware
    res.json(trips);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.startTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ msg: "Trip not found" });
    trip.status = "in_progress";
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.completeTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ msg: "Trip not found" });
    trip.status = "completed";
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
