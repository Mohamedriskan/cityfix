require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const FRONT_DEPTS = [
  "Roads Department",
  "Waste Management",
  "Water Supply",
  "Electricity",
  "Drainage",
  "Public Safety",
  "Parks & Recreation",
  "Sanitation",
];

const CATEGORIES = [
  { name: "Garbage & Waste", dept: "Waste Management" },
  { name: "Road & Potholes", dept: "Roads Department" },
  { name: "Streetlight Failures", dept: "Electricity" },
  { name: "Water Supply Disruptions", dept: "Water Supply" },
  { name: "Drainage & Flooding", dept: "Drainage" },
  { name: "Electricity Failures", dept: "Electricity" },
  { name: "Flood Alerts", dept: "Drainage" },
  { name: "Sewage & Sanitation", dept: "Sanitation" },
  { name: "Parks & Public Spaces", dept: "Parks & Recreation" },
  { name: "General Safety Hazards", dept: "Public Safety" },
];

const STATUSES = [
  "Completed", "Completed", "Working", "Assigned", "Verification", "Created",
  "Completed", "Working", "Completed", "Citizen Feedback",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const TITLES = [
  "Huge pothole near primary school gate",
  "Piles of garbage left uncollected near main junction",
  "Flickering streetlights creating safety hazards at night",
  "Low water pressure and brown water supply",
  "Heavy flooding along Galle Road during shower",
  "Frequent power cuts and high voltage spikes",
  "Rising canal levels and local overflow alert",
  "Broken drainage pipe spilling sewage onto walkway",
  "Overgrown bushes block access to kids playground park",
  "Hanging high voltage wire from public pole",
];

const COORDS = [
  { lat: 6.9271, lng: 79.8612 },
  { lat: 6.8973, lng: 79.8550 },
  { lat: 6.9030, lng: 79.8732 },
  { lat: 6.9405, lng: 79.8730 },
  { lat: 6.9152, lng: 79.8624 },
  { lat: 6.9322, lng: 79.8471 },
  { lat: 6.8791, lng: 79.8601 },
  { lat: 6.9080, lng: 79.8974 },
  { lat: 6.9011, lng: 79.8610 },
  { lat: 6.9189, lng: 79.8902 },
];

function run() {
  db.query("DELETE FROM comments");
  db.query("DELETE FROM issues");
  db.query("DELETE FROM departments");

  db.query("ALTER TABLE departments AUTO_INCREMENT = 1");

  const deptInserts = FRONT_DEPTS.map((name) => [name]);
  db.query(
    "INSERT INTO departments (name) VALUES ?",
    [deptInserts],
    (err) => {
      if (err) {
        console.error("Departments seed error:", err.message);
        return process.exit(1);
      }
      console.log("Departments seeded:", FRONT_DEPTS.length);

      seedIssues();
    }
  );
}

function seedIssues() {
  db.query("SELECT id, name FROM departments", (err, depts) => {
    if (err) return finish(err);
    const deptIdByName = {};
    depts.forEach((d) => (deptIdByName[d.name] = d.id));

    db.query("SELECT id, name, email, phone FROM users WHERE role='Citizen'", (err, citizens) => {
      if (err) return finish(err);
      const rows = [];
      for (let idx = 0; idx < 30; idx++) {
        const coord = COORDS[idx % COORDS.length];
        const jitterLat = coord.lat + (Math.random() - 0.5) * 0.015;
        const jitterLng = coord.lng + (Math.random() - 0.5) * 0.015;
        const citizen = citizens[idx % citizens.length];
        const cat = CATEGORIES[idx % CATEGORIES.length];
        const status = STATUSES[idx % STATUSES.length];
        const priority = PRIORITIES[idx % PRIORITIES.length];
        const ticketId = `CF-2026-${100452 + idx}`;
        const deptId = deptIdByName[cat.dept] || null;
        const dateOffset = 30 - idx;
        const created = new Date(Date.now() - dateOffset * 86400000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const imageColors = ["3b82f6", "8b5cf6", "10b981", "ef4444", "f59e0b", "ec4899", "14b8a6"];
        const image = `https://placehold.co/600x400/${imageColors[idx % imageColors.length]}/ffffff?text=${encodeURIComponent(cat.name)}`;

        rows.push([
          TITLES[idx % TITLES.length],
          `This is a mock description explaining the detail of ${cat.name}. Residents are experiencing inconveniences due to this issue, which has been ongoing for several days. Immediate intervention is requested to prevent further public safety concerns.`,
          cat.name,
          image,
          jitterLat.toFixed(8),
          jitterLng.toFixed(8),
          status,
          priority,
          citizen ? citizen.id : null,
          deptId,
          ticketId,
          created,
          created,
        ]);
      }

      db.query(
        "INSERT INTO issues (title, description, category, image, latitude, longitude, status, priority, user_id, department_id, ticket_id, created_at, updated_at) VALUES ?",
        [rows],
        (err) => finish(err, rows.length)
      );
    });
  });
}

function finish(err, n) {
  if (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
  console.log(`Issues seeded: ${n}`);
  process.exit(0);
}

run();
