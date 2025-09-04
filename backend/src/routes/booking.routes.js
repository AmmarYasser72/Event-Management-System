import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createBooking, myBookings, getBookingById } from "../controllers/booking.controllers.js";

const router = Router();
router.post("/", requireAuth, createBooking);
router.get("/mine", requireAuth, myBookings);
router.get("/:id", requireAuth, getBookingById);
export default router;
