import mongoose from "mongoose";
import { ticketSchema } from "./ticket.model.js";
import { questionSchema } from "./question.model.js";

const eventSchema = new mongoose.Schema(
  {
    eventCode: { type: String, required: true, unique: true, index: true },
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true },
    category: {
      type: String,
      enum: ["sports matches", "music", "exhibition", "conference"],
      required: true,
    },
    publishEvent: { type: Boolean, default: false },

    registrationStartDate: { type: Date },
    registrationStartTime: { type: String },
    registrationEndDate: { type: Date },
    registrationEndTime: { type: String },

    tickets: { type: [ticketSchema], default: [] },
    questions: { type: [questionSchema], default: [] },

    photos: [{ type: String }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
