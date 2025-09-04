import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

// Load .env from project root (backend/.env)
dotenv.config({ path: "./.env" });

// Debug log: check env actually loaded
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Did you create backend/.env?");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed !!!", err);
  });
