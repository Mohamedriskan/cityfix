# CityFix - Smart City Incident Management Portal

**Report. Track. Improve Your City.**

CityFix is a premium, production-quality React.js and Tailwind CSS frontend prototype designed to connect citizens directly with municipal authorities. Citizens can file reports on urban issues (e.g., potholes, waste accumulation, water disruptions), track resolution progress through SLA timelines, and submit satisfaction feedback. Municipal officers and administrators are provided with a desktop-first console featuring live geospatial coordinate maps, SLA countdown dashboards, and dynamic analytics widgets.

---

## 🚀 Live Demo Accounts
To log in and experience the full application workflow, use the following credentials on the login screen. Prefill shortcuts are also available directly on the login page:

*   **Citizen Account:**
    *   **Email:** `citizen@cityfix.demo`
    *   **Password:** `CityFix123`
*   **Municipal Officer Account:**
    *   **Email:** `officer@cityfix.demo`
    *   **Password:** `CityFix123`
*   **System Admin Account:**
    *   **Email:** `admin@cityfix.demo`
    *   **Password:** `CityFix123`

---

## 🛠️ Tech Stack
*   **Core Framework:** React.js (v19) + Vite
*   **Styling & Design System:** Tailwind CSS (v3) + CSS Glassmorphism
*   **Routing:** React Router DOM (v6)
*   **Icons:** Lucide React
*   **Geospatial Maps:** Leaflet + React Leaflet + OpenStreetMap
*   **Data Visualizations:** Recharts (responsive bars, lines, and pies)
*   **State Management:** React Context API (Auth, Theme, Issues, Notifications)
*   **Persistence Layer:** Browser LocalStorage

---

## 💻 Installation & Commands
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

1.  **Clone / Download the workspace** and open a terminal inside the project directory:
    ```bash
    cd Citifix
    ```
2.  **Install dependencies** using npm:
    ```bash
    npm install
    ```
3.  **Launch the development server** locally:
    ```bash
    npm run dev
    ```
4.  **Build production assets** compiled into the `/dist` folder:
    ```bash
    npm run build
    ```

---

## 📂 Project Structure
```text
src/
├── assets/         # Project logos and image placeholders
├── components/     # Reusable React components
│   ├── common/     # Buttons, Inputs, Badges, Modals, Loaders, Timelines, Maps
│   └── layout/     # Shared layout files
├── context/        # ThemeContext, AuthContext, IssueContext, NotificationContext
├── data/           # mockData.js (Colombo coordinates, 10 categories, notifications, chats)
├── layouts/        # PublicLayout, CitizenLayout, OfficerLayout, AdminLayout wrappers
├── pages/          # Page views grouped by authorization roles
│   ├── admin/      # Overview, Analytics, HeatMap, Departments, Users, SLA settings
│   ├── citizen/    # Dashboard, ReportWizard, ReportsList, Details, Notifications
│   ├── officer/    # Dashboard, IssuesList, IssueDetails, SLA, Chat Messages, Reports compiler
│   ├── auth/       # Login, Register
│   └── transparency/# Public open data charts and mapping
├── routes/         # AppRoutes.jsx containing React Router paths and Protected gates
├── services/       # Mock services simulating async API calls to LocalStorage
└── utils/          # storage.js LocalStorage helper functions
```

---

## ⚙️ Mock Service Architecture
All services reside under `src/services/` and simulate backend interactions:
*   **LocalStorage Database:** Upon boot, mock data is seeded into browser LocalStorage. All updates (status changes, comments, department re-routing, feedback) write back to the store.
*   **Latency Simulation:** Operations return JS Promises resolving after a small delay (e.g., 300ms) to trigger visual skeleton loader states.
*   **Security Disclaimer:**
    > ⚠️ **DEVELOPER NOTE:** Authentication is simulated for prototype purposes and must be replaced with secure backend authentication (e.g. OAuth, JWT) before production. Do not store real passwords or sensitive citizen info in plain text.
# cityfix-frontend
