const Route = require("../models/Route");

exports.getAllRoutes = async () => {
  return await Route.find();
};
