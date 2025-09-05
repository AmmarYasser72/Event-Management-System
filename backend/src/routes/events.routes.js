import { Router } from "express";
import multer from "multer";
import { addEvents, getAllEvents, getEventById, updateEvent } from "../controllers/events.controllers.js";
import { getEventBoard } from "../controllers/events.board.controllers.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";


const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/add-newEvents", requireAuth, isAdmin, upload.array("photos", 5), addEvents);
router.get("/all", getAllEvents);
router.get("/singleEvent/:id", getEventById); // <- match controller param
router.put("/updateEvent/:id", updateEvent);
router.get("/board", requireAuth, isAdmin, getEventBoard);

export default router;