const db = require("../config/db");

const normalizeNotification = (row) => ({
  id: row.id,
  userId: row.user_id,
  text: row.text,
  type: row.type,
  ticketId: row.ticket_id,
  issueId: row.issue_id,
  isCampaign: !!row.is_campaign,
  read: !!row.is_read,
  createdAt: row.created_at,
});

exports.getMyNotifications = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC, id DESC`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      res.json({ success: true, notifications: results.map(normalizeNotification) });
    }
  );
};

exports.getAllNotifications = (req, res) => {
  db.query(
    `SELECT n.*, u.name AS user_name, u.role AS user_role
     FROM notifications n
     LEFT JOIN users u ON n.user_id = u.id
     ORDER BY n.created_at DESC, n.id DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      const mapped = results.map((row) => ({
        ...normalizeNotification(row),
        userName: row.user_name,
        userRole: row.user_role,
      }));
      res.json({ success: true, notifications: mapped });
    }
  );
};

exports.createNotification = (req, res) => {
  const { userId, text, type, ticketId, issueId } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ success: false, message: "userId and text are required." });
  }

  db.query(
    `INSERT INTO notifications (user_id, text, type, ticket_id, issue_id, is_campaign) VALUES (?, ?, ?, ?, ?, 0)`,
    [userId, text, type || "info", ticketId || null, issueId || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      res.status(201).json({
        success: true,
        message: "Notification created successfully",
        notificationId: result.insertId,
      });
    }
  );
};

exports.broadcastCampaign = (req, res) => {
  const { text, type } = req.body;
  const adminId = req.user.id;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: "Message text is required." });
  }

  // Gather all citizen + officer recipient ids plus the admin
  db.query(
    `SELECT id FROM users WHERE role IN ('Citizen', 'Officer')`,
    (err, recipients) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }

      const ids = recipients.map((r) => r.id);
      // Always include admin so they get a copy of their own campaign
      if (!ids.includes(adminId)) ids.push(adminId);

      if (ids.length === 0) {
        return res.json({ success: true, message: "No recipients available", delivered: 0 });
      }

      const notifType = type || "info";
      const values = ids.map((id) => [id, text, notifType, null, null, 1]);

      db.query(
        `INSERT INTO notifications (user_id, text, type, ticket_id, issue_id, is_campaign) VALUES ?`,
        [values],
        (insertErr, result) => {
          if (insertErr) {
            return res.status(500).json({ success: false, message: "Server error." });
          }
          res.status(201).json({
            success: true,
            message: "Campaign notification broadcast successfully",
            delivered: values.length,
          });
        }
      );
    }
  );
};

exports.markNotificationRead = (req, res) => {
  const { id } = req.params;

  db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification marked as read" });
  });
};

exports.markAllRead = (req, res) => {
  const userId = req.user.id;

  db.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [userId], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, message: "All notifications marked as read" });
  });
};

exports.deleteNotification = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM notifications WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted successfully" });
  });
};
