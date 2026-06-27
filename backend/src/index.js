import "dotenv/config.js";
import app from "./app.js";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await connectDB();

    if (process.env.VERCEL !== "1") {
      app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

main();

export default app;
