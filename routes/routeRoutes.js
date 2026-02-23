const express = require("express");
const router = express.Router();
const routeService = require("../services/routeService");

router.get("/", async (req, res) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
