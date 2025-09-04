import "dotenv/config.js";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Ammar_yasser1:Ammar123@cluster3.qsbottg.mongodb.net/eventX1-studio?retryWrites=true&w=majority";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

main();
