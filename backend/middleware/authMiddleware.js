const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "not autorizied" });
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeData;
    next();
  } catch (e) {
    return res.status(400).json({ message: "error server!" });
  }
};
