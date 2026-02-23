const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
