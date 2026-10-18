const db = require("../config/db");

exports.createIssue = (req, res) => {
  const { title, description, category, latitude, longitude, priority } = req.body;
  const user_id = req.user.id;
  const image = req.file ? req.file.filename : null;

  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, description and category are required.",
    });
  }

  const sql = `
    INSERT INTO issues (title, description, category, image, latitude, longitude, priority, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, category, image, latitude || null, longitude || null, priority || "Medium", user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      res.status(201).json({
        success: true,
        message: "Issue reported successfully",
        issueId: result.insertId,
      });
    }
  );
};

exports.getIssues = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;
  const category = req.query.category;

  let sql = `SELECT issues.*, users.name AS reporter_name, departments.name AS department_name
     FROM issues
     LEFT JOIN users ON issues.user_id = users.id
     LEFT JOIN departments ON issues.department_id = departments.id`;
  let countSql = "SELECT COUNT(*) AS total FROM issues";
  const params = [];
  const countParams = [];
  const conditions = [];

  if (status) {
    conditions.push("status = ?");
    params.push(status);
    countParams.push(status);
  }
  if (category) {
    conditions.push("category = ?");
    params.push(category);
    countParams.push(category);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    sql += where;
    countSql += where;
  }

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(countSql, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }

      res.json({
        success: true,
        issues: results,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit),
        },
      });
    });
  });
};

exports.getIssueById = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT issues.*, users.name AS reporter_name, departments.name AS department_name
     FROM issues
     LEFT JOIN users ON issues.user_id = users.id
     LEFT JOIN departments ON issues.department_id = departments.id
     WHERE issues.id = ?`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Issue not found" });
      }
      res.json({ success: true, issue: results[0] });
    }
  );
};

exports.updateIssue = (req, res) => {
  const { id } = req.params;
  const { title, description, category, latitude, longitude, priority } = req.body;
  const image = req.file ? req.file.filename : undefined;

  let sql = `UPDATE issues SET title = ?, description = ?, category = ?, latitude = ?, longitude = ?, priority = ?`;
  const params = [title, description, category, latitude || null, longitude || null, priority || "Medium"];

  if (image !== undefined) {
    sql += `, image = ?`;
    params.push(image);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.json({ success: true, message: "Issue updated successfully" });
  });
};

exports.deleteIssue = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM issues WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.json({ success: true, message: "Issue deleted successfully" });
  });
};

exports.updateIssueStatus = (req, res) => {
  const { id } = req.params;
  const { status, rating, feedbackComment } = req.body;

  const allowedStatus = ["Pending", "Created", "Verification", "Assigned", "Working", "In Progress", "Resolved", "Completed", "Citizen Feedback"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status." });
  }

  // Citizens may only close the loop by submitting feedback
  const actorRole = (req.user.role || "").toLowerCase();
  if (actorRole === "citizen" && status !== "Citizen Feedback") {
    return res.status(403).json({ success: false, message: "Citizens may only submit feedback." });
  }

  const isFeedback = status === "Citizen Feedback";
  const ratingVal = isFeedback && rating ? Number(rating) : null;
  const commentVal = isFeedback && feedbackComment ? feedbackComment : null;

  // Only update when the status (or feedback) actually changes
  db.query(
    `UPDATE issues
       SET status = ?, updated_at = NOW(), feedback_rating = ?, feedback_comment = ?
     WHERE id = ? AND status <> ?`,
    [status, ratingVal, commentVal, id, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      if (result.affectedRows === 0) {
        // Row not found, or status unchanged
        db.query("SELECT id FROM issues WHERE id = ?", [id], (selErr, selResult) => {
          if (selErr || selResult.length === 0) {
            return res.status(404).json({ success: false, message: "Issue not found" });
          }
          return res.json({ success: true, message: "Issue status is already up to date", changed: false });
        });
        return;
      }

      // Notify the citizen reporter about the status change
      db.query(
        `SELECT i.id, i.ticket_id, i.title, u.id AS reporter_id, u.name AS reporter_name
           FROM issues i
           LEFT JOIN users u ON i.user_id = u.id
          WHERE i.id = ?`,
        [id],
        (issueErr, issueResult) => {
          if (issueErr || issueResult.length === 0) {
            return res.status(403).json({ success: false, message: "Issue not found" });
          }
          const issue = issueResult[0];
          const reporterId = issue.reporter_id;
          const ticketId = issue.ticket_id || `CF-2026-${String(id).padStart(6, "0")}`;
          const text = `Your report ${ticketId} status changed to "${status}"`;
          db.query(
            `INSERT INTO notifications (user_id, text, type, ticket_id, issue_id, is_campaign)
             VALUES (?, ?, 'status', ?, ?, 0)`,
            [reporterId, text, ticketId, id],
            (notifErr) => {
              if (notifErr) {
                return res.status(500).json({ success: false, message: "Server error." });
              }
              res.json({ success: true, message: "Issue status updated successfully", changed: true });
            }
          );
        }
      );
    }
  );
};

exports.getMyIssues = (req, res) => {
  const user_id = req.user.id;

  db.query(`SELECT issues.*, users.name AS reporter_name, departments.name AS department_name
     FROM issues
     LEFT JOIN users ON issues.user_id = users.id
     LEFT JOIN departments ON issues.department_id = departments.id
     WHERE issues.user_id = ? ORDER BY issues.id DESC`, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, issues: results });
  });
};

exports.assignDepartment = (req, res) => {
  const { id } = req.params;
  const { department_id } = req.body;

  if (!department_id) {
    return res.status(400).json({ success: false, message: "Department ID is required" });
  }

  db.query(
    "UPDATE issues SET department_id = ?, status = 'Assigned', updated_at = NOW() WHERE id = ?",
    [department_id, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Issue not found" });
      }
      res.json({ success: true, message: "Issue assigned to department successfully" });
    }
  );
};

exports.getDashboardStats = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status = 'Pending') AS pending,
      SUM(status = 'Assigned') AS assigned,
      SUM(status = 'In Progress') AS in_progress,
      SUM(status = 'Resolved') AS resolved
    FROM issues
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, statistics: results[0] });
  });
};
