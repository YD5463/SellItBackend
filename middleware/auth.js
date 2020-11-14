const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  try {
    const payload = jwt.verify(token, config.get("jwtKey"));
    req.user = payload;
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
};
