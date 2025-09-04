import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventx";

// Cache the connection across invocations
let cached = global._mongooseCached;
if (!cached) cached = global._mongooseCached = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
