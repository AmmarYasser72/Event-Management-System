import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salesStart: { type: Date, required: true },
  salesEnd: { type: Date, required: true },
  maxTicketsPerUser: { type: Number, required: true },
  maxTickets: { type: Number, required: true },
  registrations: { type: Number, default: 0 },
});
