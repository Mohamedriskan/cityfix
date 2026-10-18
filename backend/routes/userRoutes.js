const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/", protect, allowRoles("Admin"), userController.getUsers);

router.patch("/:id/status", protect, allowRoles("Admin"), userController.toggleUserStatus);

module.exports = router;