const db = require("../config/db");

const mapUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone || "",
  role: (row.role || "").toLowerCase(),
  registeredDate: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "",
  status: row.status || "Active",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.name)}`,
});

exports.getUsers = (req, res) => {
  db.query("SELECT id, name, email, phone, role, created_at, status FROM users ORDER BY created_at DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, users: results.map(mapUser) });
  });
};

exports.toggleUserStatus = (req, res) => {
  const { id } = req.params;

  db.query("SELECT id, status FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentStatus = results[0].status === "Active" ? "Deactivated" : "Active";

    db.query("UPDATE users SET status = ? WHERE id = ?", [currentStatus, id], (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      res.json({
        success: true,
        message: "User status updated successfully",
        user: { id: Number(id), status: currentStatus },
      });
    });
  });
};