import "dotenv/config";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB } from "../src/utils/db.js";
import { Event } from "../src/models/events.models.js";
import { Booking } from "../src/models/booking.models.js";
import User from "../src/models/user.models.js";

await connectDB();

const server = app.listen(0);
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
const stamp = Date.now();

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const data = await response.json();
  return { response, data };
}

try {
  let result = await request("/api/v1/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "smoke-admin",
      email: `smoke-admin-${stamp}@test.local`,
      password: "secret123",
      role: "admin",
    }),
  });
  console.log("register_admin", result.response.status, result.data.success);

  result = await request("/api/v1/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `smoke-admin-${stamp}@test.local`,
      password: "secret123",
      role: "admin",
    }),
  });
  const adminToken = result.data.token;
  console.log("login_admin", result.response.status, result.data.success);

  const formData = new FormData();
  formData.append(
    "eventData",
    JSON.stringify({
      eventName: "Smoke Test Event",
      location: "Cairo",
      description: "Smoke test event",
      startDate: "2026-07-10",
      startTime: "18:30",
      endDate: "2026-07-10",
      endTime: "21:30",
      category: "music",
      publishEvent: true,
      registrationStartDate: "2026-07-01",
      registrationStartTime: "10:00",
      registrationEndDate: "2026-07-09",
      registrationEndTime: "20:00",
    })
  );
  formData.append(
    "tickets",
    JSON.stringify([
      {
        name: "General",
        price: 100,
        salesStart: "2026-07-01T10:00:00.000Z",
        salesEnd: "2026-07-09T20:00:00.000Z",
        maxTicketsPerUser: 2,
        maxTickets: 50,
        registrations: 0,
      },
    ])
  );
  formData.append("questions", JSON.stringify([]));

  result = await request("/api/v1/events/add-newEvents", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: formData,
  });
  const event = result.data.event;
  console.log("create_event", result.response.status, result.data.success, event?.eventCode);

  result = await request("/api/v1/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "smoke-user",
      email: `smoke-user-${stamp}@test.local`,
      password: "secret123",
      role: "user",
    }),
  });
  console.log("register_user", result.response.status, result.data.success);

  result = await request("/api/v1/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `smoke-user-${stamp}@test.local`,
      password: "secret123",
      role: "user",
    }),
  });
  const userToken = result.data.token;
  console.log("login_user", result.response.status, result.data.success);

  result = await request("/api/v1/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventId: event.id,
      ticketTypeId: event.tickets[0].id,
      seatNumber: "A-10",
    }),
  });
  const booking = result.data.booking;
  console.log("create_booking", result.response.status, result.data.success, booking?.qrCode);

  result = await request("/api/v1/qr/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qrCode: booking.qrCode }),
  });
  console.log("verify_qr", result.response.status, result.data.success, result.data.alreadyRedeemed);
} finally {
  const adminUser = await User.findOne({ email: `smoke-admin-${stamp}@test.local` });
  const normalUser = await User.findOne({ email: `smoke-user-${stamp}@test.local` });

  if (adminUser) {
    await Event.deleteMany({ organizer: adminUser._id });
  }

  if (normalUser) {
    await Booking.deleteMany({ user: normalUser._id });
  }

  await User.deleteMany({
    email: {
      $in: [`smoke-admin-${stamp}@test.local`, `smoke-user-${stamp}@test.local`],
    },
  });

  server.close();
  await mongoose.disconnect();
}
