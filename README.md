# EventX Studio

**A full stack event and venue management application built with React, Express, and MongoDB.**

EventX brings event discovery, ticket booking, venue operations, and administration into one codebase, with dedicated interfaces for attendees, organizers, venue administrators, and platform administrators.

[Backend documentation](backend/docs/README.md) · [Architecture](backend/docs/architecture.md) · [API reference](backend/docs/api-reference.md) · [Setup guide](backend/docs/setup.md)

## Explore the product

- **Attendees:** event discovery, ticket details, favorites, payment history, and profile management.
- **Organizers:** event operations, hall bookings, analytics, and ticket management.
- **Venue administrators:** hall management, booking approvals, and maintenance scheduling.
- **Platform administrators:** events, categories, users, check-in, coupons, audit logs, and reports.

## Technology

| Layer | Stack |
| :--- | :--- |
| Frontend | React, Vite, Tailwind CSS, React Router, Radix UI, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose |
| API controls | JWT authentication, CSRF protection, validation, rate limiting, audit logging |
| Development | ESLint, Jest, Supertest, MongoDB Memory Server |

## Repository guide

```text
frontend/           React application and role-specific interfaces
backend/            Express API, models, controllers, and services
backend/__tests__/  Backend test suites
backend/docs/       Setup, architecture, API, security, and operations guides
```

## Run locally

1. Clone the repository and install dependencies separately in `backend/` and `frontend/` with `npm install`.
2. Configure the backend using its [setup guide](backend/docs/setup.md) and [environment reference](backend/docs/env-reference.md). Start from `backend/.env.example` and supply your own local values.
3. Configure the frontend using `frontend/.env.example` for your local API.
4. Run `npm run dev` in each directory, using separate terminals.

The backend documentation describes the API at `http://localhost:5000/api`, its health endpoint at `/api/health`, and development Swagger UI at `/api-docs`.

For transaction-sensitive workflows and deployment configuration, read the [production deployment guide](backend/docs/PRODUCTION_DEPLOYMENT.md).

## Checks and technical reading

- **Backend:** `npm run lint` and `npm test`, from `backend/`.
- **Frontend:** `npm run lint` and `npm run build`, from `frontend/`.
- [Testing guide](backend/docs/testing-guide.md), test architecture and prerequisites.
- [Security guide](backend/docs/security.md), authentication and API controls.
- [Models](backend/docs/models.md) and [service reference](backend/docs/services-reference.md), data and business logic.
- [Operations runbook](backend/docs/operations-runbook.md), runtime and troubleshooting.

The frontend test script is a placeholder; the backend contains the automated test suites. These commands describe the repository workflow, not a claim that a fresh build or test run has been performed on your machine.

## Demo availability

A publicly accessible deployment is not currently linked. The previously configured deployment led to Vercel authentication when checked on September 10, 2026. Use the local setup instructions to explore the application.

## More work

[Ammar Yasser's portfolio](https://ammar-portfolio-red.vercel.app) · [GitHub profile](https://github.com/AmmarYasser72)
