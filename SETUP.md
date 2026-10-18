# CityFix – Colombo Smart City Issue Reporting System
## Complete Setup Guide (Run on Another Laptop)

This ZIP contains the full project source code, both `node_modules` folders (frontend + backend), the MySQL database backup, and configuration files. Follow the steps below to run the system on any Windows laptop.

---

## 1. Requirements
- **Node.js** (v18 or later) – https://nodejs.org
- **XAMPP** (Apache + MySQL) – https://www.apachefriends.org
- A modern browser (Chrome / Edge)

## 2. Install & Start MySQL
1. Install XAMPP and open the **XAMPP Control Panel**.
2. Start the **MySQL** service (port 3306).
3. The database settings used by the backend (see `backend/.env`):
   - Host: `localhost` (127.0.0.1)
   - Port: `3306`
   - User: `root`
   - Password: *(empty)*
   - Database: `cityfix`

> If your MySQL uses a different root password, edit **`backend/.env`**:
> `DB_PASSWORD=yourpassword`

## 3. Restore the Database
Two ways (use either):

### Option A – phpMyAdmin (easiest)
1. Open `http://localhost/phpmyadmin` in a browser.
2. Go to **Import** tab.
3. Choose the file **`database/cityfix_backup.sql`**.
4. Press **Go**. The `cityfix` database and all its tables are created automatically.

### Option B – Command line
```
mysql -u root < database/cityfix_backup.sql
```
(or `mysql -u root -p < database/cityfix_backup.sql` if a password is set)

## 4. Start the Backend (port 5000)
Open a terminal in the project folder:
```
cd backend
npm start
```
You should see:
```
Server running on http://localhost:5000
MySQL Connected Successfully
```
> `node_modules` is already included, so **no `npm install` is required**. If you ever delete it, run `npm install` in `backend/` first.

## 5. Start the Frontend (port 5173)
Open a **second** terminal in the project folder:
```
npm run dev
```
Open **http://localhost:5173** in your browser.

> The frontend proxies API calls to `http://localhost:5000` automatically (`vite.config.js`), so both servers must be running.

## 6. Demo Accounts
All passwords are: **CityFix123**

| Role    | Email                |
|---------|----------------------|
| Admin   | admin@cityfix.demo   |
| Officer | officer@cityfix.demo |
| Citizen | citizen@cityfix.demo |

## 7. Key Features to Demonstrate
- Citizen reports an issue (with map location + optional image).
- Officer updates status: Created → Verification → Assigned → Working → Completed.
- Citizen submits feedback (rating) on completion → status becomes `Citizen Feedback`.
- Every status change sends a real-time notification to the citizen (updates on both screens automatically via live polling).
- Admin broadcast center sends campaign notifications to all users.
- Officer ↔ Citizen messaging console.
- SLA Monitoring & Escalation screens with deterministic SLA timers.
- Admin analytics, heatmap, user directory, department SLA dashboard.
- Fully responsive on phone + laptop.

## 8. Project Structure
```
cityfix/
├── backend/          # Express + MySQL API (routes, controllers, middleware, scripts)
├── database/         # schema.sql + migrations + cityfix_backup.sql
├── public/           # static assets (logo)
├── src/              # React frontend (pages, components, context, services, data)
├── package.json      # frontend dependencies & scripts (dev, build, lint)
├── vite.config.js    # Vite config + API proxy
├── tailwind.config.js
└── backend/.env      # DB + JWT configuration
```

## 9. Troubleshooting
- **Port 5000 already in use** → stop the existing process or change `PORT` in `backend/.env`.
- **Port 5173 already in use** → Vite will automatically pick the next free port.
- **`ECONNREFUSED` on 5000** → the backend is not running; start it (Step 4).
- **MySQL connection refused** → make sure MySQL is started in XAMPP.
- **Wrong DB password** → update `backend/.env` and restart the backend.