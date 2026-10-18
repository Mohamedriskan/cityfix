const db = require("../config/db");

exports.getDepartments = (req, res) => {
  db.query("SELECT * FROM departments ORDER BY name", (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
    res.json({ success: true, departments: results });
  });
};

exports.createDepartment = (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Department name is required",
    });
  }

  db.query(
    "INSERT INTO departments (name) VALUES (?)",
    [name.trim()],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }
      res.status(201).json({
        success: true,
        message: "Department created successfully",
        departmentId: result.insertId,
      });
    }
  );
};
