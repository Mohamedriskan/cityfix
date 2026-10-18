const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

// Get All Departments
router.get("/", departmentController.getDepartments);

// Create Department - Protected
router.post(
    "/",
    protect,
    departmentController.createDepartment
);

module.exports = router;