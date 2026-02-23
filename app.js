const express = require("express");
const connectDB = require("./config/database");
const logger = require("./utils/logger");

const app = express();
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/tracking", require("./routes/trackingRoutes"));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ msg: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
