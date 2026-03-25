// utils/middleware.js
const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/secrets");

const auth = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    (req.header("Authorization") &&
      req.header("Authorization").replace("Bearer ", ""));

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, getJWTSecret());
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
