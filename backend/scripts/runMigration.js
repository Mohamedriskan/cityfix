require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
};

if (process.env.DB_HOST && process.env.DB_HOST.includes("psdb.cloud")) {
  dbConfig.ssl = { rejectUnauthorized: true };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Migration connection failed:", err.message);
    process.exit(1);
  }

  console.log("Connected, applying migration...");

  // Read the SQL migration file
  const migrationSql = fs.readFileSync(
    path.join(__dirname, "..", "..", "database", "migrations", "001_notifications_messages.sql"),
    "utf8"
  );

  db.query(migrationSql, (sqlErr, results) => {
    if (sqlErr) {
      console.error("Migration SQL error:", sqlErr.message);
      process.exit(1);
    }
    console.log("Migration applied successfully.");
    db.end((e) => (e ? process.exit(1) : process.exit(0)));
  });
});
