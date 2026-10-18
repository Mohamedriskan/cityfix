require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// serverless-http pre-populates req.body with the raw request Buffer,
// which makes express.json() skip parsing. Normalize it first.
app.use((req, res, next) => {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (Buffer.isBuffer(req.body)) {
    if (ct.includes("application/json")) {
      try {
        req.body = JSON.parse(req.body.toString("utf8") || "{}");
      } catch {
        req.body = {};
      }
      req._body = true;
    }
  } else if (req.body === undefined) {
    req.body = {};
  }
  next();
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("CityFix Backend Server is Running!");
});

app.get("/api/db-test", (req, res) => {
  db.query("SELECT NOW() AS currentTime", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }
    res.json({
      success: true,
      message: "Database connected successfully!",
      serverTime: results[0].currentTime,
    });
  });
});

app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
