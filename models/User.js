// models/User.js
// UPDATED: Added firstName, lastName, phone (unique), university, and googleId (sparse for Google users)

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google users
  role: { type: String, enum: ["student", "driver"], required: true },
  phone: { type: String, required: true, unique: true }, // supports +234 Nigerian numbers
  university: { type: String, required: true }, // selected university for personalization
  verified: { type: Boolean, default: false }, // For drivers (as in original)
  googleId: { type: String, unique: true, sparse: true }, // for Google sign-in
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
