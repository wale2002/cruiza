const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: [{ day: String, time: String }],
  pickupPoints: [String],
  destinations: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Route", RouteSchema);
