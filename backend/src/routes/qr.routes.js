import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyQR } from "../controllers/qr.controllers.js";

const router = Router();
router.post("/verify", requireAuth, isAdmin, verifyQR);
export default router;
