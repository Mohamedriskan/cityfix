const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");

// Add Comment - Protected
router.post(
    "/",
    protect,
    commentController.addComment
);

// Get Comments By Issue
router.get(
    "/issue/:issueId",
    commentController.getIssueComments
);

module.exports = router;
