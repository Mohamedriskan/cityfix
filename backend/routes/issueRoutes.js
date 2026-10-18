const express = require("express");
const router = express.Router();

const issueController = require("../controllers/issueController");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", issueController.getIssues);

router.get("/my/issues", protect, issueController.getMyIssues);

router.get("/dashboard/stats", protect, issueController.getDashboardStats);

router.get("/:id", issueController.getIssueById);

router.post("/", protect, upload.single("image"), issueController.createIssue);

router.put("/:id", protect, upload.single("image"), issueController.updateIssue);

router.patch(
  "/:id/status",
  protect,
  allowRoles("Officer", "Admin", "Citizen"),
  issueController.updateIssueStatus
);

router.patch(
  "/:id/department",
  protect,
  allowRoles("Admin"),
  issueController.assignDepartment
);

router.delete("/:id", protect, issueController.deleteIssue);

module.exports = router;
