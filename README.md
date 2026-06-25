# may30_AyeshaTabasum_CartShare

**CartShare** is a real-time collaborative shopping cart web application built with React, Vite, Tailwind CSS, and a Node.js/Express backend. Multiple users can share a room code, add and manage items in a shared cart, and see each other's activity live.

---

## Features Implemented

1. **User Room Access** — Enter a username to create a new room (generates a unique 6-character code) or join an existing room using a shared code.
2. **Backend Room Persistence** — Room state is saved server-side in `server/db.json` via a REST API, so data survives page refreshes and is shared across all users in the room.
3. **Shared Shopping Cart** — Add, edit, delete, and search items with quantity and price tracking. Total cost updates automatically.
4. **Live Sync (Polling)** — Dashboard polls the backend every 3 seconds so all participants see updates without refreshing.
5. **Live Activity Log** — Every action (item added, removed, user joined) is recorded with the username and timestamp.
6. **Participant Avatars** — Displays all users currently in the room with color-coded initials avatars.
7. **Printable Receipt** — Generates a print-ready receipt modal showing all items and totals.
8. **Dark Mode** — Toggle between light and dark themes; preference persists across reloads via localStorage.
9. **Responsive Layout** — Fully responsive across mobile, tablet, and desktop using Tailwind CSS breakpoints.

---

## Project Structure

```
B55_AyeshaTabasum_CartShare/
├── server/
│   ├── db.json               # JSON file used by the Express backend for persistence
│   ├── index.js              # Express backend — REST API routes
│   └── package.json          # Server dependencies
├── src/
│   ├── components/
│   │   ├── ActivityLog.jsx   # Live activity feed
│   │   ├── Cart.jsx          # Shopping cart (add/edit/delete items)
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── Participants.jsx  # Room participants display
│   │   └── Receipt.jsx       # Printable receipt modal
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main room dashboard
│   │   └── Home.jsx          # Landing page (create/join room)
│   ├── utils/
│   │   ├── api.js                  # Fetch wrappers for the REST API
│   │   ├── backendStorageUtils.js  # Room + session helpers
│   │   └── roomUtils.js            # Room code generation
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## How to Run Locally

This project has two parts — a **frontend** (React/Vite) and a **backend** (Express). Both must be running at the same time.

### Prerequisites
- Node.js v18 or higher
- npm

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/may30_AyeshaTabasum_CartShare.git
cd B55_AyeshaTabasum_CartShare
```

### Step 2 — Install frontend dependencies

```bash
npm install
```

### Step 3 — Install backend dependencies

```bash
cd server
npm install
cd ..
```

### Step 4 — Start the backend server

Open a terminal in the `server/` folder and run:

```bash
cd server
npm start
```

The backend will start at `http://localhost:4000`.

### Step 5 — Start the frontend

Open a **second terminal** in the root project folder and run:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Testing Room Functionality Across Multiple Sessions

1. Open `http://localhost:5173` in **Browser A** — create a room and note the 6-character room code.
2. Open `http://localhost:5173` in **Browser B** (or incognito) — enter a different username and paste the room code to join.
3. Add/edit/delete items in either browser — changes appear in both within a few seconds.

---

## Backend API

The Express backend exposes a minimal REST API at `http://localhost:4000/api/rooms`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rooms` | Create a new room |
| `GET` | `/api/rooms/:roomCode` | Fetch room data |
| `PUT` | `/api/rooms/:roomCode` | Update room data |
| `DELETE` | `/api/rooms/:roomCode` | Delete a room |

Room data is persisted in `server/db.json`.

---

## Useful Commands

```bash
# Frontend
npm run dev        # Start development server
npm run build      # Build for production

# Backend (run from /server folder)
npm start          # Start Express server on port 4000
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Persistence | JSON file (server/db.json) |
| Icons | Lucide React |

---

## Notes

- The backend is intentionally file-based for easy local demo and testing.
- For production deployment, replace `server/db.json` with a proper database (PostgreSQL, MongoDB, etc.).
- The frontend is deployable to Vercel or Netlify; the backend can be deployed to Render or Railway.
