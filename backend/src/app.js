import express from "express"
import path from "path";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import eventRouter from "./routes/events.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"
const app = express()
import { fileURLToPath } from "url";

// recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"))
app.use(cookieParser())



app.use("/api/v1/user", userRouter);
app.use("/api/v1/events" , eventRouter);
app.use("/api/v1/analytics", analyticsRouter);
export { app }