# EventX Studio

EventX Studio is a full-stack event management platform for organizers and attendees. Admins can create and manage events, track engagement, and scan tickets with QR codes. Users can browse events, book seats, and access their tickets from a modern responsive interface.

Live demo: https://event-management-system-3xxa-git-main-ammaryasser72s-projects.vercel.app?_vercel_share=HBwZfbVoBHKzk35qyAOxjKWHVObTuP09

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, JWT, bcryptjs
- Database: MongoDB
- Deployment: Vercel

## Features
### Admin
- Authentication and protected admin routes
- Event creation, editing, and deletion
- Ticket type management
- Dashboard metrics and attendee insights
- QR verification workflow for check-in

### User
- Registration and login flows
- Event browsing and detail pages
- Seat booking flow
- My Tickets view with QR codes
- Ticket detail page with booking metadata

## Repository Structure
`	ext
backend/
  src/
frontend/
  src/
api/
`

## Local Development
### Prerequisites
- Node.js 18+
- npm
- MongoDB local instance or Atlas connection string

### Environment Variables
Create ackend/.env:
`	ext
MONGO_URI=mongodb://127.0.0.1:27017/eventx
JWT_SECRET=your-secret
PORT=5000
`

Create rontend/.env:
`	ext
VITE_API_BASE_URL=/api
`

### Install and Run
`ash
cd frontend && npm install
cd ../backend && npm install

cd backend
npm run dev

cd ../frontend
npm run dev
`

## License
MIT