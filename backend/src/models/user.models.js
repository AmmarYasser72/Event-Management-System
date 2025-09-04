import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, select: false, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },

    // NEW: demographics for analytics
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not", null], default: null },
    interests: { type: [String], default: [] },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export { User };
export default User;
