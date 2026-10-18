const db = require("../config/db");

exports.addComment = (req, res) => {
  const { issue_id, comment } = req.body;
  const user_id = req.user.id;

  if (!issue_id || !comment || !comment.trim()) {
    return res.status(400).json({
      success: false,
      message: "Issue ID and comment are required",
    });
  }

  db.query("SELECT id FROM issues WHERE id = ?", [issue_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    db.query(
      "INSERT INTO comments (issue_id, user_id, comment) VALUES (?, ?, ?)",
      [issue_id, user_id, comment.trim()],
      (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Server error." });
        }
        res.status(201).json({
          success: true,
          message: "Comment added successfully",
          commentId: result.insertId,
        });
      }
    );
  });
};

exports.getIssueComments = (req, res) => {
  const { issueId } = req.params;

  const sql = `
    SELECT comments.*, users.name AS user_name, users.role AS user_role
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.issue_id = ?
    ORDER BY comments.id DESC
  `;

  db.query(sql, [issueId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, comments: results });
  });
};
