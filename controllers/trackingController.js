const trackingService = require("../services/trackingService");

exports.getLiveLocation = async (req, res) => {
  const { tripId } = req.params;
  try {
    const location = await trackingService.getLocation(tripId);
    res.json(location);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateLocation = async (req, res) => {
  const { tripId } = req.params;
  const { latitude, longitude } = req.body;
  try {
    await trackingService.updateLocation(tripId, latitude, longitude);
    res.json({ msg: "Location updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
