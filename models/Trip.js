const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  time: { type: Date, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", TripSchema);
