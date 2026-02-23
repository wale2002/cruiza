const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Validate required env variables
const requiredVars = ["MONGO_URI", "JWT_SECRET", "GOOGLE_MAPS_API_KEY"];
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

module.exports = process.env;
