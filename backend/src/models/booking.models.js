import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticketTypeId: { type: mongoose.Schema.Types.ObjectId, required: true }, // _id from event.tickets[]
    seatNumber: { type: String, default: null },
    pricePaid: { type: Number, required: true },
    qrToken: { type: String, required: true, index: true },
    redeemedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);