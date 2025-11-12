const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("Токен відсутній або неправильно переданий");
      return res.status(400).json({ message: "not authorized" });
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeData;
    return next();
  } catch (e) {
    return res.status(400).json({ message: "error server!" });
  }
};
