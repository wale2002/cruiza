// config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Fix the deprecation warning forever
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // We don't exit(1) anymore so the server still runs for testing
  }
};

module.exports = connectDB;
