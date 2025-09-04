// api/index.js
import serverless from "serverless-http";
import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/utils/db.js";

// Wrap your existing Express app as a Vercel serverless function
const expressHandler = serverless(app);

export default async function handler(req, res) {
  await connectDB();         // ensure MongoDB Atlas connection
  return expressHandler(req, res);
}

