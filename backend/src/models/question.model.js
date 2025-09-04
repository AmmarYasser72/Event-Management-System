import mongoose from "mongoose";

export const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mandatory: { type: Boolean, default: false },
  oncePerOrder: { type: Boolean, default: false },
  type: { type: String, enum: ["Text", "Email", "Phone", "Selection", "Number"], default: "Text" },
  answers: { type: String },
});
