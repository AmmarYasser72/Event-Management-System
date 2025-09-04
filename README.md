# EventX Studio — Event Management System

An end-to-end event platform for organizers and attendees. Admins can create and manage events, track sales and engagement, and scan tickets via QR. Users can browse events, book seats, and access their tickets with QR codes — all wrapped in a modern, dark/light UI.

> **Live deploy options**
> - Full stack on Vercel (React + Serverless Express API + MongoDB Atlas)
> - Local dev with Vite proxy + Node/Express

---

## ✨ Features

### Admin
- Authentication (JWT)
- Dashboard (net sales, locations, engagement)
- Event management (Add / Edit / Delete)
- Ticket types (price, cap, registrations)
- Attendee Insights (age, gender, interests, locations) with charts
- QR verification endpoint for check-in
- Settings, notifications (UI scaffolding)

### User
- Authentication (register → success toast → auto redirect to Sign In)
- Browse events (list + filters)
- Event details (description, time, location, popularity)
- Seat selection (simple grid preview) + booking (dummy payment)
- **My Tickets** with QR codes
- Ticket details page (full booking details + QR + redeemed info)

### UI/UX
- Dark / Light theme toggle (global)
- Toast notifications
- Modern dashboard layout (sidebar + header), matching Figma mock

---

## 🧱 Tech Stack

- **Frontend**: React + Vite, Tailwind, Recharts, react-qr-code, react-hot-toast
- **Backend**: Node.js + Express.js (ESM), JWT, bcryptjs, cookie-parser, CORS
- **Database**: MongoDB (Atlas in production)
- **Deployment**: Vercel (static hosting + Node serverless functions)
- **Build Tools**: Vite, optional Vercel config

---

## 📁 Monorepo Layout

```
Event-Management-System/
├─ backend/
│  ├─ src/
│  │  ├─ app.js                  # Express app (no listen)
│  │  ├─ index.js                # local dev entry (connects & listens)
│  │  ├─ controllers/            # user, events, analytics, bookings, qr
│  │  ├─ models/                 # User, Event, Booking
│  │  ├─ routes/                 # *.routes.js
│  │  ├─ middleware/             # requireAuth, isAdmin
│  │  └─ utils/db.js             # (serverless) cached Mongo connector
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ pages/                  # Login, Register, ManageEvents, ...
│  │  ├─ components/             # adminDashBoard, layout, etc.
│  │  ├─ context/ThemeProvider.jsx
│  │  └─ lib/api.js              # axios helper (baseURL)
│  ├─ index.html
│  ├─ vite.config.js
│  └─ package.json
└─ api/
   └─ index.js                   # Vercel serverless entry (wraps Express)
```

---

## 🚀 Quick Start (Local Development)

### 0) Prerequisites
- Node.js 18+ and npm
- MongoDB running (local) **or** MongoDB Atlas connection string

### 1) Environment Variables

Create the following files:

**`backend/.env`**
```
MONGO_URI=mongodb://127.0.0.1:27017/eventx
JWT_SECRET=super-secret-string
PORT=5000
```

**`frontend/.env`** (dev)
```
VITE_API_BASE_URL=/api
```

**`frontend/.env.production`** (for production builds)
```
VITE_API_BASE_URL=https://<your-backend-domain-or-vercel-app>/api
```

### 2) Install dependencies

```bash
# from repo root
cd frontend && npm i
cd ../backend && npm i
```

### 3) Run backend (dev)

```bash
cd backend
npm run dev
# Starts on http://localhost:5000
```

### 4) Run frontend (dev)
Make sure the Vite proxy maps `/api` → `http://localhost:5000` (see `frontend/vite.config.js`).

```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

---

## 🔌 API Endpoints (Quick Reference)

Base URL (dev): `http://localhost:5000/api/v1`

### Auth
- `POST /user/register` — `{ username, email, password, role? }` → **201 + success** (frontend then redirects to `/login`)
- `POST /user/login` — `{ email, password, role }` → `{ token, user }`
- `POST /user/logout`
- `GET  /user/me` — (auth)

### Events
- `GET    /events/all`
- `GET    /events/singleEvent/:id`
- `POST   /events/add-newEvents` — (admin)
- `PATCH  /events/edit/:id` — (admin)
- `DELETE /events/:id` — (admin)

### Bookings
- `POST /bookings` — `{ eventId, ticketTypeId, seatNumber? }` (auth) → creates booking, returns QR token
- `GET  /bookings/mine` — (auth) → array of bookings
- `GET  /bookings/:id` — (auth) → full ticket details

### Analytics (Admin)
- `GET /analytics/overview` — totals + charts + demographics

### QR (Admin)
- `POST /qr/verify` — `{ token }` → validates/marks redeemed

> **Auth**: Send `Authorization: Bearer <token>` from `localStorage.userToken.token`.

---

## 🧭 Frontend Routes

Public:
- `/` — Home
- `/browse` — Browse events
- `/login` — Sign In (styled like Register)
- `/register` — Sign Up (success → redirect to `/login`)

User (auth):
- `/eventDetails?id=<eventId>` — details
- `/booking/:id` — seat selection + confirm
- `/my-tickets` — list with QR
- `/ticket/:id` — full ticket details

Admin (auth + role=admin):
- `/adminDashBoard` — overview dashboard (matches mock)
- `/manage-events` — three-column event board
- `/addnewevent` — add new event
- `/settings` — app/account settings
- `/attendee-insights` — insights page (age, gender, interests, locations)

---

## 🎨 Theming

- Global **ThemeProvider** persists theme in `localStorage` and toggles `html.dark` class.
- Use Tailwind `dark:` variants throughout (already applied).
- Header includes light/dark toggle.

---

## 🧪 Test Accounts (optional)

You can quickly create:
- An **Admin** by registering with role “admin” in the Register form.
- A **User** by registering with role “user”.

> You can pre-seed data by inserting `Event` documents with ticket arrays:
```js
tickets: [{ name: "General", price: 1000, maxTickets: 100, registrations: 0 }]
```

---

## 🛠️ Scripts

### Backend
```bash
npm run dev         # nodemon src/index.js
```

### Frontend
```bash
npm run dev         # Vite dev server (5173)
```
---
## 🤝 Contributing

1. Fork & create a feature branch
2. Keep PRs focused and small where possible
3. Add clear descriptions and screenshots for UI changes

---

## 📄 License

This project is provided as-is for educational and portfolio purposes.  
by Ammar Yasser

---