import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/events.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import qrRouter from "./routes/qr.routes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.status(200).json({ ok: true, uptime: process.uptime() }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/qr", qrRouter);

app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;
