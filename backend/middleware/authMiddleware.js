const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Attach the user's name from the database
    db.query(
      "SELECT name FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err || results.length === 0) {
          return next();
        }
        req.user.name = results[0].name;
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;
