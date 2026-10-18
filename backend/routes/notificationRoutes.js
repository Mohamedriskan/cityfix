const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/my", protect, notificationController.getMyNotifications);

router.get("/all", protect, allowRoles("Admin"), notificationController.getAllNotifications);

router.post("/", protect, allowRoles("Admin", "Officer"), notificationController.createNotification);

router.post("/campaign", protect, allowRoles("Admin"), notificationController.broadcastCampaign);

router.patch("/:id/read", protect, notificationController.markNotificationRead);

router.patch("/read-all", protect, notificationController.markAllRead);

router.delete("/:id", protect, notificationController.deleteNotification);

module.exports = router;
