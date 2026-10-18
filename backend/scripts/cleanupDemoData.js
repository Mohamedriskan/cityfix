require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

if (process.env.DB_HOST && process.env.DB_HOST.includes("psdb.cloud")) {
  dbConfig.ssl = { rejectUnauthorized: true };
}

const db = mysql.createConnection(dbConfig);

const queries = [
  "DELETE FROM chat_messages",
  "DELETE FROM conversations",
  "DELETE FROM notifications",
  "DELETE FROM comments",
  "DELETE FROM issues",
  "ALTER TABLE issues AUTO_INCREMENT = 1",
];

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  const run = (idx) => {
    if (idx >= queries.length) {
      console.log("Demo data cleared successfully (issues, comments, notifications, conversations).");
      console.log("User accounts and departments were preserved.");
      db.end(() => process.exit(0));
      return;
    }
    db.query(queries[idx], (qErr, result) => {
      if (qErr) {
        console.error(`Cleanup error on "${queries[idx]}":`, qErr.message);
        db.end(() => process.exit(1));
        return;
      }
      console.log(`OK: ${queries[idx]} (${result.affectedRows ?? 0} rows)`);
      run(idx + 1);
    });
  };

  run(0);
});