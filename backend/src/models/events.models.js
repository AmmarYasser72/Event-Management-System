import mongoose from "mongoose";
import { ticketSchema } from "./ticket.model.js";
import { questionSchema } from "./question.model.js";

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    startDate: { type: String },
    startTime: { type: String },
    endDate: { type: String },
    endTime: { type: String },
    category: {
      type: String,
      enum: ["sports matches", "music", "exhibition", "conference"],
      required: true,
    },
    publishEvent: { type: Boolean, default: false },

    registrationStartDate: { type: String },
    registrationStartTime: { type: String },
    registrationEndDate: { type: String },
    registrationEndTime: { type: String },

    tickets: { type: [ticketSchema], default: [] },       // ✅ embedded schema
    questions: { type: [questionSchema], default: [] },   // ✅ embedded schema

    photos: [{ type: String }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
