import mongoose from "mongoose";

function buildMongoUri() {
  const baseUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || "eventx";

  if (!baseUri) {
    throw new Error("Missing MongoDB configuration. Set MONGODB_URI (or MONGO_URI) in backend/.env.");
  }

  if (/^mongodb(\+srv)?:\/\/.+\/[^/?]+/.test(baseUri)) {
    return baseUri;
  }

  return `${baseUri.replace(/\/+$/, "")}/${dbName}`;
}

let cached = global._mongooseCached;
if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(buildMongoUri(), {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 15000,
      })
      .then((connection) => {
        console.log(`MongoDB connected: ${connection.connection.host}`);
        return connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
