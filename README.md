# EventX Studio

EventX Studio is a full-stack event management platform for organizers and attendees. Admins can create and manage events, review analytics, and verify QR tickets. Users can browse events, book seats, and open their tickets from a responsive React frontend.

Live demo: [EventX Studio](https://event-management-system-3xxa-git-main-ammaryasser72s-projects.vercel.app?_vercel_share=HBwZfbVoBHKzk35qyAOxjKWHVObTuP09)

## Stack
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, JWT, bcryptjs
- Database: MongoDB with Mongoose
- Deployment: Vercel

## Key Features
- Admin authentication with protected routes
- Event creation with ticket tiers and upload support
- Unique event codes plus unique QR ticket values per booking
- Booking flow with ticket-limit enforcement
- Ticket verification endpoint for check-in
- Dashboard metrics and attendee insights

## Project Structure
```text
api/
backend/
  scripts/
  src/
frontend/
  src/
```

## Environment Setup

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=eventx
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_ORIGIN=http://localhost:5173
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Local Development

1. Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Start MongoDB locally or supply a valid Atlas URI in `backend/.env`.

3. Start the backend:

```bash
cd backend
npm run dev
```

4. Start the frontend:

```bash
cd frontend
npm run dev
```

## Verification

- Frontend production build:

```bash
cd frontend
npm run build
```

- Backend smoke test:

```bash
cd backend
npm test
```

The smoke test runs register -> login -> create event -> book ticket -> verify QR against a temporary local dataset, then cleans up after itself.

## Notes

- The backend now expects `MONGODB_URI` and `DB_NAME` instead of hardcoded Mongo credentials.
- Existing secrets that were previously committed should be rotated before any public deployment.

## License

MIT
